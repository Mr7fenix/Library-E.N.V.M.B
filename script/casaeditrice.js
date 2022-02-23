const Vue = require('vue');
const ut = require('./script/function.js');
const sql = require('./script/database.js')

Vue.createApp({
    data() {
        return {
            editori: [{name: 'Caricamento...'}],
            addFlag: false,
            deleteFlag: false,
            removeFlag: false,
            renameFlag: false,
            newEditor: '',
            modifica: [],
        }
    },
    created() {
        this.list();
    },
    methods: {
        addPopup() {
            if (!this.deleteFlag) this.addFlag = true;
        },
        deletePopup(editore) {
            this.modifica = {...editore};
            if (!this.addFlag) this.deleteFlag = true;
        },
        closePopup() {
            this.deleteFlag = false;
            this.addFlag = false;
            this.removeFlag = false;
            this.renameFlag = false;


        },
        renamePopup(editore) {
            this.renameFlag = true;
            this.modifica = {...editore};

        },
        async add() {
            if (this.newEditor !== undefined) {
                await sql.query(`INSERT INTO editori (name)
                                 VALUES (?)`, ut.corrected(this.newEditor));
            }

            this.closePopup();
            this.list();
        },
        async remove() {
            await sql.query(`DELETE
                             FROM editori
                             WHERE id = ?`, this.modifica.id)

            this.closePopup();
            this.list();
        },
        async rename(){
            await sql.query(`UPDATE editori SET name = ? WHERE id = ?`, [this.modifica.name, this.modifica.id])

            this.closePopup();
            this.list();
        },
        back() {
            window.location.replace('index.html')
        },
        list(){
            ut.editorList().then(editori => {
                this.editori = editori
            });
        }
    }
}).mount("#app")
