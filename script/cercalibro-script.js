const Vue = require('vue');
const fs = require('fs');
let path = require('path');
const ut = require('./script/function.js');

let generi = ut.genereList();

Vue.createApp({
    data() {
        return {
            biblioteca: [],
            libri: [],
            autori: [],
            editori: [],
            modifica: [],
            generi: [],
            popUpModify: false,
            popUpRemove: false
        }
    },
    created() {
        //Prendo i dati dal file JSON
        this.biblioteca = JSON.parse(fs.readFileSync(path.resolve('data', 'libri.json')))
        this.autori = ut.arrayFirs("Seleziona autore", ut.authorList())
        this.editori = ut.arrayFirs("Seleziona casa editrice", ut.editorList());

        this.libri = this.biblioteca;

    },
    methods: {
        search() {
            //Creazione Variebili
            let title = document.getElementById("title").value;
            let autor = document.getElementById("autor-list").value;
            let editor = document.getElementById('editor-list').value;

            let all = this.biblioteca;
            let filtered = []

            //Viene visto se è stata fatta una ricesca su questo campo
            if (editor !== 'Seleziona casa editrice') {
                for (let i in all) {
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
                for (let i in all) {
                    if (all[i].autore === autor) {
                        filtered.push(all[i])
                    }
                }
                all = filtered;
                filtered = [];
            }

            if (title !== '') {
                for (let i in all) {
                    if (all[i].name === title) {
                        filtered.push(all[i])
                    }
                }
                all = filtered;
                filtered = [];
            }
            this.libri = all;
        },
        //Visualizza la finestra di modifica con i dati del libro selezionato già inseriti
        modifyPopUp(libro) {
            //Visualizza la finestra di popUp
            if (!this.popUpRemove) this.popUpModify = true;
            //Viene passato il libro selezionato
            this.modifica = {...libro};

            //Viene prelevata la lista di tutti i generi
            let generi = ut.genereList();
            let check = [];

            //Prende il codice del genere del libro selezionato
            let genereCode = this.biblioteca[ut.indexOf(this.modifica.id, this.biblioteca)].genere;

            //Visualizza checked i check box dei generi del libro
            for (let i = 0; i < generi.length; i++) {
                check.push({"name": generi[i], "check": false})
            }
            for (let i = 0; i < genereCode.length; i++) {
                check[genereCode[i]].check = true
            }

            //Restituische i generi cheked
            this.generi = check;
        },
        //Restituische il genere di un libro partendo dal suo genereCode
        genereSplit(genereCode) {
            let genere

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
        },
        //Chiude tutti i popup aperti
        popUpClose() {

            this.popUpModify = false;
            this.popUpRemove = false;
        },
        //Apre il popup per eliminare i libri
        deletePopUp(libro) {
            if (!this.popUpModify) this.popUpRemove = true;
            this.modifica = libro;
        },
        //Rimuove il libro selezionato dal JSON
        remove: function () {
            //Chiude la finestra di popup
            this.popUpClose();

            //Al prossimo tick rimuove il libro dal json
            // noinspection JSIgnoredPromiseFromCall
            this.$nextTick(() => {
                let index = ut.indexOf(this.modifica.id, this.biblioteca)

                //Rimuove effetivamente il libro
                this.biblioteca.splice(index, 1);
                let data = JSON.stringify(this.biblioteca, null, 2);

                //Salva il file con il libro rimosso
                fs.writeFileSync(path.resolve(__dirname, 'data', 'libri.json'), data)
            })
        },
        //Funzione che modifica un libro selezionato
        modify(){
            //Prendo l'indeice del libro che sto modificando
            let index = ut.indexOf(this.modifica.id, this.biblioteca)

            this.modifica.genere = [];

            //Prende i generi li mette nel libro selezionato
            for (let i = 0; i < this.generi.length; i++){
                if(this.generi[i].check){
                    this.modifica.genere.push(i);
                }
            }

            //Sostituisco il libro
            this.biblioteca[index] = this.modifica;


            //Salvo il libro nel JSON
            let data = JSON.stringify(this.biblioteca, null, 2);
            fs.writeFileSync(path.resolve(__dirname, 'data', 'libri.json'), data)
            this.popUpClose();
        }
    }
}).mount('#app');

document.getElementById('back').addEventListener("click", function () {
    window.location.replace('index.html')
})

document.getElementById('reset').addEventListener("click", function () {
    window.location.reload();
})