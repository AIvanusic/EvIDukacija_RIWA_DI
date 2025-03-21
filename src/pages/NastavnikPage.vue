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
              option-label="nastavnikLabel"
              @change="dohvatiEvidenciju"
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
//import axios from 'axios'
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

const odabranaEvidencija = ref(null) // Varijabla za pohranu odabrane evidencije

const dohvatiSveuciliste = async () => {
  try {
    const response = await api.get('/RIWA_Sveuciliste')
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
    const response = await api.get('/RIWA_Edukacija')
    edukacije.value = response.data
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o edukacijama:', error)
  }
}

const dohvatiNastavnike = async () => {
  try {
    const response = await api.get('/RIWA_Nastavnik')
    nastavnici.value = response.data.map((nastavnik) => ({
      ...nastavnik,
      nastavnikLabel: `${nastavnik.titulaNastavnika || ''} ${nastavnik.imeIPrezimeNastavnika || ''}`,
    }))
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o nastavnicima:', error)
  }
}

const dohvatiTermine = async () => {
  try {
    const response = await api.get('/RIWA_Termin')
    termini.value = response.data
  } catch (error) {
    console.error('Pogreška dohvaćanja podataka o terminima:', error)
  }
}

const dohvatiEvidenciju = async () => {
  try {
    if (odabraniNastavnik.value) {
      const response = await api.get(`/RIWA_Evidencija?nastavnikId=${odabraniNastavnik.value}`)
      if (response.data.length > 0) {
        odabranaEvidencija.value = response.data[0]
        odabraneEdukacije.value = odabranaEvidencija.value.idEdukacije
        odabraniTermin.value = odabranaEvidencija.value.idTermina
      } else {
        alert('Nema zapisa za odabranog nastavnika.')
      }
    }
  } catch (error) {
    console.error('Pogreška dohvaćanja evidencije:', error)
  }
}

const onSave = async () => {
  try {
    await api.post('/RIWA_Evidencija', {
      NedukacijaID: odabraneEdukacije.value?.idEdukacije,
      NnastavnikID: odabraniNastavnik.value?.idNastavnika,
      NterminID: odabraniTermin.value?.idTermina,
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
  if (!odabraniNastavnik.value) {
    alert('Molimo odaberite svoje ime kako biste mogli izmijeniti zapis.')
    return
  }

  try {
    await api.put('/RIWA_Evidencija', {
      NedukacijaID: odabraneEdukacije.value?.idEdukacije,
      NnastavnikID: odabraniNastavnik.value?.idNastavnika,
      NterminID: odabraniTermin.value?.idTermina,
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
  if (!odabraniNastavnik.value || !odabraneEdukacije.value || !odabraniTermin.value) {
    alert('Molimo odaberite svoje ime kako biste mogli obrisati zapis.')
    return
  }

  try {
    await api.delete('/RIWA_Evidencija', {
      data: {
        NedukacijaID: odabraneEdukacije.value?.idEdukacije,
        NnastavnikID: odabraniNastavnik.value?.idNastavnika,
        NterminID: odabraniTermin.value?.idTermina,
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
