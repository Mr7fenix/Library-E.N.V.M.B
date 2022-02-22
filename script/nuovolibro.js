const Vue = require('vue');
const fs = require('fs');
const ut = require('./script/function.js');
let path = require('path')


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
        let generi = ut.genereList();

        //Crea un array che contiene si generi che chek e non check
        let check = [];
        for (let i in generi) {
            check.push({"name": generi[i], "check": false})
        }

        this.generi = check;
        this.autori = ut.authorList();
        this.editori = ut.arrayFirs('Seleziona casa editrice', ut.editorList());
    },
    methods: {
        result() {
            let libroGenere = [];
            let generi = this.generi;

            let titolo = document.getElementById('newTitle').value;
            let editore = document.getElementById('editor').value;

            //Controlla i generi e inserisce quelli selezionati in una variabile
            for (let i in generi) {
                if (generi[i].check) {
                    libroGenere.push(parseInt(i));
                }
            }

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

            //Controlla se il libro è gia presente
            if (ut.isPresent(correctedTitle(), editore)) {
                error("Libro già presente");
                return;
            }

            let rawData = fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json'));
            let oldData = JSON.parse(rawData);
            console.log(oldData)


            //Crea un nuovo libro
            let libro = {
                "id": oldData.length,
                "name": correctedTitle(),
                "autore": correctedAutor(),
                "editore": editore,
                "genere": libroGenere
            }

            oldData.push(libro);


            let data = JSON.stringify(oldData, null, 2);
            fs.writeFileSync(path.resolve(__dirname, 'data', 'libri.json'), data)

            document.getElementById('notifica').innerText = 'Libro aggiunto correttamente';
            document.getElementById('body').style.backgroundColor = '#5eff52';
        },
        back() {
            window.location.replace('index.html')
        }
    }
}).mount('#app')

//Cambia la pagina in rosso e scrive il messaggio di errore
function error(messange) {
    document.getElementById('notifica').innerText = messange;
    document.getElementById('body').style.backgroundColor = '#ff5252';
}

//Corregge gli errori fatti nell'inserimento dell titolo
function correctedTitle() {
    let title = document.getElementById('newTitle').value[0].toUpperCase() + document.getElementById('newTitle').value.slice(1).toLowerCase()
    if (title.substring(title.length - 1) === ' ') {
        title = title.substring(0, title.length - 1);
    }
    return title;
}

//Corregge gli errori fatti nell'inserimento dell autore
function correctedAutor() {
    let autor = document.getElementById('autor').value;
    if (autor.substring(autor.length - 1) === ' ') {
        autor = autor.substring(0, autor.length - 1);
    }
    return autor;
}

function risolutorediproblemisupremo() {
    let mysql = require('mysql2');

    let con = mysql.createConnection({
        host: "mario.dicyplay.com",
        user: "biblioteca",
        password: "@xXStoCazz0Xx@",
        database: "biblioteca"
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });

    let lista = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data', 'libri.json')));
    //let lista = ut.genereList();
    //console.log(lista)
    //
    //for (let i = 0; i < lista.length; i++) {
    //    con.query(
    //        `INSERT INTO generi (name) values (?)`,
    //        [lista[i]],
    //        function (err) {
    //            if (err) {
    //                console.log("error at i:" + i + ", genere: " + lista[i], err)
    //            }
    //        }
    //    )
    //    console.log(i);
    //}

    //for (let i = 0; i < lista.length; i++){
    //    for (let k = 0; k < lista[i].genere.length; k++) {
    //        //console.log(lista[i].name, lista[i].genere[k]);
    //        con.query(
    //            `INSERT INTO libri_generi (libro, genere) values ((SELECT id FROM libri WHERE titolo = ? LIMIT 1), ?)`,
    //            [lista[i].name, lista[i].genere[k] + 1],
    //
    //            function (err) {
    //                if (err) {
    //                    console.log("error at i:" + i + ", k: " + k + ", genere+1: " + lista[i].genere[k], lista[i].name, err)
    //                }
    //            }
    //        )
    //    }
    //    console.log(i);
    //}

}
