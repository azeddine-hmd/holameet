import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors, { CorsOptions } from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOpts: CorsOptions = {
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


io.on('connection', (socket: Socket) => {
	console.log('a user connected, socket.id:', socket.id);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
})
