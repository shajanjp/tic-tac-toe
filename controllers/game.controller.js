let gameEngine = require('../libs/game-logic.js');

function gamePage(req, res){
  res.render('index.ejs', {
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
      description: "Please create a new game"
    });
  }
}

function getRoomFreePlayer(roomId, playerSocket){
  const playersStatus = {}
  playersStatus.isBothJoined = false;

  global.gameStore[roomId] = global.gameStore[roomId] ? global.gameStore[roomId] : { "players": {}, moves: new Array(9).fill(null) };
  let currentGame = global.gameStore[roomId];
  
  if(!currentGame.players["tic"]){
    currentGame.players["tic"] = playerSocket;
    playersStatus.player = 'tic';
  }
  else if (!currentGame.players["tac"]) {
    currentGame.players["tac"] = playerSocket;
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
    if(global.gameStore[roomId]["players"]["tic"] == clientId){
      delete global.gameStore[roomId]["players"]["tic"];
    }
    if(global.gameStore[roomId]["players"]["tac"] == clientId){
      delete global.gameStore[roomId]["players"]["tac"];
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

module.exports = {
  gamePage,
  roomById,
  getRoomFreePlayer,
  removeFromGame,
  getOpponentPlayer,
  calcMove,
  newGame
}