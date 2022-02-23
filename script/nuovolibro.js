const Vue = require('vue');
const ut = require('./script/function.js');
let sql = require('./script/database.js')


Vue.createApp({
    data() {
        return {
            generi: [],
            autori: [],
            editori: []
        }
    },
    created() {
        //Crea un alista di generi
        ut.genereList().then(generi => {
            let check = [];
            for (let i in generi) {
                check.push({...generi[i], "check": false})
            }
            this.generi = check;
        })

        ut.authorList().then(autori => {
            this.autori = autori;
        });

        ut.editorList().then(editori => {
            this.editori = editori;
        });
    },
    methods: {
        async result() {
            let authorName = ut.corrected(document.getElementById('author').value);
            let optionAuthor = document.querySelector(`option[value="${authorName}"]`)
            let libroGenere = [];
            let generi = this.generi;

            let authorId = 0;
            if (optionAuthor === null) {
                let author = this.getAuthor(authorName);
                if (author === null) {
                    await sql.query(`INSERT INTO autori (name)
                                     VALUES (?)`, authorName)
                    author = await sql.query(`SELECT id
                                              FROM autori
                                              ORDER BY id DESC LIMIT 1`)[0];
                }
                authorId = author.id;
            } else {
                authorId = parseInt(optionAuthor.text)
            }


            let newEditor = document.getElementById('editor').value;
            let newTitolo = document.getElementById('newTitle').value;

            await sql.query(`INSERT INTO libri (titolo, autore, editore)
                             VALUES (?, ?, ?)`, [newTitolo, authorId, newEditor])
            let libroId = await sql.query('SELECT id FROM libri ORDER BY id DESC LIMIT 1');

            for (let i in generi) {
                if (generi[i].check) {
                    libroGenere.push(generi[i].id);
                }
            }
            console.log(libroGenere)

            console.log(libroId[0].id)
            let values = ut.genereChek(libroId[0].id, libroGenere)

            await sql.query(`INSERT INTO libri_generi (libro, genere)
                             VALUES ${values}`);


            //Controllo degli erroi
            if (libroGenere.length === 0) {
                error("Genere non inserito");
                return;
            }
            if (titolo === '') {
                error("Titolo non inserito");
                return;
            }
            if (document.getElementById('autor').value === '') {
                error("Autore non inserito");
                return;
            }
            if (editore === 'Seleziona casa editrice') {
                error("Casa editrice non inserita");
                return;
            }
            document.getElementById('notifica').innerText = 'Libro aggiunto correttamente';
            document.getElementById('body').style.backgroundColor = '#5eff52';
        },
        back() {
            window.location.replace('index.html')
        }
        ,
//Corregge gli errori fatti nell'inserimento dell autore
        getAuthor(authorName) {
            authorName = authorName.trim().toLowerCase();
            for (let i = 0; i < this.autori.length; i++) {
                if (this.autori[i].name.toLowerCase() === authorName) {
                    return this.autori[i];
                }
            }
            return null;
        }
    }
}).mount('#app')

//Cambia la pagina in rosso e scrive il messaggio di errore
function error(message) {
    document.getElementById('notifica').innerText = message;
    document.getElementById('body').style.backgroundColor = '#ff5252';
}

//function risolutorediproblemisupremo() {}
