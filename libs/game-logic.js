let columnData = [1,1,1,1,0,1,0,1,null]
let player = 1;

checkIfWon(player, columnData)
function checkIfWon(player, columnData){
  let winner = '';
  const winArray = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];
  let isWin = winArray.some(arr =>  {
    return arr.every(prop => {
      return (columnData[prop] === player)
    })
  });
  const gameOver = columnData.includes(null);
 return (isWin, !gameOver);
  

}

module.exports = {
  checkIfGameOver
}