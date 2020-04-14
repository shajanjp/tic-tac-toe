let gameEngine = require('../libs/game-logic.js');

function gamePage(req, res){
  res.render('game.ejs', {
    roomId: res.locals.roomId
  });
}

function roomById(req, res, next, roomId){
  if(roomId.split('-').length == 2){
    res.locals.roomId = roomId;
    next();
  }
  else{
    res.render('message.ejs', {
      title: "Invalid Game URL",
      description: "Please create a <a href='/'>new game.</a>"
    });
  }
}

function createGamePage(req, res){
  res.render('create-game.ejs');
}

function getRoomFreePlayer(roomId, clientId){
  const playersStatus = {}
  playersStatus.isBothJoined = false;

  global.gameStore[roomId] = global.gameStore[roomId] ? global.gameStore[roomId] : { "players": {}, score: {}, moves: new Array(9).fill(null) };
  let currentGame = global.gameStore[roomId];
  
  if(!currentGame.players["tic"]){
    currentGame.players["tic"] = clientId;
    playersStatus.player = 'tic';
  }
  else if (!currentGame.players["tac"]) {
    currentGame.players["tac"] = clientId;
    playersStatus.player = 'tac';
  }
  else{
    playersStatus.player = false;
  }

  if(currentGame.players["tic"] && currentGame.players["tac"]){
    playersStatus.isBothJoined = true; 
  }

  return playersStatus;
}

function getOpponentPlayer(roomId, clientId){
  let gamePlayers = global.gameStore[roomId]["players"];
  return gamePlayers["tic"] == clientId ? gamePlayers["tac"] : gamePlayers["tic"];
}

function removeFromGame(clientId){
  for(const roomId in global.gameStore){
    const currentRoom = global.gameStore[roomId];

    if(currentRoom["players"]["tic"] == clientId){
      delete currentRoom["players"]["tic"];
    }

    if(currentRoom["players"]["tac"] == clientId){
      delete currentRoom["players"]["tac"];
    }

    if(currentRoom["players"]["tic"] === undefined && currentRoom["players"]["tac"] === undefined){
      console.log('removing room: ', roomId);
      delete currentRoom;
    }
  }
}

function getPlayer(roomId, clientId){
  let gamePlayers = global.gameStore[roomId]["players"];
  return gamePlayers["tic"] == clientId ? gamePlayers["tic"] : gamePlayers["tac"];
}

function calcMove(roomId, clientId, move){
  const currentGame = global.gameStore[roomId];
  currentGame.moves[move - 1] = getPlayer(roomId, clientId);
  const gameStatus = gameEngine.checkIfWon(currentGame.moves, getPlayer(roomId, clientId));
  return gameStatus;
}

function newGame(roomId){
  const currentGame = global.gameStore[roomId];
  currentGame.moves = new Array(9).fill(null);
}

function getPlayerNick(roomId, clientId){
  const currentGame = global.gameStore[roomId];
  if(currentGame["tic"] === clientId){
    return 'tic';
  }
  if(currentGame["tac"] === clientId){
    return 'tac';
  }

}

function logWin(roomId, clientId){
  const currentGame = global.gameStore[roomId];
}


module.exports = {
  calcMove,
  createGamePage,
  gamePage,
  getOpponentPlayer,
  getPlayer,
  getRoomFreePlayer,
  newGame,
  removeFromGame,
  roomById,
}