require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const visitsRoutes = require('./routes/visits');
const parkingSpaceRoutes = require('./routes/parkingSpace');
const packagesRoutes = require('./routes/packages');
const timerConfigRoutes = require('./routes/timerConfig');
const residenceRoutes = require('./routes/residence');

const app = express();
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const io = new Server(server, { cors: { origin: frontendUrl } });

global.io = io;

app.use(express.json());
app.use(cors({ origin: frontendUrl }));
app.get('/', (req, res) => res.json({ message: 'EdiReg API' }));
app.use('/api/visits', visitsRoutes);
app.use('/api/parkingSpace', parkingSpaceRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/timerConfig', timerConfigRoutes);
app.use('/api/residence', residenceRoutes);

io.on('connection', (socket) => socket.on('disconnect', () => {}));

mongoose.connect(process.env.MONG_URI)
	.then(() => server.listen(process.env.PORT || 4000, () => console.log(`EdiReg API listening on port ${process.env.PORT || 4000}`)))
	.catch((error) => console.error('MongoDB connection error:', error.message));

require('./scheduler');
module.exports = { app, server };
