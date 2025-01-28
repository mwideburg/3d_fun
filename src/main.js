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