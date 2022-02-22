const Vue = require('vue');
const fs = require('fs');
let path = require('path');
const ut = require('./script/function.js');
const sql = require('./script/database.js')

let generi = ut.genereList();

Vue.createApp({
    data() {
        return {
            biblioteca: [],
            libri: [{titolo: "Caricamento...", autore: "Caricamento...", editore: "Caricamento...", genere: "Caricamento..."}],
            autori: [{name: "Caricamento..."}],
            editori: [{name: "Caricamento..."}],
            modifica: [],
            generi: [{name: "Caricamento..."}],
            popUpModify: false,
            popUpRemove: false
        }
    },
    created() {

        /* let autori = await sql.query("SELECT id, name FROM autori");
        // let libro = await sql.query("SELECT * FROM libri WHERE autore = ?", [autori[0].id])
        // console.log(libro);

        // sql.query("SELECT id, name FROM autori").then(autori => {
        //     return sql.query("SELECT * FROM libri WHERE autore = ?", [autori[0].id]);
        // }).then(libri => {
        //     console.log(libri);
        // });

        // sql.query("SELECT id, name FROM autori").then(autori => {
        //     sql.query("SELECT * FROM libri WHERE autore = ?", [autori[0].id]).then(libri => {
        //         console.log(libri);
        //     });
        // });

        //.catch(err => {
        //    console.error(err);
        //});

        //Prendo i dati dal file JSON
        */


        sql.query(`SELECT id, name FROM autori`).then(result => this.autori = result);
        sql.query(`SELECT libri.id, titolo, aut.name AS autore, edi.name As editore,
                            GROUP_CONCAT(gen.id) AS genereId,
                            GROUP_CONCAT(gen.name SEPARATOR ', ') AS genere
                   FROM libri
                            LEFT JOIN autori aut ON libri.autore = aut.id
                            LEFT JOIN editori edi ON libri.editore = edi.id
                            LEFT JOIN libri_generi lg on libri.id = lg.libro
                            LEFT JOIN generi gen on gen.id = lg.genere
                   GROUP BY libri.id ORDER BY libri.id;
        `).then(result => {
            this.biblioteca = result;
            this.libri = this.biblioteca;
        });
        sql.query("SELECT id, name FROM editori").then(result => this.editori = result)

    },
    methods: {
        async search() {
            //Creazione Variebili
            let title = document.getElementById("title").value;
            let author = document.getElementById("autor-list").value;
            let editor = document.getElementById('editor-list').value;

            //Viene visto se è stata fatta una ricesca su questo campo
            let conditions = [];
            let conditionsValue = [];
            if (title.length > 0) {
                conditions.push("titolo LIKE ?");
                conditionsValue.push(`%${title}%`);
            }
            if (author.length > 0) {
                conditions.push("autore = ?");
                conditionsValue.push(author);
            }
            if (editor.length > 0) {
                conditions.push("editore = ?");
                conditionsValue.push(editor);
            }
            this.libri = await sql.query(`SELECT libri.id, titolo, aut.name AS autore, edi.name As editore,
                                        GROUP_CONCAT(gen.id) AS genereId,
                                        GROUP_CONCAT(gen.name SEPARATOR ', ') AS genere
                                 FROM libri
                                          LEFT JOIN autori aut ON libri.autore = aut.id
                                          LEFT JOIN editori edi ON libri.editore = edi.id
                                          LEFT JOIN libri_generi lg on libri.id = lg.libro
                                          LEFT JOIN generi gen on gen.id = lg.genere
                                 ${conditions.length > 0 ? "WHERE" + conditions.join(" AND ") : ""}
                                 GROUP BY libri.id ORDER BY libri.id`, conditionsValue)
        },
        //Visualizza la finestra di modifica con i dati del libro selezionato già inseriti
        modifyPopUp(libro) {
            console.log(libro)
            //Visualizza la finestra di popUp
            if (!this.popUpRemove) this.popUpModify = true;
            //Viene passato il libro selezionato
            this.modifica = {...libro};

            //Viene prelevata la lista di tutti i generi
            let generi = ut.genereList();
            let check = [];

            //Prende il codice del genere del libro selezionato
            let genereCode = this.biblioteca[ut.indexOf(this.modifica.id, this.biblioteca)].genereId.split(",");

            //Visualizza checked i check box dei generi del libro
            for (let i = 0; i < generi.length; i++) {
                check.push({"name": generi[i], "check": false})
            }
            for (let i = 0; i < genereCode.length; i++) {
                check[parseInt(genereCode[i])].check = true
            }

            //Restituische i generi cheked
            this.generi = check;
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
        async remove() {
            await sql.query(`DELETE FROM libri_generi WHERE libro = ?`, this.modifica.id)
            await sql.query(`DELETE FROM libri WHERE id = ?`, this.modifica.id)
            await this.search();
            this.popUpClose();
        },
        //Funzione che modifica un libro selezionato
        modify() {
            //Prendo l'indeice del libro che sto modificando
            let index = ut.indexOf(this.modifica.id, this.biblioteca)

            this.modifica.genere = [];

            //Prende i generi li mette nel libro selezionato
            for (let i = 0; i < this.generi.length; i++) {
                if (this.generi[i].check) {
                    this.modifica.genere.push(i);
                }
            }

            //Sostituisco il libro
            this.biblioteca[index] = this.modifica;


            //Salvo il libro nel JSON
            let data = JSON.stringify(this.biblioteca, null, 2);
            fs.writeFileSync(path.resolve(__dirname, 'data', 'libri.json'), data)
            this.popUpClose();
            this.search();
        }
    }
}).mount('#app');

document.getElementById('back').addEventListener("click", function () {
    window.location.replace('index.html')
})

document.getElementById('reset').addEventListener("click", function () {
    window.location.reload();
})