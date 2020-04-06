const columns = document.getElementsByTagName('td');
let mySign = 'tic';
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
      markColumn(this, mySign);
    }
    else if(currentSign == mySign){
      markColumn(this, '');
    }
  }
};

for(let i = 0; i < columns.length; i++) {
  console.log('attaching');
  columns[i].addEventListener('click', columnClicked);
}