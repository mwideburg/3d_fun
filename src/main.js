import { GameScene } from './scenes/GameScene';

const game = new GameScene()
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset Game';
resetButton.style.position = 'absolute';
resetButton.style.top = '10px';
resetButton.style.left = '10px';
resetButton.addEventListener('click', () => {
    game.resetGame();
});
document.body.appendChild(resetButton);

const scoreDiv = document.createElement('div');
scoreDiv.innerText = `Score: ${game.score}`;
scoreDiv.id = 'score-div'
scoreDiv.style.position = 'absolute';
scoreDiv.style.top = '10px';
scoreDiv.style.right = '10px';
scoreDiv.style.color = 'white';
document.body.appendChild(scoreDiv);

const gameOverDiv = document.createElement('div')
gameOverDiv.innerHTML = `
    <p> Game Over </p>
    <p id='game-score'> Score:  ${game.score} </p
`
gameOverDiv.id = 'game-over-div'
gameOverDiv.style.position = 'absolute';
gameOverDiv.style.top = '50%';
gameOverDiv.style.left = '50%';
gameOverDiv.style.transform = 'translate(-50%, -50%)';
gameOverDiv.style.fontSize = '36px'
gameOverDiv.style.zIndex = '5'
gameOverDiv.style.color = '#ffffff';
gameOverDiv.style.textAlign = 'center';
gameOverDiv.style.display = 'none'
document.body.appendChild(gameOverDiv);