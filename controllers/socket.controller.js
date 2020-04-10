const gameController = require('./game.controller');

function playerMove(data, client, io){
  if(data.type == "MOVE"){
    io.emit(data.roomId, {
      ...data, 
      type: "MOVE"
    });

    let gameStatus = gameController.calcMove(data.roomId, client.id, data.move);
    
    if(gameStatus.isWin){
      // gameController.logWin(data.roomId, client.id);
      io.emit(data.roomId, {
        type: 'MESSAGE',
        to: client.id,
        title: 'You won !'
      });
      io.emit(data.roomId, {
        type: 'MESSAGE',
        to: gameController.getOpponentPlayer(data.roomId, client.id),
        title: 'Your opponent won the game.'
      });
    }
    else if(gameStatus.isGameOver){
      io.emit(data.roomId, {
        type: 'MESSAGE',
        to: "all",
        title: 'Game Over'
      })
    }
    else{
      io.emit(data.roomId, {
        type: "TURN",
        player: gameController.getOpponentPlayer(data.roomId, client.id)
      })
    }
  }

  if(data.type == "NEW_GAME"){
    io.emit(data.roomId, {
      type: "TURN",
      player: gameController.getPlayer(data.roomId, client.id)
    })
    gameController.newGame(data.roomId);

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
      gameController.newGame(data.roomId);

      io.emit(data.roomId, {
        type: "NEW_GAME"
      });

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
    else {
      io.emit(data.roomId, {
        type: 'MESSAGE',
        to: client.id,
        title: "Please share this page with your opponent."
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
