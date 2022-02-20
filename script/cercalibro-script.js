const Vue = require('vue');
const fs = require('fs');
let path = require('path');
const ut = require('./script/function.js');

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
        let rawbiblioteca = fs.readFileSync(path.resolve('data', 'libri.json'));
        let biblioteca = JSON.parse(rawbiblioteca);
        let libri = biblioteca['biblioteca']

        //Per ogni libro ne restituisce il rispettivo genere
        for (let i in libri) {
            libri[i].genere = genereSplit(libri[i].genere);
        }


        this.autori = ut.arrayFirs("Seleziona autore", ut.authorList())
        this.editori = ut.arrayFirs("Seleziona casa editrice", ut.editorList());
        this.libri = libri;

    },
    methods: {
        search() {
            //Acquisizione dei dati
            let rawbiblioteca = fs.readFileSync(path.resolve('data', 'libri.json'));
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

            if (autor !== 'Seleziona autore') {
                for (let i in libri) {
                    if (all[i].autore === autor) {
                        filtered.push(all[i])
                    }
                }
                all = filtered;
                filtered = [];
            }

            if (title !== '') {
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
function genereSplit(genereCode) {
    let genere
    let generi = ut.genereList();

    for (let i in genereCode) {
        for (let k = 0; k <= generi.length; k++) {
            if (genereCode[i] === k) {

                if (genere === undefined) {
                    genere = generi[k];
                } else genere += ', ' + generi[k];
            }
        }
    }

    return genere;
}

document.getElementById('back').addEventListener("click", function () {
    window.location.replace('index.html')
})

document.getElementById('reset').addEventListener("click", function () {
    window.location.reload();
})