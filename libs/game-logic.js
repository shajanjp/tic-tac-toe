function checkIfWon(player, columnData){
  const winArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
  const gameOver = columnData.includes(null);

  let isWin = winArray.some(arr =>  {
    return arr.every(prop => {
      return (columnData[prop] === player)
    })
  });

  return {
    isWin, 
    isGameOver: !gameOver
  };
}

module.exports = {
  checkIfWon
}
