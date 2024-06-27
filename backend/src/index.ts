import express from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { assert } from "console";
import https from "https";
import fs from "fs";

dotenv.config();

const app = express();
const server = https.createServer({ 
  key: fs.readFileSync('cert.key'),
  cert: fs.readFileSync('cert.crt')
}, app);

const corsOpts: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOpts));

const io = new Server(server, {
  cors: corsOpts,
});


interface Session {
  id1: string;
  id2: string;
}

let activeSessions: Session[] = [];
let q1: string | null = null;
let q2: string | null = null;

io.on("connection", (socket: Socket) => {
  console.info("[EVENT]: user connected, socket.id:", socket.id);

  socket.on("start", () => {
    console.info("[EVENT]: fired `start` event by id:", socket.id);
    if (q1 === socket.id || q2 === socket.id) {
      socket.emit("error", "you're already in queue");
      return;
    }
    if (q1 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: socket.id, id2: q1 });
      startSession(socket1, socket2);
      q1 = null;
    } else if (q2 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: socket.id, id2: q2 });
      startSession(socket1, socket2);
      q2 = null;
    } else {
      console.log("[SERVER]: id:", socket.id, " is set to q1");
      q1 = socket.id;
    }
  });

  socket.on("skip", () => {
    console.info("[EVENT]: fired `skip` event by id:", socket.id);

    const session = removeSession(socket.id);
    // assert(session != null);
    if (!session) {
      console.log("You're not in session for a skip. ignoring...");
      return;
    }
    // finding session for person who fires skip event
    if (q1 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: session!.id1, id2: q1 });
      startSession(socket1, socket2);
      q1 = null;
    } else {
      console.log("[SERVER]: id:", session!.id1, " is set to q1");
      q1 = session!.id1;
    }

    // finding session for other person who been skiped on
    if (q2 != null) {
      const [socket1, socket2] = getSessionSockets({ id1: session!.id2, id2: q2 });
      startSession(socket1, socket2);
      q2 = null;
    } else {
      console.log("[SERVER]: id:", session!.id2, " is set to q2");
      q2 = session!.id2;
    }
  });

  socket.on("disconnect", () => {
    console.info("[EVENT]: a user disconnected, socket.id:", socket.id);
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

function getSessionSockets(session: Session): [Socket, Socket] {
  const result: [Socket | null, Socket | null] = [null, null];
  io.sockets.sockets.forEach((s) => {
    if (s.id === session.id1) result[0] = s;
    else if (s.id === session.id2) result[1] = s;
  });
  assert(result[0] != null && result[1] != null);
  return [result[0]!, result[1]!];
}

function startSession(socket1: Socket, socket2: Socket) {
  console.info(
    `[SESSION]: starting session for ${socket1.id} and ${socket2.id}`
  );
  activeSessions.push({ id1: socket1.id, id2: socket2.id });
  socket1.emit("session started", "sending message to client 1");
  socket2.emit("session started", "sending message to client 2");
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.info(`[server]: server is running at https://localhost:${port}`);
});
