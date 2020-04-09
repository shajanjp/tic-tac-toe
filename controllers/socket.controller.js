const gameController = require('./game.controller');

function handleConnecion(io){
  io.on('connection', (client) => {
    console.log('client connected');

    client.on('PLAYER_MOVE', (data) => {
      if(data.type == "MOVE"){
        // gameController.markMove(data);
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
    })

    client.on('GET_PLAYER', (data) => {
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
    })

    client.on('disconnect', () => {
      gameController.removeFromGame(client.id);
      console.log('disconnected');
    });
  })
}

module.exports = handleConnecion;
