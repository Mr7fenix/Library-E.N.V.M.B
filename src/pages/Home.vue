<template>
  <div class="position-absolute top-50 translate-middle-y w-100 text-center">
    <div class="container p-4 bg-primary shadow-lg card">
      <h1 class="text-center text-light mb-3">Biblioteca E.N.V.M.B.</h1>
      <div class="text-center">
        <router-link to="NuovoLibro" class="btn btn-success mx-1 shadow">Aggiungi libro</router-link>
        <router-link to="CaseEditrici" class="btn btn-success mx-1 shadow">Case editrici</router-link>
        <router-link to="CercaLibro" class="btn btn-success mx-1 shadow">Cerca libro</router-link>
        <button onclick="window.close()" class="btn btn-danger mx-1 shadow">Esci</button>
      </div>
      <h4 class="mt-3 text-light">Libri attualmente in possesso: {{ nLibri }}</h4>
      <div class="text-center">

      </div>
    </div>
  </div>
</template>

<script>
import ut from "../script/function"

export default {
  name: "Home",
  data() {
    return {
      nLibri: 0
    }
  },
  created() {
    ut.bookList().then(result => {
      this.nLibri = result.length;
    })
  }
}
</script>

<style scoped>

</style>