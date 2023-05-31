import inquirer from "inquirer";
import Enemy from "./Enemy.js";
import Player from "./Player.js";

async function initializeGame() {
  const game = new Game();
  await game.promptForName();
  game.initializeGame();
  return game;
}

function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy = null;
  this.player = null;
}

Game.prototype.initializeGame = function () {
  this.enemies.push(new Enemy("goblin", "sword"));
  this.enemies.push(new Enemy("orc", "baseball bat"));
  this.enemies.push(new Enemy("skeleton", "axe"));
  this.currentEnemy = this.enemies[0];
};

Game.prototype.promptForName = async function () {
  const { name } = await inquirer.prompt({
    type: "text",
    name: "name",
    message: "What is your name?",
  });

  this.player = new Player(name);
};

export default initializeGame;
