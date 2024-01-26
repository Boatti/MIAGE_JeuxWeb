function openMenu() {
    var hiddenDiv = document.getElementById('hiddenMenu');

    if (hiddenDiv.style.height === '0px' || hiddenDiv.style.height === '') {
        hiddenDiv.style.height = hiddenDiv.scrollHeight + 'px';
    } else {
        hiddenDiv.style.height = '0px';
    }
}