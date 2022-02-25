<template>
  <div class="container mt-5 p-3">
    <nav class="navbar navbar-dark bg-primary fixed-top shadow-nav">
      <div class="d-flex search-list w-100">
        <input class="d-flex form-control search-input mx-1" placeholder="Titolo" list="titleList" id="title">
        <datalist id="titleList">
          <option v-for="libro in libri">{{ libro.titolo }}</option>
        </datalist>

        <select class="d-flex form-select search-input mx-1" id="autor-list">
          <option selected value="">Autore</option>
          <option v-for="autore in autori" :value="autore.id">{{ autore.name }}</option>
        </select>

        <select class="d-flex form-select search-input mx-1" id="editor-list">
          <option selected value="">Editore</option>
          <option v-for="editore in editori" :value="editore.id">{{ editore.name }}</option>
        </select>
        <button @click="search" class="btn btn-success mx-1">Cerca</button>
        <button @click="reload" class="btn btn-outline-light mx-1">Ripristina</button>
        <button @click="back" class="btn btn-secondary mx-1">Indietro</button>
      </div>
    </nav>

    <div id="modify" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input class="form-control mb-1" v-model="modifica.titolo">
            <div class="d-flex">
              <select class="form-select me-1" v-model="modifica.authorId" id="newAuthor">
                <option v-for="autore in autori" :value="autore.id">{{ autore.name }}</option>
              </select>
              <select class="w-50 form-select d-flex ms-auto" v-model="modifica.editorId" id="newEditor">
                <option v-for="editore in editori" :value="editore.id">{{ editore.name }}</option>
              </select>
            </div>
            <div class="d-flex flex-wrap">
              <div v-for="genere in generi" class="col-6 form-check">
                <input class="form-check-input" type="checkbox" v-model="genere.check">
                <label class="form-check-label">{{ genere.name }}</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" data-bs-dismiss="modal" @click="modify">Modifica</button>
            <button class="btn btn-danger" data-bs-dismiss="modal">Indietro</button>
          </div>
        </div>
      </div>
    </div>

    <div id="delete" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sei sicuro di voler rimuovere?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="modal-title"> {{ modifica.titolo }}</h5>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" data-bs-dismiss="modal" @click="remove">Elimina</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Indietro</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Card per i libri -->
    <div v-if="!libri.length" v-for="i in 10" class="card my-2 shadow placeholder-glow">
      <div class="card-body d-flex">
        <div style="width: 36%">
          <h4 class="card-title mx-2 placeholder">io sono il re di o o o</h4>
          <h6 class="card-subtitle ms-2 placeholder">o o o o o o o o</h6>
        </div>
        <div class="d-block ms-auto text-start my-auto me-5">
          <h6 class="card-subtitle"></h6>
        </div>
        <div class="text-start mt-3">
          <button class="btn btn-primary mx-1 placeholder">Modifica</button>
          <button class="btn btn-danger placeholder">Elimina</button>
        </div>
      </div>
    </div>

    <div v-for="libro in libri" class="card my-2 shadow">
      <div class="card-body d-flex">
        <div style="width: 36%">
          <h4 class="card-title mx-2">{{ libro.titolo }}</h4>
          <h6 class="card-subtitle ms-2 ">di {{ libro.autore }}</h6>
          <div class="d-block ms-auto text-start">
            <span v-for="gen in libro.genere.split(',')" class="badge bg-primary ms-1 my-1">{{ gen }}</span>
          </div>
        </div>
        <div class="d-block ms-auto text-start my-auto me-5">
          <h6 class="card-subtitle">{{ libro.editore }}</h6>
        </div>
        <div class="text-start mt-3">
          <button class="btn btn-primary mx-1" @click="modifyPopUp(libro)" data-bs-toggle="modal"
                  data-bs-target="#modify">Modifica
          </button>
          <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete" @click="removePopup(libro)">
            Elimina
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ut from "../../script/function.js";
import sql from "../../script/database.js";
import "bootstrap";

export default {
  name: "CercaLibro",
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
    //TODO cliccare sul genere cerca i libri di quel genere
    //TODO pulsanti modifica ed elimina non funzionano


    ut.authorList().then(result => this.autori = result);
    ut.editorList().then(result => this.editori = result);
    ut.bookList().then(result => {
      this.biblioteca = result;
      this.libri = this.biblioteca;
    });

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
      this.libri = await ut.bookList(conditions, conditionsValue);
    },
    //Visualizza la finestra di modifica con i dati del libro selezionato già inseriti
    async modifyPopUp(libro) {
      //Visualizza la finestra di popUp
      if (!this.popUpRemove) this.popUpModify = true;
      //Viene passato il libro selezionato
      this.modifica = {...libro};

      //Viene prelevata la lista di tutti i generi
      let generi = await ut.genereList();
      let check = [];

      //Prende il codice del genere del libro selezionato
      let genereId = this.biblioteca[ut.indexOf(this.modifica.id, this.biblioteca)].genereId;
      let genereCode = genereId ? genereId.split(",").map(str => parseInt(str)) : []

      //Visualizza checked i check box dei generi del libro
      for (let i = 0; i < generi.length; i++) {
        check.push({...generi[i], "check": false})
      }
      for (let i = 0; i < check.length; i++) {
        if (genereCode.includes(check[i].id)) {
          check[i].check = true
        }
      }
      //Restituische i generi cheked
      this.generi = check;
    },
    removePopup(libro) {
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

        await this.search();
      } else {
        alert("Inserire un genere")
      }
    },
    back() {
      window.location.replace('index.html')
    },
    reload() {
      window.location.reload();
    }
  }
};
</script>

<style scoped>
@media screen and (max-width: 790px) {
  .search-list {
    flex-wrap: wrap;
  }
}

.search-input {
  width: 25%;
}

@media screen and (max-width: 500px) {
  .search-input {
    width: 100%;
    margin-bottom: 0.25em;
  }
}
</style>