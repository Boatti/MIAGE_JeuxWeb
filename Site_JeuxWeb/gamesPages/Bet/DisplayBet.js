import { PotentialGain } from './PotentialGain.js';
export class DisplayBet {
  constructor() {
    this.typeBet = this.defaultTypeBet();
    this.potentialGainInstance = new PotentialGain();
  }
  
  defaultTypeBet(){
    const betTypes = document.querySelectorAll('.type-bet div'); // Sélectionne tous les éléments de pari

    betTypes.forEach(betType => {
        betType.addEventListener('click', () => {
            // Définit la couleur de tous les éléments en transparent au début
            if (this.typeBet !== betType.classList[0]){
              betTypes.forEach(type => {
                  type.style.backgroundColor = 'transparent'; // Assurez-vous que le fond est réinitialisé
              });
              this.typeBet = betType.classList[0];
              betType.style.backgroundColor = 'red'
              this.changeTypeBet(this.typeBet);
            }
        });
    });

    const combinedBet = document.querySelector('.type-bet .combined-bet');
    combinedBet.style.backgroundColor = 'red';
    return 'combined-bet';
  }

  addBet(matchInfo){
    this.potentialGainInstance.bets[matchInfo.id] = matchInfo;
    this.displayAddBet(matchInfo);
  }

  deleteBet(matchId){
    delete this.potentialGainInstance.bets[matchId] ;
    this.displayDeleteBet(matchId);
  }

  deleteAllBets(){
    this.potentialGainInstance.bets = {};
    const listSelectedBet = document.querySelector('.list-selected-bet');
    listSelectedBet.innerHTML = '';
  } 

  displayAddBet(matchInfo){
    const listSelectedBet = document.querySelector('.list-selected-bet');
    const betToDisplay = document.createElement('div');
    betToDisplay.setAttribute('id', `${matchInfo.id}_bet`);
    betToDisplay.innerHTML = `
        <div class="match-team">${matchInfo.teamHome} - ${matchInfo.teamAway}</div>
        <div class="resultat">${matchInfo.teamSelected}</div>
        <div class="selected-cote-bet">${matchInfo.oddSelected}</div>
        `;
    if (this.typeBet === 'simple-bet'){
      //Appliquer le input Simple de Potential Gains
      listSelectedBet.appendChild(betToDisplay);
    }
    else if(this.typeBet === 'combined-bet'){
      listSelectedBet.appendChild(betToDisplay);
    }
  }

  displayDeleteBet(matchId){
    const betToDelete = document.querySelector(`.list-selected-bet > #${matchId}_bet`);
    if (betToDelete){
      betToDelete.remove();
    }
  }

  changeTypeBet(){
    const listSelectedBet = document.querySelector('.list-selected-bet');
    listSelectedBet.innerHTML = '';

    
    if (this.typeBet === 'simple-bet'){
      delete this.potentialGainInstance.bets.amountBet;
      for (let bet in this.potentialGainInstance.bets){
        this.displayAddBet(this.potentialGainInstance.bets[bet]);
      }
    }
    else if (this.typeBet === 'combined-bet'){
      for (let bet in this.potentialGainInstance.bets){
        delete this.potentialGainInstance.bets[bet].amountBet; 
        this.displayAddBet(this.potentialGainInstance.bets[bet]);

      }
    }
  }

  
}
