export class VerifyBet {
  constructor(typeBet) {
    this.typeBet = typeBet
    this.level = 0
    }

    // Method to verify the user's bets
    fetchBet(bets){
      fetch('AI_NBA.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Échec du chargement du fichier JSON');
          }
          return response.json();
      })
      .then(data => { 
          for (let bet in bets){
            if ( bet !== 'amountBet'){
              let result = data.filter((item) => item.Id === bet)[0]
              let forlevel = this.verifyBetCombined(result.Victoire, bet,  bets);         
              if (!forlevel){
                this.level = 0;
                document.getElementById('level').innerHTML = `Niveau : ${this.level}`;

              }  
              else {
                this.level += 1;
                document.getElementById('level').innerHTML = `Niveau : ${this.level}`;
              }
            }
          }
        })
      .catch(error => console.error('Erreur :', error));
    }

    verifyBetCombined(result, bet, bets){
      let changeBet = document.getElementById(`${bet}_bet`);
      if(result === bets[bet].teamSelected){
        changeBet.style.backgroundColor = 'green';
        return true;
      }
      else{
        changeBet.style.backgroundColor = 'red';
        return false
      }
    }
}