const fs = require('fs');
let rawbiblioteca = fs.readFileSync('data/libri.json');
let biblioteca = JSON.parse(rawbiblioteca);
let libri = biblioteca['biblioteca'];

for (i in libri) {
    let x = libri[i].name

    let option = document.createElement('option');
    option.text = x;
    option.id = 'opt' + i;
    document.getElementById('title-list').appendChild(option);
}

document.getElementById('autor-list').add(new Option('Seleziona autore'));
let arrayAutor = []
for (i in libri) {
    let flag = false;
    for (let j = 0; j < i; j++) {
        if (arrayAutor[j] === undefined) {
            arrayAutor.push(libri[i].autore);
        } else if (arrayAutor[j] === libri[i].autore) {
            flag = true;
        } else arrayAutor.push(libri[i].autore);
    }
    if (!flag) {
        document.getElementById('autor-list').add(new Option(libri[i].autore));
    }
}
document.getElementById('editor-list').add(new Option('Seleziona casa editrice'));
let array = fs.readFileSync('data/editori.txt').toString().split('~');
array.sort();

for (i in array) {
    document.getElementById('editor-list').add(new Option(array[i]));
}
for (i in libri) {
    let tabel = document.getElementById('table');
    let tr = document.createElement('tr');
    let thTitle = document.createElement('th')
    let thAutor = document.createElement('th')
    let thEditor = document.createElement('th')
    let thGenere = document.createElement('th')

    tr.id = 'bookid' + i;
    thTitle.innerText = libri[i].name;
    thTitle.id = 'bookid' + i + "title"

    thAutor.innerText = libri[i].autore;
    thAutor.id = 'bookid' + i + "autor"

    thEditor.innerText = libri[i].editore;
    thEditor.id = 'bookid' + i + "editor"

    let generi = fs.readFileSync('data/genere.txt').toString().split('~')
    let genereCode = libri[i].genere.split('~');
    let genere;
    for (let k = 0; k < genereCode.length; k++) {
        for (let j = 0; j < generi.length; j++) {
            if (j.toString() === genereCode[k]) {
                let x = generi[j][0].toUpperCase() + generi[j].slice(1).toLowerCase()
                if (genere === undefined) {
                    genere = x;
                } else genere = genere + ', ' + x;
            }
        }
    }

    thGenere.innerText = genere;
    thGenere.id = tr.id + "genere"
    tr.appendChild(thTitle);
    tr.appendChild(thAutor);
    tr.appendChild(thEditor);
    tr.appendChild(thGenere);

    tabel.appendChild(tr)
}

document.getElementById('rest').addEventListener("click", function () {
    window.location.reload();
})
document.getElementById('find').addEventListener("click", function () {
    let title = document.getElementById('title').value;
    let autor = document.getElementById('autor-list').value;
    let editor = document.getElementById('editor-list').value;

    let newJson = {"find": []}
    let flag = false;

    if (autor !== 'Seleziona autore') {
        flag = true;
        for (i in libri) {
            if (libri[i].autore === autor) {
                newJson["find"].push(libri[i])
            }
        }
    }
    if (editor !== 'Seleziona casa editrice') {
        flag = true;
        for (i in libri) {
            if (libri[i].editore === editor) {
                newJson["find"].push(libri[i])
            }
        }
    }
    if (title !== '') {
        flag = true;
        for (i in libri) {
            if (libri[i].name === title) {
                newJson["find"].push(libri[i])
            }
        }
    }


    if (flag) {
        for (i in libri) {
            let thTitle = document.getElementById('bookid' + i + 'title');
            let thAutor = document.getElementById('bookid' + i + 'autor');
            let thEditor = document.getElementById('bookid' + i + 'editor');
            let thGenere = document.getElementById('bookid' + i + 'genere');

            thTitle.innerText = '';
            thAutor.innerText = '';
            thEditor.innerText = '';
            thGenere.innerText = '';
        }

        for (i in newJson['find'] + 1) {
            let thTitle = document.getElementById('bookid' + i + 'title');
            let thAutor = document.getElementById('bookid' + i + 'autor');
            let thEditor = document.getElementById('bookid' + i + 'editor');
            let thGenere = document.getElementById('bookid' + i + 'genere');
            let genere;

            let generi = fs.readFileSync('data/genere.txt').toString().split('~');
            let genereCode = newJson["find"][i].genere.split('~');
            for (let k = 0; k < genereCode.length; k++) {
                for (let j = 0; j < generi.length; j++) {
                    if (j.toString() === genereCode[k]) {
                        let x = generi[j][0].toUpperCase() + generi[j].slice(1).toLowerCase()
                        if (genere === undefined) {
                            genere = x;
                        } else genere = genere + ', ' + x;
                    }
                }
            }


            thTitle.innerText = newJson["find"][i].name;
            thAutor.innerText = newJson["find"][i].autore;
            thEditor.innerText = newJson["find"][i].editore;
            thGenere.innerText = genere;


        }
    }
})

document.getElementById('back').addEventListener("click", function (){
    window.close()
})