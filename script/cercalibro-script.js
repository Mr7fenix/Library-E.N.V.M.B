const Vue = require('vue');
const fs = require('fs');
let path = require('path');
const ut = require('./script/function.js');

let biblioteca = JSON.parse(fs.readFileSync(path.resolve('data', 'libri.json')))
let generi = ut.genereList();

Vue.createApp({
    data() {
        return {
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
        this.autori = ut.arrayFirs("Seleziona autore", ut.authorList())
        this.editori = ut.arrayFirs("Seleziona casa editrice", ut.editorList());

        this.libri = biblioteca;

    },
    methods: {
        search() {
            //Creazione Variebili
            let title = document.getElementById("title").value;
            let autor = document.getElementById("autor-list").value;
            let editor = document.getElementById('editor-list').value;

            let all = biblioteca;
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
        modifyPopUp(libro) {
            //Visualizza la finestra di popUp
            if (!this.popUpRemove) this.popUpModify = true;
            //Viene passato il libro selezionato
            this.modifica = {...libro};

            //Viene prelevata la lista di tutti i generi
            let generi = ut.genereList();
            let check = [];

            //Prende il codice del genere del libro selezionato
            let genereCode = biblioteca[ut.indexOf(this.modifica.id, biblioteca)].genere;

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
        popUpClose() {
            this.popUpModify = false;
            this.popUpRemove = false;
        },
        deletePopUp(libro) {
            if (!this.popUpModify) this.popUpRemove = true;
            this.modifica = libro;
        },
        remove() {
            console.log(biblioteca);
            this.popUpClose();
            this.$nextTick(() => {
                for (let i = 0; i < biblioteca.length; i++) {
                    if (biblioteca[i].id === this.modifica.id) {
                        biblioteca.splice(i, 1);
                        break;
                    }
                }
                let data = JSON.stringify(biblioteca, null, 2);
                fs.writeFileSync(path.resolve(__dirname, 'data', 'libri.json'), data)
            })
        },
        modify(){

            let index = ut.indexOf(this.modifica.id, biblioteca)

            this.modifica.genere = [];

            for (let i = 0; i < this.generi.length; i++){
                if(this.generi[i].check){
                    this.modifica.genere.push(i);
                }
            }


            biblioteca[index] = this.modifica;

            let data = JSON.stringify(biblioteca, null, 2);
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