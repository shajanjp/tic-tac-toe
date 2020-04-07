const socket = io.connect('');
const columns = document.getElementsByTagName('td');
let isMyTurn = true;
let myPlayer = '';
const notificationContainer = document.getElementsByClassName('notifications-container')[0];
const newGameButton = document.getElementsByClassName('new-game')[0];

function replaceClass(element, value){
  if(value == "tic"){
    element.classList.remove("tac");
    element.classList.add("tic");
  }
  else if(value == "tac"){
    element.classList.remove("tic");
    element.classList.add("tac");  
  }
  else{
    element.classList.remove("tac");
    element.classList.remove("tic");
  }
}

function markColumn(element, value){
  element.setAttribute("data-value", value);
  replaceClass(element, value);
}

const columnClicked = function() {
  if(isMyTurn){
    const currentColumn = parseInt(this.getAttribute("data-col"));
    const currentSign = this.getAttribute("data-value");
    if(currentSign === null || currentSign === ""){
      markColumn(this, myPlayer);
      socket.emit('PLAYER_MOVE', {
        roomId,
        type: "MOVE",
        move: currentColumn,
        player: myPlayer 
      })
    }
    // This can be used as undo
    // else if(currentSign == myPlayer){
    //   markColumn(this, '');
    // }
  }
};

function addNotificaion(data){
  let newNotification = document.createElement("DIV");
  newNotification.classList.add("notification");
  newNotification.appendChild(document.createTextNode(data.title));
  notificationContainer.appendChild(newNotification);
  setTimeout(() => {
    newNotification.remove();
  }, 5000)
}

function startNewGame(){
  for(let i = 0; i < columns.length; i++) {
    markColumn(columns[i], null);
  }
}

newGameButton.addEventListener('click', () => {
  startNewGame();
  socket.emit('PLAYER_MOVE', {
    type: 'NEW_GAME',
    roomId
  })
});

for(let i = 0; i < columns.length; i++) {
  columns[i].addEventListener('click', columnClicked);
}

socket.on('connect', () => {
  socket.emit('GET_PLAYER', { roomId });
})

socket.on('GET_PLAYER', (playerData) => {
  myPlayer = playerData.player;
})

socket.on(roomId, (data) => {
  if(data.type == "MOVE"){
    markColumn(document.getElementsByClassName(`col-${data.move}`)[0], data.player)
  }
  if(data.type == "MESSAGE" && (socket.id === data.to || data.io === undefined)){
    addNotificaion({
      title: data.title
    })
  }
  if(data.type == "NEW_GAME"){
    startNewGame();
  }
})
