function gamePage(req, res){
  res.render('index.ejs', {
    roomId: res.locals.roomId
  });
}

function roomById(req, res, next, roomId){
  if(roomId.split('-').length == 2){
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
  global.gameStore[roomId] = global.gameStore[roomId] ? global.gameStore[roomId] : { "players": {} };
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
    return '';
  }
}

function removeFromGame(clientId){
  for(const roomId in global.gameStore){
  // remove client from game
  }
}

module.exports = {
  gamePage,
  roomById,
  getRoomFreePlayer,
  removeFromGame
}