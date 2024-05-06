import { DisplayMatch } from "./DisplayMatch.js";
fetch('AI_NBA.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec du chargement du fichier JSON');
        }
        return response.json();
    })
    .then(data => {
        const allDates = data.map(match => match.Date);
        const uniqueDates = new Set(allDates);
        new DisplayMatch(Array.from(uniqueDates), data);
    })
    .catch(error => console.error('Erreur :', error));