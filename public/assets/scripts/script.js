const socket = io.connect('');
const columns = document.getElementsByTagName('td');
let isMyTurn = true;

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
    const currentSign = this.getAttribute("data-value");
    if(currentSign === null || currentSign === ""){
      markColumn(this, myPlayer);
    }
    else if(currentSign == myPlayer){
      markColumn(this, '');
    }
  }
};

for(let i = 0; i < columns.length; i++) {
  columns[i].addEventListener('click', columnClicked);
}
