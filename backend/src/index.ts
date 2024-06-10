import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { assert } from 'console';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOpts: cors.CorsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
	credentials: true,
};

app.use(cors(
	corsOpts,
));

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

io.on('connection', (socket: Socket) => {
	console.log('a user connected, socket.id:', socket.id);

	socket.on('start', () => {
		console.log("server fired event `start` from id:", socket.id);
		if (q1 != null) {
			startSession({ id1: socket.id, id2: q1, id1Q: 1, id2Q: 1 });
			q1 = null;
		} else if (q2 != null) {
			startSession({ id1: socket.id, id2: q2, id1Q: 2, id2Q: 2 });
			q2 = null;
		} else {
			q1 = socket.id;
		}
	})

	socket.on("skip", () => {
		console.log("server fired event `skip` from id:", socket.id);
		let session: Session | null = null;
		activeSessions = activeSessions.filter((s) => {
			if (s.id1 === socket.id || s.id2 === socket.id) {
				session = s;
				return true;
			} else {
				return false;
			}
		});
		assert(session != null);

		// person who fires skip event
		const me: { id: string, q: number }

		if (q1 != null) {
			startSession({ id1: socket.id, id2: q1, id1Q: 1, id2Q: 1 });
		} else {
			q1 = session!.id1;
		}
		if (q2 != null) {
			startSession({ id1: socket.id, id2: q2, id1Q: 2, id2Q: 2 });
		} else {
			q2 = session!.id2;
		}


	});

	socket.on('disconnect', () => {
		console.log('a user disconnected, socket.id:', socket.id);
	})
});

function startSession({ id1, id2, id1Q, id2Q }: Session) {
	console.log(`session starting: ${id1}/${id1Q} with ${id2}/${id2Q}`);
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
})
