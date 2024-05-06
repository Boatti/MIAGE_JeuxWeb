export function setInput(){
    let input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('class','amount-bet')
    input.addEventListener('keypress', function(e) {
        let charCode = e.charCode || e.keyCode; // Obtenez le code du caractère
    
        // Si ce n'est pas un chiffre
        if (charCode < 48 || charCode > 57) {
          e.preventDefault(); // Empêchez la saisie
        }
      });

    return input
}