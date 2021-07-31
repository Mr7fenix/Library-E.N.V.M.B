document.getElementById('add').addEventListener('click', function () {
    window.open('nuovolibro.html', '_blank', 'menu=true')
    window.hide();
})

document.getElementById('search').addEventListener('click', function () {
    window.open('cercalibro.html')
})


window.onload = function (){
    let fs = require('fs');
    let biblioteca = fs.readFileSync('libri.json');
    biblioteca = JSON.parse(biblioteca);
    let libri = biblioteca['biblioteca'].length;

    document.getElementById('tot').innerText = 'Libri Posseduti' + ' ' + libri;
    console.log(libri)
}