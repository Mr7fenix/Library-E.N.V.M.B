const fs = require("fs");
const path = require("path");

let rawbiblioteca = fs.readFileSync(path.resolve(__dirname, '../data', 'libri.json'));
let libri = JSON.parse(rawbiblioteca);

//restituisce la lista di tutti gli autori
function authorList(){
    //array contenente tutti gli autori
    let authorList = []

    for (let i in libri){
        //controlle se l'autore è gia presente all'iterno dei dati in caso negativo lo aggiunge
        if (!authorList.includes(libri[i].autore)){
            authorList.push(libri[i].autore)
        }
    }
    return authorList;
}

//funzione che restituisce tutti gli editori
function editorList(){
    //prelevo dal file gli editori che sono salvati
    let editorlist = fs.readFileSync(path.resolve(__dirname, '../data', 'editori.txt')).toString().split('~');
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

//Verifica se un libro con un autore è già presente
function isPresent(title, editor){
    for(let i in libri){
        if (libri[i].name === title) if(libri[i].editore === editor) return true;
    }
}

//Funzione che restituisce un array di generi con il case giusto (Case giusto: Example, Case sbagliato: EXAMPLE)
//TODO: Modificare i generi nel file cosi da non dover più usare questa funzione.
function genereList(){
    let generi = fs.readFileSync(path.resolve( __dirname, '../data', 'genere.txt')).toString().split('~');

    for (let i in generi) {
        generi[i] = generi[i].toLowerCase();
        generi[i] = generi[i].charAt(0).toUpperCase() + generi[i].slice(1);
    }

    return generi;
}

function indexOf(id, biblioteca){
    for (let i = 0; i < biblioteca.length; i++) {
        if (biblioteca[i].id === id) {
            return i--;
        }
    }
}

module.exports = {
    authorList,
    editorList,
    arrayFirs,
    isPresent,
    genereList,
    indexOf
}