import initializeGame from "./lib/Game.js";

async function runGame() {
  const game = await initializeGame();
  console.log("Enemy", game.currentEnemy);
  console.log("Player", game.player);
  console.log("Game initialized");
}

runGame();
