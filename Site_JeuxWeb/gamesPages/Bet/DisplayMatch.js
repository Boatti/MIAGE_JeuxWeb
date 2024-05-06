import { DisplayBet } from './DisplayBet.js';

export class DisplayMatch {
    constructor( dates, matchs,) {
    this.matchs = matchs;
    this.dates = dates;
    this.currentIndex = 0;
    this.updateDateDisplay();
    this.dateNavigationEventListeners();
    this.displayBetInstance = new DisplayBet();
    console.log(this.matchs);

    }

    dateNavigationEventListeners() {
        document.querySelector('.gg-chevron-left').addEventListener('click', () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateDateDisplay();
                this.displayBetInstance.deleteAllBets();
            }
        });

        document.querySelector('.gg-chevron-right').addEventListener('click', () => {
            if (this.currentIndex < this.dates.length - 1) {
                this.currentIndex++;
                this.updateDateDisplay();
                this.displayBetInstance.deleteAllBets();

            }
        });
    }
    
    updateDateDisplay() {
  

    const dateDisplay = document.getElementById('date');
    const selectedDate = this.dates[this.currentIndex];
    dateDisplay.textContent = selectedDate;
    const matchByDate = this.matchs.filter((match) => match.Date === selectedDate)
    // this.displayBetInstance.deleteAllBets();
    this.updateMatchDisplay(matchByDate);
    }

    

    updateMatchDisplay(matchByDate) {
        const listBet = document.querySelector('#tableMatch tbody');
        listBet.innerHTML = '';

        function createCell(content) {
            const cell = document.createElement('td');
            cell.textContent = content;
            return cell;
        }

        function createBetCell(bet, match) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            const label = document.createElement('label');
        
            input.setAttribute('type', 'checkbox');
            input.setAttribute('class', 'input-cote 1N2');
            input.setAttribute('id', `${bet}_${match.Id}`);
            label.setAttribute('for', `${bet}_${match.Id}`);
            label.textContent = match[bet];
            cell.appendChild(input);
            cell.appendChild(label);
            return cell;
        }


        const matchDisplay = document.querySelector('#tableMatch tbody');

        for (const match of matchByDate) {
            const row = document.createElement('tr');
            row.setAttribute('id', match.Id)
            row.append(createCell(match.TeamHome), createCell(match.TeamAway));

            for (const bet of ['Betclic_CH', 'Betclic_CD', 'Betclic_CA']) {
                row.appendChild(createBetCell(bet, match));
            }

            matchDisplay.appendChild(row);
        }
        this.setCheckBox(matchDisplay);

    }

    setCheckBox(matchDisplay) {
        const logAndAddBet = (checkbox, parentTr) => { // Utilisez une fonction fléchée ici
            const tdParent = checkbox.closest('td');
            const columnIndex = getColumnIndex(tdParent.cellIndex); // Assurez-vous que getColumnIndex est une méthode de la classe
            const matchInfo = {
                id: parentTr.id,
                teamHome: parentTr.children[0].textContent,
                teamAway: parentTr.children[1].textContent,
                teamSelected: columnIndex === 'Draw' ? 'Draw' : columnIndex === 0 ? 'Home' : 'Away',
                oddSelected: checkbox.nextElementSibling.textContent,
                amountBet: 0,
            };
            console.log(matchInfo);
            this.displayBetInstance.addBet(matchInfo);
        };

        const logAndDeleteBet = (id) =>{
            this.displayBetInstance.deleteBet(id);
        }

        const getColumnIndex= (cellIndex) => {
            return cellIndex === 2 ? 0 : cellIndex === 3 ? 'Draw' : 1;
        }
        
        
        matchDisplay.querySelectorAll('.input-cote').forEach(checkbox => {
            // Ajoutez un écouteur d'événements sur chaque checkbox
            
            checkbox.addEventListener('input', () => {
                const isChecked = checkbox.checked;
                const parentTr = checkbox.closest('tr');
                // Désélectionnez les autres checkboxes dans la même ligne
                if (isChecked) {
                    parentTr.querySelectorAll('input').forEach(siblingCheckbox => {
                        if (siblingCheckbox !== checkbox) {
                            siblingCheckbox.checked = false;
                            logAndDeleteBet(parentTr.id);
                        }
                    });
                    // Préparez et logguez les informations du match sélectionné
                    logAndAddBet(checkbox, parentTr);
                } else {
                    logAndDeleteBet(parentTr.id);
                }
            });
        });
    }
}
    

