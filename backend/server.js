require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { accessControlFromEnvironment, createApp } = require('./app');
const { createSocketAuthorization } = require('./middleware/auth');
const { PERMISSIONS } = require('./middleware/permissions');

const accessControl = accessControlFromEnvironment(process.env);
const app = createApp({ accessControl });
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const io = new Server(server, { cors: { origin: frontendUrl } });

global.io = io;

io.use(createSocketAuthorization(accessControl, PERMISSIONS.READ_OPERATIONS));

io.on('connection', (socket) => socket.on('disconnect', () => {}));

mongoose.connect(process.env.MONG_URI)
	.then(() => server.listen(process.env.PORT || 4000, () => console.log(`EdiReg API listening on port ${process.env.PORT || 4000}`)))
	.catch((error) => console.error('MongoDB connection error:', error.message));

require('./scheduler');
module.exports = { app, server };
