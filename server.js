const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let PORT = process.env.PORT || 3000;
let HOSTNAME = process.env.HOSTNAME || `http://localhost:${PORT}`;
const gameController = require('./controllers/game.controller.js');
const socketController = require('./controllers/socket.controller.js');

global.gameStore = {};

app.set('view engine', 'ejs');
app.use('/assets', express.static('public/assets'))

app.get('/', gameController.createGamePage);
app.get('/:roomId', gameController.gamePage);
app.param('roomId', gameController.roomById);

socketController(io);

http.listen(PORT, () => {
  console.log(`Server started at: ${ HOSTNAME }`);
});