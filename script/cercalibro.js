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
            libri: [{
                titolo: "Caricamento...",
                autore: "Caricamento...",
                editore: "Caricamento...",
                genere: "Caricamento..."
            }],
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


        sql.query(`SELECT id, name
                   FROM autori`).then(result => this.autori = result);
        sql.query(`SELECT libri.id,
                          titolo,
                          aut.name                              AS autore,
                          edi.name                              As editore,
                          edi.id                                AS editorId,
                          aut.id                                AS authorId,
                          GROUP_CONCAT(gen.id)                  AS genereId,
                          GROUP_CONCAT(gen.name SEPARATOR ', ') AS genere
                   FROM libri
                            LEFT JOIN autori aut ON libri.autore = aut.id
                            LEFT JOIN editori edi ON libri.editore = edi.id
                            LEFT JOIN libri_generi lg on libri.id = lg.libro
                            LEFT JOIN generi gen on gen.id = lg.genere
                   GROUP BY libri.id
                   ORDER BY libri.id;
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

            //Viene composta una stringa che verrà poi usata per fare una query
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

            //Query che effetua la ricerca nel database
            this.libri = await sql.query(`SELECT libri.id,
                                                 titolo,
                                                 aut.name                              AS autore,
                                                 edi.name                              As editore,
                                                 edi.id                                AS editorId,
                                                 aut.id                                AS authorId,
                                                 GROUP_CONCAT(gen.id)                  AS genereId,
                                                 GROUP_CONCAT(gen.name SEPARATOR ', ') AS genere
                                          FROM libri
                                                   LEFT JOIN autori aut ON libri.autore = aut.id
                                                   LEFT JOIN editori edi ON libri.editore = edi.id
                                                   LEFT JOIN libri_generi lg on libri.id = lg.libro
                                                   LEFT JOIN generi gen on gen.id = lg.genere
                                              ${conditions.length > 0 ? "WHERE" + conditions.join(" AND ") : ""}
                                          GROUP BY libri.id
                                          ORDER BY libri.id`, conditionsValue)
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
            let genereId = this.biblioteca[ut.indexOf(this.modifica.id, this.biblioteca)].genereId;
            let genereCode = genereId ? genereId.split(",") : []

            //Visualizza checked i check box dei generi del libro
            for (let i = 0; i < generi.length; i++) {
                check.push({"id": i + 1, "name": generi[i], "check": false})
            }
            for (let i = 0; i < genereCode.length; i++) {
                check[parseInt(genereCode[i]) - 1].check = true
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
            //Riozione nella tabella libri_generi
            await sql.query(`DELETE
                             FROM libri_generi
                             WHERE libro = ?`, this.modifica.id)

            //Rimozione nella tabella libro
            await sql.query(`DELETE
                             FROM libri
                             WHERE id = ?`, this.modifica.id)

            //Rieffetua la ricerca per aggiornare la pagina
            await this.search();
            this.popUpClose();
        },
        //Funzione che modifica un libro selezionato
        async modify() {
            let newAuthor = document.getElementById("newAuthor").value;
            let newEditor = document.getElementById("newEditor").value;


            let values
            for (let i = 0; i < this.generi.length; i++) {
                if (this.generi[i].check) {
                    if (values === undefined) {
                        values = `(${this.modifica.id}, ${this.generi[i].id})`
                    } else {
                        values += `, (${this.modifica.id}, ${this.generi[i].id})`
                    }
                }
            }

            if (values) {
                await sql.query(`UPDATE libri
                                 SET titolo  = ?,
                                     autore  = ?,
                                     editore = ?
                                 WHERE id = ?`,
                    [this.modifica.titolo, newAuthor, newEditor, this.modifica.id]
                );

                await sql.query(`DELETE
                                 FROM libri_generi
                                 WHERE libro = ?`, this.modifica.id)
                await sql.query(`INSERT INTO libri_generi (libro, genere)
                                 VALUES ${values}`)

                this.popUpClose();
                await this.search();
            } else {
                alert("Inserire un genere")
            }
        },
        back(){
            window.location.replace('index.html')
        },
        reload(){
            window.location.reload();
        }
    }
}).mount('#app');
