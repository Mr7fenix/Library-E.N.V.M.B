const Vue = require('vue');
const ut = require('./script/function.js');
const sql = require('./script/database.js')
const bootstrap = require('bootstrap')

Vue.createApp({
    data() {
        return {
            editori: [],
            newEditor: '',
            modifica: [],
        }
    },
    created() {
        this.list();
    },
    methods: {
        deletePopup(editore) {
            this.modifica = {...editore};
        },
        renamePopup(editore) {
            this.modifica = {...editore};

        },
        async add() {
            if (this.newEditor !== undefined) {
                await sql.query(`INSERT INTO editori (name)
                                 VALUES (?)`, ut.corrected(this.newEditor));
            }

            this.list();
        },
        async remove() {
            await sql.query(`DELETE
                             FROM editori
                             WHERE id = ?`, this.modifica.id)

            this.list();
        },
        async rename() {
            //TODO fare un errore quando non viene inserito alcun nome
            await sql.query(`UPDATE editori
                             SET name = ?
                             WHERE id = ?`, [this.modifica.name, this.modifica.id])
            this.list();
        },
        async search() {
            let ricerca = document.getElementById("search").value;
            this.editori = await sql.query(`SELECT id, name
                                            FROM editori
                                            WHERE name LIKE '%${ricerca}%'`)
        },
        back() {
            window.location.replace('index.html')
        },
        list() {
            ut.editorList().then(editori => {
                this.editori = editori
            });
        }
    }
}).mount("#app")
