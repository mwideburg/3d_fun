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