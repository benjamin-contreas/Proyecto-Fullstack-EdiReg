require('dotenv').config();
const express = require('express');
const visitsRoutes = require('./routes/visits');
const parkingSpaceRoutes = require('./routes/parkingSpace');
const packagesRoutes = require('./routes/packages');
const timerConfigRoutes = require('./routes/timerConfig');
const residenceRoutes = require('./routes/residence');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// Express app
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

global.io = io;

// Middleware

app.use(express.json());
const corsOptions = {
	origin: 'http://localhost:3000', // Allow only the React app to connect
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});
app.use(cors());

// Routes
app.get('/', (req, res) => {
	res.json({ mssg: 'Welcome to the app' });
});
app.use('/api/visits', visitsRoutes);
app.use('/api/parkingSpace', parkingSpaceRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/timerConfig', timerConfigRoutes);
app.use('/api/residence', residenceRoutes);

io.on('connection', (socket) => {
	// skipcq: JS-0002
	console.log('A user connected');
	socket.on('disconnect', () => {
		// skipcq: JS-0002
		console.log('User disconnected');
	});
});

// Connect to DB
mongoose
	.connect(process.env.MONG_URI)
	.then(() => {
		// Listen for requests
		server.listen(process.env.PORT, () => {
			console.log('Connected to DB & listening on port', process.env.PORT);
		});
	})
	.catch((err) => {
		console.log(err);
	});

require('./scheduler.js');
module.exports = { app };
