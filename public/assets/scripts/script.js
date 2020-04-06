const socket = io.connect('');
const columns = document.getElementsByTagName('td');
let isMyTurn = true;
let myPlayer = '';

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

for(let i = 0; i < columns.length; i++) {
  columns[i].addEventListener('click', columnClicked);
}

socket.on('connect', () => {
  socket.emit('GET_PLAYER', { roomId });
})

socket.on('GET_PLAYER', (playerData) => {
  myPlayer = playerData.player;
})

socket.on(roomId, (movement) => {
  markColumn(document.getElementsByClassName(`col-${movement.move}`)[0], movement.player)
})
