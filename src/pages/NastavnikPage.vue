<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Nastavnik izvođač edukacije </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="q-pa-md">
          <q-card class="q-mb-md top-left-align" style="max-width: 600px">
            <q-card-section>
              <div
                v-if="
                  nazivSveucilista ||
                  nazivSastavnice ||
                  adresaSastavnice ||
                  nazivProjekta ||
                  voditeljProjekta
                "
              >
                <p v-if="nazivSveucilista" class="q-mb-xs">{{ nazivSveucilista }}</p>
                <p v-if="nazivSastavnice" class="q-mb-xs">{{ nazivSastavnice }}</p>
                <p v-if="adresaSastavnice" class="q-mb-xs">{{ adresaSastavnice }}</p>
                <p v-if="nazivProjekta" class="q-mb-xs">Naziv projekta: {{ nazivProjekta }}</p>
                <p v-if="voditeljProjekta" class="q-mb-xs">
                  Voditelj projekta: {{ voditeljProjekta }}
                </p>
              </div>
              <div v-else>
                <p>Nema podataka za prikaz</p>
              </div>
            </q-card-section>
          </q-card>
          <div class="q-mb-md text-center">
            <q-select
              v-model="odabraneEdukacije"
              :options="edukacije"
              placeholder="Molimo odaberite naziv edukacije"
              label="Molimo odaberite naziv edukacije"
              option-value="idEdukacije"
              option-label="nazivEdukacije"
            />
          </div>
          <div class="q-mb-md">
            <q-select
              v-model="odabraniNastavnik"
              :options="nastavnici"
              label="Ime i prezime nastavnika izvođača edukacije"
              option-value="idNastavnika"
              option-label="imeIPrezimeNastavnika"
            />
            <q-select
              v-model="odabraniTermin"
              :options="termini"
              label="Termin održane edukacije"
              option-value="idTermina"
              option-label="termin"
            />
          </div>
          <div class="q-mb-md">
            <q-btn color="primary" label="Spremi" @click="onSave" />
            <q-btn color="green" label="Izmijeni" @click="onEdit" />
            <q-btn color="red" label="Obriši" @click="onDelete" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

defineOptions({
  name: 'NastavnikPage',
})

const nazivSveucilista = ref('')
const nazivSastavnice = ref('')
const adresaSastavnice = ref('')
const nazivProjekta = ref('')
const voditeljProjekta = ref('')

const edukacije = ref([]) // Varijabla za pohranu podataka o edukacijama
const odabraneEdukacije = ref(null)

const nastavnici = ref([])
const odabraniNastavnik = ref(null)

const termini = ref([])
const odabraniTermin = ref(null)

const dohvatiSveuciliste = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/RIWA_Sveuciliste')
    nazivSveucilista.value = response.data.nazivSveucilista
    nazivSastavnice.value = response.data.nazivSastavnice
    adresaSastavnice.value = response.data.adresaSastavnice
    nazivProjekta.value = response.data.nazivProjekta
    voditeljProjekta.value = response.data.voditeljProjekta
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o sveučilištu:', error)
  }
}

const dohvatiEdukacije = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/RIWA_Edukacija')
    edukacije.value = response.data
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o edukacijama:', error)
  }
}

const dohvatiNastavnike = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/RIWA_Nastavnik')
    nastavnici.value = response.data
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o nastavnicima:', error)
  }
}

const dohvatiTermine = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/RIWA_Termin')
    termini.value = response.data
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o terminima:', error)
  }
}

const onSave = async () => {
  try {
    await axios.post('http://localhost:3000/api/RIWA_Evidencija', {
      idEdukacija: odabraneEdukacije.value,
      idNastavnika: odabraniNastavnik.value,
      idTermina: odabraniTermin.value,
    })
    alert('Evidencija uspješno spremljena!')

    odabraneEdukacije.value = null
    odabraniNastavnik.value = null
    odabraniTermin.value = null
  } catch (error) {
    console.error('Pogreška spremanja podataka:', error)
    alert('Pogreška spremanja podataka')
  }
}

const onEdit = async () => {
  try {
    await axios.put('http://localhost:3000/api/RIWA_Evidencija', {
      idEdukacija: odabraneEdukacije.value,
      idNastavnika: odabraniNastavnik.value,
      idTermina: odabraniTermin.value,
    })
    alert('Evidencija uspješno uređena!')

    odabraneEdukacije.value = null
    odabraniNastavnik.value = null
    odabraniTermin.value = null
  } catch (error) {
    console.error('Pogreška kod uređivanja podataka:', error)
    alert('Pogreška kod uređivanja podataka')
  }
}

const onDelete = async () => {
  try {
    await axios.delete('http://localhost:3000/api/RIWA_Evidencija', {
      data: {
        idEdukacija: odabraneEdukacije.value,
        idNastavnika: odabraniNastavnik.value,
        idTermina: odabraniTermin.value,
      },
    })
    alert('Evidencija uspješno obrisana!')

    odabraneEdukacije.value = null
    odabraniNastavnik.value = null
    odabraniTermin.value = null
  } catch (error) {
    console.error('Pogreška brisanja podataka:', error)
    alert('Pogreška brisanja podataka')
  }
}

onMounted(() => {
  dohvatiSveuciliste()
  dohvatiEdukacije()
  dohvatiNastavnike()
  dohvatiTermine()
})
</script>

<style scoped>
.top-left-align {
  text-align: left;
  margin-bottom: 10px;
}
.q-mb-xs {
  margin-bottom: 5px;
}
</style>
