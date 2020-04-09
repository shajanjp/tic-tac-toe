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
  global.gameStore[roomId] = global.gameStore[roomId] ? global.gameStore[roomId] : { "players": {}, moves: new Array(9).fill(null) };
  let currentGame = global.gameStore[roomId];

  if(!global.gameStore[roomId].players["tic"]){
    global.gameStore[roomId].players["tic"] = playerSocket;
    return 'tic';
  }
  else if (!global.gameStore[roomId].players["tac"]) {
    global.gameStore[roomId].players["tac"] = playerSocket;
    return 'tac';
  }
  else{
    return false;
  }
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

module.exports = {
  gamePage,
  roomById,
  getRoomFreePlayer,
  removeFromGame,
  getOpponentPlayer
}