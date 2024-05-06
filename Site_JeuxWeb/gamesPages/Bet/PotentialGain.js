import { setInput } from "./utils.js";
import { VerifyBet } from "./VerifyBet.js";
export class PotentialGain {
  constructor() {
    this.bets= {};
    this.potentialGain = 0;
    this.typeBet = 'combined-bet';
    this.confirmBetButton();
    this.displayPotentailGain = document.querySelector('.potential-gain');
    this.verifyBet = new VerifyBet(this.typeBet);
    this.level = 0;
  }
 

  confirmBetButton(){
    const confirmBetButton = document.querySelector('button');
    confirmBetButton.addEventListener('click', () => {
      this.verifyBet.fetchBet(this.bets);
    })
  }
}