const gameController = require('./game.controller');

function playerMove(data, client, io){
  if(data.type == "MOVE"){
    io.emit(data.roomId, {
      ...data, 
      type: "MOVE"
    });
    
    io.emit(data.roomId, {
      type: "TURN",
      player: gameController.getOpponentPlayer(data.roomId, client.id)
    })
  }

  if(data.type == "NEW_GAME"){
    io.emit(data.roomId, {
      type: "NEW_GAME"
    });

    io.emit(data.roomId, {
      type: 'MESSAGE',
      to: "all",
      title: 'New Game Started'
    })
  }
}

function getPlayer(data, client, io){
  const availablePlayer = gameController.getRoomFreePlayer(data.roomId, client.id);
  if(availablePlayer.player){
    io.emit(data.roomId, {
      type: 'MESSAGE',
      title: 'Player Joined',
      to: gameController.getOpponentPlayer(data.roomId, client.id)
    })

    client.emit('GET_PLAYER', {
      player: availablePlayer.player
    });

    if(availablePlayer.isBothJoined){
      io.emit(data.roomId, {
        type: 'TURN',
        player: client.id
      });

      io.emit(data.roomId, {
        type: 'MESSAGE',
        to: client.id,
        title: "You can start the game."
      });
    }
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
