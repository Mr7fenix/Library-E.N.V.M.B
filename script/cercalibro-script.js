const Vue = require('vue');

const fs = require('fs');
let path = require('path');

Vue.createApp({
    data() {
        return {
            libri: [],
            autori: [],
            editori: []
        }
    },
    created() {
        //Prende dal file i dati relativi alla lista dei libri inseriti
        let rawbiblioteca = fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json'));
        let biblioteca = JSON.parse(rawbiblioteca);
        let libri = biblioteca['biblioteca']

        //Per ogni libro ne restituisce il rispettivo genere
        for (let i in libri) {
            libri[i].genere = genereSplit(libri[i].genere.split('~'));
        }


        this.autori =  arrayFirs("Seleziona autore", autorList(libri))
        this.editori = arrayFirs("Seleziona casa editrice", editorList());
        this.libri = libri;

    },
    methods: {
        search(){
            let rawbiblioteca = fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json'));
            let biblioteca = JSON.parse(rawbiblioteca);
            let libri = biblioteca['biblioteca']

            let title = document.getElementById("title").valueOf();
            let autor = document.getElementById("autor-list").valueOf();
            let editor = document.getElementById("editor-list".valueOf());

            for (let i in libri){

            }

        }
    }
}).mount('#prova');

//Restituische il genere di un libro partendo dal suo genereCode
function genereSplit(genereCode){
    let generi = fs.readFileSync(path.resolve(__dirname, 'data', 'genere.txt')).toString().split('~');
    let genere;

    for (let k = 0; k < genereCode.length; k++) {
        for (let j = 0; j < generi.length; j++) {
            if (j.toString() === genereCode[k]) {
                let x = generi[j][0].toUpperCase() + generi[j].slice(1).toLowerCase()
                if (genere === undefined) {
                    genere = x;
                } else genere += ', ' + x;
            }
        }
    }
    return genere;
}

//restituisce la lista di tutti gli autori
function autorList(libri){
    //array contenente tutti gli autori
    let autorList = []

    for (let i in libri){
        //controlle se l'autore è gia presente all'iterno dei dati in caso negativo lo aggiunge
        if (!autorList.includes(libri[i].autore)){
            autorList.push(libri[i].autore)
        }
    }
    return autorList;
}

//funzione che restituisce tutti gli editori
function editorList(){
    //prelevo dal file gli editori che sono salvati
    let editorlist = fs.readFileSync(path.resolve(__dirname, 'data', 'editori.txt')).toString().split('~');
    editorlist.sort();

    return editorlist
}

//mette al pirmo posto dell'array passato la variabile passata
function arrayFirs (first, array){

    //crea un nuovo array vuoto e un array con l'array passato
    let withFirst = []
    let withoutFirs = array;

    //inserisce al primo posto dell' array la variabile passata
    withFirst.push(first)

    //inserisce all'interno dell nuovo array l'array passato
    for (let i in withoutFirs) withFirst.push(withoutFirs[i]);

    return withFirst;
}



/* document.getElementById('find').addEventListener("click", function () {
    let title = document.getElementById('title').value;
    let autor = document.getElementById('autor-list').value;
    let editor = document.getElementById('editor-list').value;

    let newJson = {"find": []}
    let flag = false;

    if (autor !== 'Seleziona autore') {
        flag = true;
        for (let i in libri) {
            if (libri[i].autore === autor) {
                newJson["find"].push(libri[i])
            }
        }
    }
    if (editor !== 'Seleziona casa editrice') {
        flag = true;
        for (let i in libri) {
            if (libri[i].editore === editor) {
                newJson["find"].push(libri[i])
            }
        }
    }
    if (title !== '') {
        flag = true;
        for (let i in libri) {
            if (libri[i].name === title) {
                newJson["find"].push(libri[i])
            }
        }
    }


    if (flag) {
        for (let i in libri) {
            let thTitle = document.getElementById('bookid' + i + 'title');
            let thAutor = document.getElementById('bookid' + i + 'autor');
            let thEditor = document.getElementById('bookid' + i + 'editor');
            let thGenere = document.getElementById('bookid' + i + 'genere');

            thTitle.innerText = '';
            thAutor.innerText = '';
            thEditor.innerText = '';
            thGenere.innerText = '';
        }

        for (let i in newJson['find'] + 1) {
            let thTitle = document.getElementById('bookid' + i + 'title');
            let thAutor = document.getElementById('bookid' + i + 'autor');
            let thEditor = document.getElementById('bookid' + i + 'editor');
            let thGenere = document.getElementById('bookid' + i + 'genere');


            thTitle.innerText = newJson["find"][i].name;
            thAutor.innerText = newJson["find"][i].autore;
            thEditor.innerText = newJson["find"][i].editore;
            thGenere.innerText = genereSplit(newJson["find"][i].genere.split('~'));
        }
    }
})*/

document.getElementById('back').addEventListener("click", function (){
    window.location.replace('index.html')
})

document.getElementById('reset').addEventListener("click", function () {
    window.location.reload();
})