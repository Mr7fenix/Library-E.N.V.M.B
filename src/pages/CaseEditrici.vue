<template>
  <div id="app" class="container mt-5 pt-3">

    <nav class="navbar navbar-dark bg-primary fixed-top shadow-nav">
      <div class="d-flex">
        <input id="search" class="mx-2 input d-flex align-items-start form-control" placeholder="Casa editrice"
               list="editorList">
        <datalist id="editorList">
          <option v-for="editore in editori">{{ editore.name }}</option>
        </datalist>
        <button class="btn btn-success mx-1 shadow-sm" @click="search"> Ricerca</button>
        <a onclick="location.reload()" class="btn btn-secondary mx-1 shadow-sm"> Ripristina </a>
      </div>
      <div class="ms-auto mx-2">
        <button class="btn btn-success mx-1 shadow-sm" data-bs-toggle="modal"
                data-bs-target="#add">Aggiungi Casa editrice
        </button>
        <button class="btn btn-secondary shadow-sm" @click="back">Indietro</button>
      </div>
    </nav>


    <div class="modal" tabindex="-1" id="rename">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Rinomina</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input class="form-control" type="text" v-model="modifica.name">
          </div>
          <div class="modal-footer">
            <button data-bs-dismiss="modal" class="btn btn-primary" @click="rename">Rinomina</button>
            <button data-bs-dismiss="modal" class="btn btn-secondary">Indietro</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" id="delete">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="modal-title">Sicuro di voler eliminare {{ modifica.name }}</h5>
          </div>
          <div class="modal-footer">
            <button data-bs-dismiss="modal" class="btn btn-danger" @click="remove">Elimina</button>
            <button data-bs-dismiss="modal" class="btn btn-secondary">Indietro</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" id="add">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1>Nuova casa editrice</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input class="form-control" v-model="newEditor" type="text" placeholder="Nome della nuova casa editrice">
          </div>
          <div class="modal-footer">
            <button data-bs-dismiss="modal" class="btn btn-primary" @click="add">Aggiungi</button>
            <button data-bs-dismiss="modal" class="btn btn-secondary">Indietro</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-if="!editori.length" v-for="i in 10" :key="i" class="card my-1 shadow-sm placeholder-glow">
        <div class="card-body d-flex align-items-center">
          <h5 class="card-title placeholder w-25"></h5>
          <div class="ms-auto">
            <button class="btn btn-primary mx-1 placeholder">Rinomina</button>
            <button class="btn btn-danger placeholder">Elimina</button>
          </div>

        </div>
      </div>

      <div v-for="editore in editori">
        <div class="card my-1 shadow-sm">
          <div class="card-body d-flex align-items-center">
            <h5 class="card-title">{{ editore.name }}</h5>
            <div class="ms-auto">
              <button class="btn btn-primary mx-1" @click="renamePopup(editore)" data-bs-toggle="modal"
                      data-bs-target="#rename">Rinomina
              </button>
              <button class="btn btn-danger" @click="deletePopup(editore)" data-bs-toggle="modal"
                      data-bs-target="#delete">Elimina
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ut from "../script/function.js";
import api from "../script/api";
import "bootstrap";


export default{
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
        await api.post("/editor/add", {
          newEditor: ut.corrected(this.newEditor),
        })
      }

      this.list();
    },
    async remove() {
      let id = this.modifica.id;
      await api.post("/editor/remove", {
        id
      })

      this.list();
    },
    async rename() {
      //TODO fare un errore quando non viene inserito alcun nome
      let name = this.modifica.name;
      let id = this.modifica.id
      await api.post("/editor/rename", {
        name,
        id,
      })
      this.list();
    },
    async search() {
      let ricerca = document.getElementById("search").value;
      this.editori = (await api.post("/editore/search",{
        ricerca,
      })).data;
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
}
</script>

<style scoped>

</style>