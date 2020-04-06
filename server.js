let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let PORT = process.env.PORT || 3000;
let HOSTNAME = process.env.HOSTNAME || `http://localhost:${PORT}`;

app.set('view engine', 'ejs');
app.use('/assets', express.static('public/assets'))

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/:roomId', (req, res) => {
  res.render('index.ejs', {});
});

app.param('roomId', (req, res, next, roomId) => {
  if(roomId.split('-').length == 2){
    next()
  }
  else{
    res.render('message.ejs', {
      title: "Invalid Game URL",
      description: "Please create a new game"
    });
  }
})

io.on('connection', (client) => {
  console.log('client connected');

  client.on('PLAYER_MOVE', (data) => {
    io.emit('PLAYER_MOVE', data);
  })

  client.on('disconnect', () => {
    console.log('disconnected');
  });
})

http.listen(PORT, () => {
  console.log(`Server started at: ${ HOSTNAME }`);
});