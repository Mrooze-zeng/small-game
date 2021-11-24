#!/usr/bin/env node
import * as Readline from "readline";

const { createInterface } = Readline;

class Game {
  constructor(sticks = [3, 5, 7]) {
    this.sticks = sticks;
    this.ask = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.isComputerFirst = false;
  }
  computerTakeNum() {
    if (this.sticks.length % 2 === 0) {
      return Math.max(...this.sticks);
    } else {
      return Math.max(...this.sticks) - 1 || Math.max(...this.sticks);
    }
  }
  promisifyAsk(msg) {
    return new Promise((resolve) => {
      this.ask.question(msg, resolve);
    });
  }
  async userTakeNum() {
    let num = await this.promisifyAsk("How many stick you take?\n");
    num = Number.isNaN(parseInt(num, 10)) ? 0 : parseInt(num, 10);
    return num;
  }
  getStickIndex(num) {
    for (let i = 0; i < this.sticks.length; i++) {
      if (num > 0 && num <= this.sticks[i]) {
        return i;
      }
    }
    return 0;
  }
  async takeStick() {
    while (true) {
      console.log(this.sticks);
      let num = this.isComputerFirst
        ? this.computerTakeNum()
        : await this.userTakeNum();
      let stickIndex = this.getStickIndex(num);
      if (num < 1 || num > this.sticks[stickIndex]) {
        console.log("Wrong stick count you have taken.\n");
        continue;
      }
      console.log(`${this.isComputerFirst ? "Computer" : "You"} take ${num}.`);
      this.sticks[stickIndex] -= num;
      this.sticks = this.sticks.filter((stick) => stick > 0);
      if (this.sticks.length > 0) {
        if (this.sticks.length === 1 && this.sticks[0] === 1) {
          break;
        }
        this.isComputerFirst = !this.isComputerFirst;
      } else {
        break;
      }
    }
    console.log(`${this.isComputerFirst ? "Computer" : "You"} win.`);
    this.ask.close();
  }
  run() {
    console.log(`---------------Game------------------`);
    this.ask.question("Do you want to come first? (y/n)\n", (answer = "n") => {
      switch (answer.toLowerCase()) {
        case "n":
          console.log(`Computer first.`);
          this.isComputerFirst = true;
          break;
        case "y":
          console.log(`Your first.`);
          this.isComputerFirst = false;
          break;
        default:
          console.log(
            `Wrong answer, ${answer} is not our options, you would be the first.`,
          );
          this.isComputerFirst = false;
          break;
      }
      this.takeStick();
    });
  }
}

const game = new Game();
game.run();
