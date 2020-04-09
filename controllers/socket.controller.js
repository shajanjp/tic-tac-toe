const gameController = require('./game.controller');

function playerMove(data, client, io){
  if(data.type == "MOVE"){
    io.emit(data.roomId, {
      ...data, 
      type: "MOVE"
    });
  }
  if(data.type == "NEW_GAME"){
    io.emit(data.roomId, {
      type: "NEW_GAME"
    });

    io.emit(data.roomId, {
      type: 'MESSAGE',
      title: 'New Game Started'
    })
  }
}

function getPlayer(data, client, io){
  const availablePlayer = gameController.getRoomFreePlayer(data.roomId, client.id);
  if(availablePlayer){
    io.emit(data.roomId, {
      type: 'MESSAGE',
      title: 'Player Joined',
      to: gameController.getOpponentPlayer(data.roomId, client.id)
    })

    client.emit('GET_PLAYER', {
      player: availablePlayer
    });
  }
}

function handleConnecion(io){
  io.on('connection', (client) => {
    console.log('client connected');

    client.on('PLAYER_MOVE', (data) => {
      playerMove(data, client, io);
    });

    client.on('GET_PLAYER', (data) => {
      getPlayer(data, client, io);
    });

    client.on('disconnect', () => {
      gameController.removeFromGame(client.id);
      console.log('disconnected');
    });
  })
}

module.exports = handleConnecion;
