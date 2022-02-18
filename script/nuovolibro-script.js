window.onload = function () {
    const fs = require('fs');
    let path = require('path')
    let rawbiblioteca = fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json'));
    let biblioteca = JSON.parse(rawbiblioteca);
    let libri = biblioteca['biblioteca'];

    let arrayAutor = []
    for (i in libri) {
        let x = libri[i].autore
        let flag = false;
        for (let j = 0; j < i; j++) {
            if (arrayAutor[j] === undefined) {
                arrayAutor.push(libri[i].autore);
            } else if (arrayAutor[j] === libri[i].autore) {
                flag = true;
            } else arrayAutor.push(libri[i].autore);
        }
        if (!flag) {
            let option = document.createElement('option');
            option.text = x;
            document.getElementById('lis-aut').appendChild(option);
        }

    }
    let array = fs.readFileSync(path.resolve(__dirname, 'data', 'editori.txt')).toString().split('~');
    array.sort()


    document.getElementById('select').add(new Option('Seleziona casa editrice'));
    for (i in array) {
        document.getElementById('select').add(new Option(array[i]));
    }

    let generi = fs.readFileSync(path.resolve(__dirname, 'data', 'genere.txt')).toString().split('~');
    for (idCheck in generi) {

        let div = document.getElementById('divGenere');
        let checkbox = document.createElement('input');
        let label = document.createElement('label');
        let newDiv = document.createElement('div');

        checkbox.type = 'checkbox';
        checkbox.id = 'gen' + idCheck;

        label.htmlFor = 'gen' + idCheck;
        label.appendChild(document.createTextNode('  ' + generi[idCheck][0].toUpperCase() + generi[idCheck].slice(1).toLowerCase()))
        label.classList = 'text';
        label.id = 'lab' + idCheck;

        newDiv.classList = 'check-div'

        newDiv.appendChild(checkbox);
        newDiv.appendChild(label);
        div.appendChild(newDiv)
    }


    document.getElementById('add').addEventListener('click', function () {

        if (document.getElementById('newTitle').value === '') {
            document.getElementById('notifica').innerText = 'TITOLO NON INSERITO';
            document.getElementById('body').style.backgroundColor = '#ff5252';
            return;
        }
        if (document.getElementById('autor').value === "") {
            document.getElementById('notifica').innerText = 'AUTORE NON INSERITO';
            document.getElementById('body').style.backgroundColor = '#ff5252';
            return;
        }
        if (document.getElementById('select').value === 'Seleziona casa editrice'){
            document.getElementById('notifica').innerText = 'SELEZIONA CASA EDITRICE';
            document.getElementById('body').style.backgroundColor = '#ff5252';
            return;
        }


        //Correzione del titolo
        let title = document.getElementById('newTitle').value[0].toUpperCase() + document.getElementById('newTitle').value.slice(1).toLowerCase()
        if (title.substring(title.length - 1) === ' ') {
            title = title.substring(0, title.length - 1);
        }

        let autor = document.getElementById('autor').value;
        if (autor.substring(autor.length - 1) === ' ') {
            autor = autor.substring(0, autor.length - 1);
        }

        let genereFlag = false
        for (i in generi) {
            if (document.getElementById('gen' + i).checked) {
                genereFlag = true
            }
        }
        if (!genereFlag) {
            document.getElementById('notifica').innerText = 'SELEZIONA UN GENERE';
            document.getElementById('body').style.backgroundColor = '#ff5252';
            return;
        }


        let rawData = fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json'));
        let oldData = JSON.parse(rawData);
        console.log(oldData)

        let bibl = oldData['biblioteca'];
        for (let i = 0; i < bibl.length; i++) {

            if (title.toLowerCase() === bibl[i].name.toLowerCase()) {
                document.getElementById('notifica').innerText = 'Libro gia inserito';
                document.getElementById('body').style.backgroundColor = '#ff5252';
                return;
            }
        }

        //Aggiunta libro
        let globalGen;
        for (i in generi) {
            let id = "gen" + i;
            let idLabel = "lab" + i;
            let genere = document.getElementById(id)

            if (genere.checked) {
                if (globalGen === undefined) {
                    globalGen = i;
                } else globalGen = globalGen + '~' + i;
            }
        }

        let libro = {
            "name": title,
            "autore": autor,
            "editore": document.getElementById('select').value,
            "genere": globalGen
        }
        oldData["biblioteca"].push(libro);

        let data = JSON.stringify(oldData);
        fs.writeFileSync(path.resolve(__dirname, 'data', 'libri.json'), data)

        document.getElementById('notifica').innerText = 'Libro aggiunto correttamente';
        document.getElementById('body').style.backgroundColor = '#5eff52';

    })
}
document.getElementById('back').addEventListener("click", function (){
    window.location.replace('index.html')
})