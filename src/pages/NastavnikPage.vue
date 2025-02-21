<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-mb-md">
        <div>
          <q-input v-model="nazivSveucilista" readonly class="top-left-align" />
          <q-input v-model="nazivSastavnice" readonly class="top-left-align" />
          <q-input v-model="adresaSastavnice" readonly class="top-left-align" />
          <q-input v-model="nazivProjekta" readonly class="top-left-align" />
          <q-input v-model="voditeljProjekta" readonly class="top-left-align" />
        </div>
      </div>
      <div class="q-mb-md text-center">
        <q-select
          v-model="odabraneEdukacije"
          :options="edukacije"
          placeholder="Molimo odaberite naziv edukacije"
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

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

const fetchData = async () => {
  try {
    const sveucilisteInfo = await api.get('/RIWA_Sveuciliste')
    console.log('Sveučilište:', sveucilisteInfo.data)
    nazivSveucilista.value = sveucilisteInfo.data.nazivSveucilista
    nazivSastavnice.value = sveucilisteInfo.data.nazivSastavnice
    adresaSastavnice.value = sveucilisteInfo.data.adresaSastavnice
    nazivProjekta.value = sveucilisteInfo.data.nazivProjekta
    voditeljProjekta.value = sveucilisteInfo.data.voditeljProjekta

    const edukacijaInfo = await api.get('/RIWA_Edukacija')
    console.log('Edukacija:', edukacijaInfo.data)
    edukacije.value = edukacijaInfo.data

    const nastavnikInfo = await api.get('/RIWA_Nastavnik')
    console.log('Nastavnik:', nastavnikInfo.data)
    nastavnici.value = nastavnikInfo.data.map((prof) => ({
      idNastavnika: prof.idNastavnika,
      imeIPrezimeNastavnika: `${prof.titulaNastavnika} ${prof.imeIPrezimeNastavnika}`,
    }))

    const terminInfo = await api.get('/RIWA_Termin')
    console.log('Termin:', terminInfo.data)
    termini.value = terminInfo.data
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka:', error)
  }
}

const onSave = async () => {
  try {
    await api.post('/RIWA_Evidencija', {
      idEdukacija: odabraneEdukacije.value,
      idNastavnika: odabraniNastavnik.value,
      idTermina: odabraniTermin.value,
    })
    console.log('Podaci uspješno spremljeni')
  } catch (error) {
    console.error('Pogreška spremanja podataka:', error)
  }
}

const onEdit = async () => {
  try {
    await api.put('/RIWA_Evidencija', {
      idEdukacija: odabraneEdukacije.value,
      idNastavnika: odabraniNastavnik.value,
      idTermina: odabraniTermin.value,
    })
    console.log('Podaci uspješno uređeni')
  } catch (error) {
    console.error('Pogreška kod uređivanja podataka:', error)
  }
}

const onDelete = async () => {
  try {
    await api.delete('/RIWA_Evidencija', {
      data: {
        idEdukacija: odabraneEdukacije.value,
        idNastavnika: odabraniNastavnik.value,
        idTermina: odabraniTermin.value,
      },
    })
    console.log('Podaci uspješno obrisani')
  } catch (error) {
    console.error('Pogreška brisanja podataka:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>
