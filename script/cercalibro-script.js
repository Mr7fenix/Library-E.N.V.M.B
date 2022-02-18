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
            //Acquisizione dei dati
            let rawbiblioteca = fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json'));
            let biblioteca = JSON.parse(rawbiblioteca);
            let libri = biblioteca['biblioteca']

            //Inserimento dei genere per ogni libro
            for (let i in libri) {
                libri[i].genere = genereSplit(libri[i].genere.split('~'));
            }

            //Creazione Variebili
            let title = document.getElementById("title").value;
            let autor = document.getElementById("autor-list").value;
            let editor = document.getElementById('editor-list').value;

            let all = libri;
            let filtered = []
            //TODO: Non si possono effettuare ricerche multiple, risolvere il problema
            //Viene visto se è stata fatta una ricesca su questo campo
            if (editor !== 'Seleziona casa editrice') {
                for (let i in libri) {
                    //Controllo che serve trovare i libri richiesti
                    if (all[i].editore === editor) {
                        filtered.push(all[i])
                    }
                }
                //Reset della variabile filtered e rispettiva modifica della variabile all
                all = filtered;
                filtered = [];
            }

            if (autor !== 'Seleziona autore'){
                for (let i in libri) {
                    if (all[i].autore === autor) {
                        filtered.push(all[i])
                    }
                }
                all = filtered;
                filtered = [];
            }

            if (title !== ''){
                for (let i in libri) {
                    if (all[i].name === title) {
                        filtered.push(all[i])
                    }
                }
                all = filtered;
                filtered = [];
            }

            this.libri = all;
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


document.getElementById('back').addEventListener("click", function (){
    window.location.replace('index.html')
})

document.getElementById('reset').addEventListener("click", function () {
    window.location.reload();
})