<template>
  <body>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header">
        <h5 class="card-title">Aggiungi libro</h5>
      </div>
      <div class="card-body d-flex">
        <input class="form-control w-50 mx-1" autofocus type="text" placeholder="Titolo del libro" id="newTitle">
        <input class="form-control w-50 mx-1" placeholder="Nome autore" id="author" list="lis-aut">
        <select id="editor" class="form-select w-50">
          <option selected value="">Seleziona casa editrice</option>
          <option v-for="editore in editori" :value="editore.id">{{ editore.name }}</option>
        </select>
        <datalist id="lis-aut">
          <option selected value="">Seleziona autore</option>
          <option v-for="autore in autori" :value="autore.name">{{ autore.id }}</option>
        </datalist>
      </div>
      <div class="d-flex flex-wrap text-start mx-sm-4">
        <div v-for="genere in generi" class="col-6 form-check">
          <input class="form-check-input" type="checkbox" v-model="genere.check">
          <label class="form-check-label ">{{ genere.name }}</label>
        </div>
      </div>
      <div class="card-footer text-muted">
        <button class="btn btn-success mx-1" @click="result">Aggiungi Libro</button>
        <button class="btn btn-secondary mx-1" @click="back">Indietro</button>
      </div>
    </div>
  </div>
  </body>
</template>

<script>
import ut from "../script/function.js";
import api from "../script/api.js";
import "bootstrap";

export default {
  name: "NuovoLibro",
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
          author = (await api.post("/author/add", {
            authorName
          })).data
        }
        authorId = author.id;
      } else {
        authorId = parseInt(optionAuthor.text)
      }


      let editor = document.getElementById('editor').value;
      let newTitolo = document.getElementById('newTitle').value;

      let libroId = (await api.post("/book/add", {
        newTitolo,
        authorId,
        editor
      })).data

      for (let i in generi) {
        if (generi[i].check) {
          libroGenere.push(generi[i].id);
        }
      }
      console.log(libroGenere)

      console.log(libroId[0].id)
      let values = ut.genereChek(libroId[0].id, libroGenere)

      await api.post("/libri_genere/add", {
        values
      })

      //TODO inserire gli errori di bootstrap
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
};
</script>