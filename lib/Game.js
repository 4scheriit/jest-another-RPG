import inquirer from "inquirer";
import Enemy from "./Enemy.js";
import Player from "./Player.js";

async function initializeGame() {
  const game = new Game();
  await game.promptForName();
  game.initializeGame();
  await game.startNewBattle();
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

Game.prototype.startNewBattle = async function () {
  if (this.player.agility > this.currentEnemy.agility) {
    this.isPlayerTurn = true;
  } else {
    this.isPlayerTurn = false;
  }

  console.log("Your stats are as follows:");
  console.table(this.player.getStats());
  console.log(this.currentEnemy.getDescription());
  await this.battle();
};

Game.prototype.battle = async function () {
  if (this.isPlayerTurn) {
    const { action } = await inquirer.prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: ["Attack", "Use potion"],
    });

    if (action === "Use potion") {
      if (!this.player.getInventory()) {
        console.log("You don't have any potions!");
        return;
      }

      inquirer
        .prompt({
          type: "list",
          message: "Which potion would you like to use?",
          name: "action",
          choices: this.player
            .getInventory()
            .map((item, index) => `${index + 1}: ${item.name}`),
        })
        .then(({ action }) => {
          const potionDetails = action.split(": ");

          this.player.usePotion(potionDetails[0] - 1);
          console.log(`You used a ${potionDetails[1]} potion.`);

          this.continueBattle();
        });
    } else {
      const damage = this.player.getAttackValue();
      this.currentEnemy.reduceHealth(damage);

      console.log(`You attacked the ${this.currentEnemy.name}`);
      console.log(this.currentEnemy.getHealth());

      this.continueBattle();
    }
  } else {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());

    this.continueBattle();
  }
};

Game.prototype.continueBattle = function () {
  // Check if the battle should continue or end
  if (this.player.isAlive() && this.currentEnemy.isAlive()) {
    // Switch the turn to the other entity
    this.isPlayerTurn = !this.isPlayerTurn;

    // Start the next round of the battle
    this.battle();
  } else {
    // Handle the end of the battle
  }
};

export default initializeGame;
