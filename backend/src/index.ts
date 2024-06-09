import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	}
});

io.on('connection', (socket: Socket) => {
	console.log('a user connected, socket.id:', socket.id);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
})
