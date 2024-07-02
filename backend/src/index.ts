import express from 'express';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import { assert } from 'console';

dotenv.config();

const app = express();
const server = https.createServer({ 
  key: process.env.NODE_ENV === "development" ? fs.readFileSync('cert.key') : undefined,
  cert: process.env.NODE_ENV === "development" ? fs.readFileSync('cert.crt'): undefined,
}, app);

const corsOpts: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOpts));

const io = new Server(server, {
  cors: corsOpts,
});

const port = process.env.PORT || "3000";
server.listen(port, () => {
  console.info(`[server]: server is running at https://localhost:${port}`);
});


interface Session {
  id1: string;
  id2: string;
  rtcInfo?: {
    offer: any;
    offererIceCandidates: any[];
    answer?: any;
    answererIceCandidates: any[];
  };
}

let activeSessions: Session[] = [];
let q1: string | null = null;
let q2: string | null = null;

io.on('connection', (socket: Socket) => {
  console.info('[EVENT]: user connected, socket.id:', socket.id);

  socket.on('start', () => {
    console.info('[EVENT]: fired `start` event by id:', socket.id);
    if (q1 === socket.id || q2 === socket.id) {
      socket.emit('error', 'you\'re already in queue');
      return;
    }
    if (q1 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: socket.id, id2: q1 });
      startSession(socket1!, socket2!);
      q1 = null;
    } else if (q2 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: socket.id, id2: q2 });
      startSession(socket1!, socket2!);
      q2 = null;
    } else {
      console.log('[SERVER]: id:', socket.id, ' is set to q1');
      q1 = socket.id;
    }
  });

  socket.on('skip', () => {
    console.info('[EVENT]: fired `skip` event by id:', socket.id);

    const session = removeSession(socket.id);
    // assert(session != null);
    if (!session) {
      console.log('You\'re not in session for a skip. ignoring...');
      return;
    }
    const [_, socket2] = getSessionSockets(session);
    if (session.id1 === socket.id) {
      socket2?.emit("stop session");
    }

    // finding session for person who fires skip event
    if (q1 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: session!.id1, id2: q1 });
      startSession(socket1!, socket2!);
      q1 = null;
    } else {
      console.log('[SERVER]: id:', session!.id1, ' is set to q1');
      q1 = session!.id1;
    }

    // finding session for other person who been skiped on
    if (q2 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: session!.id2, id2: q2 });
      startSession(socket1!, socket2!);
      q2 = null;
    } else {
      console.log('[SERVER]: id:', session!.id2, ' is set to q2');
      q2 = session!.id2;
    }
  });

  socket.on('disconnect', () => {
    console.info('[EVENT]: a user disconnected, socket.id:', socket.id);
    if (q1 === socket.id) q1 = null;
    if (q2 === socket.id) q2 = null;
    const session = removeSession(socket.id);
    if (session) {
      let otherSocket: Socket | null = null;
      if (socket.id === session.id1) {
        io.sockets.sockets.forEach((s) => {
          otherSocket = s;
          return s.id === session.id2;
        });
        if (otherSocket) {
          (otherSocket as Socket).emit('stop session');
        }
      } else if (socket.id === session.id2) {
        io.sockets.sockets.forEach((s) => {
          otherSocket = s;
          return s.id === session.id1;
        });
        if (otherSocket)
          (otherSocket as Socket).emit('stop session');
      }
    }
  });

  socket.on('newOffer', (newOffer: any) => {
    console.info('[EVENT]: recieved a new offer, socket.id:', socket.id);
    const session = getCurrentSession(socket.id);
    if (!session) {
      socket.emit('error', 'no active session found');
      return;
    }
    if (session?.rtcInfo) {
      socket.emit('error', 'rtc info already exists');
    }
    session.rtcInfo = {
      offer: newOffer,
      offererIceCandidates: [],
      answer: null,
      answererIceCandidates: [],
    };
    const [socket1, socket2] = getSessionSockets(session);
    if (!socket1 || !socket2) {
      return;
    }
    socket2.emit('newOfferAwaiting', newOffer);
  });

  socket.on('newAnswer', (newAnswer: any) => {
    console.info('[EVENT]: recieved a new answer, socket.id:', socket.id);
    const session = getCurrentSession(socket.id);
    if (!session) {
      socket.emit('error', 'no active session found');
      return;
    }
    if (!session?.rtcInfo) {
      socket.emit('error', 'rtc info doesn\'t exists');
    }
    const [socket1, socket2] = getSessionSockets(session);
    if (!socket1 || !socket2) {
      return;
    }
    session.rtcInfo!.answer = newAnswer;
    socket1.emit('answerResponse', newAnswer);

    // send ice candidates to both clients 
    // socket1.emit('receive icecandidate', session.rtcInfo?.answererIceCandidates);
    // socket2.emit('receive icecandidate', session.rtcInfo?.offererIceCandidates);
  })

  socket.on('send icecandidate', (...args: any[]) => {
    console.info('[EVENT]: recieved ice candidate, socket.id:', socket.id);
    const { iceCandidate }: { iceCandidate: RTCIceCandidate } = args[0];
    // console.log("[SERVER] iceCandidate:", iceCandidate);
    const session = getCurrentSession(socket.id);
    if (!session) {
      socket.emit('error', 'no active session found');
      return;
    }
    const [socket1, socket2] = getSessionSockets(session);
    if (!socket1 || !socket2) {
      return;
    }
    if (session.id1 === socket.id) {
      // we are offerer
      assert(session.rtcInfo != undefined);
      session.rtcInfo?.offererIceCandidates.push(iceCandidate);
      socket2.emit("receive icecandidate", iceCandidate);
    } else {
      // we are answerer
      assert(session.rtcInfo != undefined);
      session.rtcInfo?.answererIceCandidates.push(iceCandidate);
      socket1.emit("receive icecandidate", iceCandidate);
    }
  })

  // socket.on("get icecandidate", (ackFn: (...args: any[]) => void) => {
  //   const session = getCurrentSession(socket.id);
  //   if (!session) {
  //     socket.emit('error', 'no active session found');
  //     return;
  //   }
  //   if (session.id1 === socket.id) {
  //     // we are offerer
  //     assert(session.rtcInfo != undefined);
  //     ackFn(session.rtcInfo?.answererIceCandidates);
  //   } else {
  //     // we are answerer
  //     assert(session.rtcInfo != undefined);
  //     ackFn(session.rtcInfo?.offererIceCandidates);
  //   }
  // });
});

function removeSession(socketId: string): Session | null {
  // remove session from active sessions
  let session: Session | null = null;
  activeSessions = activeSessions.filter((s) => {
    if (s.id1 === socketId || s.id2 === socketId) {
      session = s;
      return true;
    } else {
      return false;
    }
  });
  return session;
}

function getCurrentSession(socketId: string): Session | null {
  const found =  activeSessions.find((session) => (session.id1 === socketId || session.id2 === socketId));
  if (!found)
    return null;
  return found;
}

function getSessionSockets(session: Session): [Socket | null, Socket | null] {
  const result: [Socket | null, Socket | null] = [null, null];
  io.sockets.sockets.forEach((s) => {
    if (s.id === session.id1) result[0] = s;
    else if (s.id === session.id2) result[1] = s;
  });
  return [result[0]!, result[1]!];
}

function startSession(socket1: Socket, socket2: Socket) {
  console.info(
    `[SESSION]: starting session for ${socket1.id} and ${socket2.id}`
  );
  activeSessions.push({ id1: socket1.id, id2: socket2.id });
  socket1.emit('session started', 'sending message to client 1');
  // socket2.emit('session started', 'sending message to client 2');
}
