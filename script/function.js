import sql from "./database.js";

//restituisce la lista di tutti gli autori
function authorList() {
    return sql.query(`SELECT id, name
                      FROM autori`);
}

//funzione che restituisce tutti gli editori
function editorList() {
    return sql.query("SELECT id, name FROM editori");
}

function bookList(conditions = [], conditionsValue = []) {
    return sql.query(`SELECT libri.id,
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
                          ${conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : ""}
                      GROUP BY libri.id
                      ORDER BY libri.id;
    `, conditionsValue)
}

//Verifica se un libro con un autore è già presente

//Funzione che restituisce una lista di generi
function genereList() {
    return sql.query(`SELECT *
                      FROM generi`);
}

function indexOf(id, biblioteca) {
    for (let i = 0; i < biblioteca.length; i++) {
        if (biblioteca[i].id === id) {
            return i--;
        }
    }
}

function genereChek(libroId, generi) {

    let values;
    for (let i = 0; i < generi.length; i++) {
        if ((generi[i])) {
            if (values === undefined) {
                values = `(${libroId}, ${generi[i]})`
            } else {
                values += `, (${libroId}, ${generi[i]})`
            }
        }
    }
    return values
}

//Corregge gli errori fatti nell'inserimento dell titolo
function corrected(value) {
    return value.trim().split(/[ ]+/).map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

export default {
    authorList,
    editorList,
    bookList,
    genereList,
    indexOf,
    genereChek,
    corrected
}