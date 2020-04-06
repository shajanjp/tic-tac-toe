function gamePage(req, res){
  global.gameStore[res.locals.roomId] = global.gameStore[res.locals.roomId] ? global.gameStore[res.locals.roomId] : { "players": {} };
  let currentGame = global.gameStore[res.locals.roomId] 
  
  if(!currentGame.players.tic){
    currentGame.players["tic"] = 'DUM';
    res.render('index.ejs', {currentPlayer : "tic"});
  }
  else{
    currentGame.players["tac"] = 'DAM';
    res.render('index.ejs', {currentPlayer : "tac"});
  }
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

module.exports = {
  gamePage,
  roomById
}