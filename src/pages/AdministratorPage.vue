<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="q-pa-md">
          <!-- Pregled upisanih evidencija -->
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-btn
                color="primary"
                label="Pregled upisanih evidencija"
                @click="promijeniPrikazEvidencija"
              />
              <div v-if="showEvidencije">
                <div v-if="!evidencijaPrikazana">
                  <q-select
                    v-model="odabranaEdukacija"
                    :options="edukacije"
                    label="Odaberite edukaciju"
                    option-value="idEdukacije"
                    option-label="nazivEdukacije"
                    @change="dohvatiTermine"
                  />
                  <q-select
                    v-if="termini.length > 0"
                    v-model="odabraniTermin"
                    :options="termini"
                    label="Odaberite termin"
                    option-value="idTermina"
                    option-label="termin"
                  />
                  <q-btn
                    v-if="odabraniTermin"
                    color="primary"
                    label="PRIKAŽI EVIDENCIJU"
                    @click="provjeriEvidenciju"
                    class="q-mt-md"
                  />
                </div>
                <div v-if="evidencijaPrikazana">
                  <p><strong>Edukacija:</strong> {{ odabranaEdukacija.nazivEdukacije }}</p>
                  <p><strong>Termin održavanja:</strong> {{ odabraniTermin.termin }}</p>
                  <p>
                    <strong>Nastavnik izvođač edukacije:</strong>
                    {{ evidencija[0].titulaNastavnika }} {{ evidencija[0].imeIPrezimeNastavnika }}
                  </p>
                  <p><strong>Polaznici:</strong></p>
                  <ul>
                    <li v-for="polaznik in filtriraniPolaznici" :key="polaznik.idZapisa">
                      {{ polaznik.imeIPrezimePolaznika }}
                    </li>
                  </ul>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ovdje će Administrator upravljati edukacijama-->
        <!--Želim da gumbi stoje na vrhu, u istom q-cardu, ali iznad tablice-->
        <div class="q-pa-md">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section class="row justify-between">
              <div>
                <q-btn
                  color="primary"
                  label="Pregled ponuđenih edukacija"
                  @click="promijeniPrikazEdukacija"
                />
              </div>
              <div>
                <q-btn color="primary" label="Nova edukacija" @click="onAddRowEdukacije" />
                <q-btn
                  v-if="RIWA_Edukacija.length !== 0"
                  class="q-ml-sm"
                  color="primary"
                  label="Izmijeni edukaciju"
                  @click="onEditRowEdukacije"
                />
                <q-btn
                  v-if="RIWA_Edukacija.length !== 0"
                  class="q-ml-sm"
                  color="red"
                  label="Obriši edukaciju"
                  @click="onDeleteRowEdukacija"
                />
              </div>
            </q-card-section>
            <q-card-section v-if="showEdukacije">
              <q-table
                title="Edukacije"
                :rows="edukacije"
                :columns="columnsEdukacije"
                row-key="idEdukacije"
                flat
                selection="single"
                v-model:selected="RIWA_Edukacija"
                @update:selected="onSelectionRowEdukacije"
              />
            </q-card-section>
          </q-card>
        </div>

        <!--<div class="q-pa-md">{{ RIWA_Edukacija }}</div>-->

        <div class="q-pa-md" v-if="showFormEdukacije">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-form @submit="onSaveEdukacije">
                <q-input
                  filled
                  v-model="urediEdukaciju.nazivEdukacije"
                  label="Naziv edukacije"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Unesite naziv edukacije']"
                />
                <div>
                  <q-btn label="Spremi Edukaciju" type="submit" color="primary" />
                  <q-btn
                    label="Zatvori prozor za uređenje edukacija"
                    color="primary"
                    @click="onCloseEdukacije"
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- ovdje će administrator raditi s terminima na svim edukacijama-->
        <div class="q-pa-md">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section class="row justify-between">
              <div>
                <q-btn
                  color="primary"
                  label="Pregled svih termina"
                  @click="promijeniPrikazTermina"
                />
              </div>
              <div>
                <q-btn color="primary" label="Novi termin" @click="onAddRowTermini" />
                <q-btn
                  v-if="RIWA_Termin.length !== 0"
                  class="q-ml-sm"
                  color="primary"
                  label="Izmijeni termin"
                  @click="onEditRowTermini"
                />
                <q-btn
                  v-if="RIWA_Termin.length !== 0"
                  class="q-ml-sm"
                  color="red"
                  label="Obriši termin"
                  @click="onDeleteRowTermini"
                />
              </div>
            </q-card-section>
            <q-card-actions v-if="showTermini">
              <q-table
                title="Termini"
                :rows="termini"
                :columns="columnsTermini"
                row-key="idTermina"
                flat
                selection="single"
                v-model:selected="RIWA_Termin"
                @update:selected="onSelectionRowTermini"
              />
            </q-card-actions>
          </q-card>
        </div>
        <!--<div class="q-pa-md">{{ RIWA_Termin }}</div>-->

        <div class="q-pa-md" v-if="showFormTermini">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-form @submit="onSaveTermini">
                <q-input
                  filled
                  v-model="urediTermin.termin"
                  label="Termin održavanja edukacije"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Unesite termin']"
                />
                <div>
                  <q-btn label="Spremi termin" type="submit" color="primary" />
                  <q-btn
                    label="Zatvori prozor za unos i izmjenu termina"
                    color="primary"
                    @click="onCloseTermin"
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- ovdje će se raditi s nastavnicima na svim edukacijama-->
        <div class="q-pa-md">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section class="row justify-between">
              <div>
                <q-btn
                  color="primary"
                  label="Pregled svih nastavnika"
                  @click="promijeniPrikazNastavnika"
                />
              </div>
              <div>
                <q-btn color="primary" label="Novi nastavnik" @click="onAddRowNastavnici" />
                <q-btn
                  v-if="RIWA_Nastavnik.length !== 0"
                  class="q-ml-sm"
                  color="primary"
                  label="Izmijeni podatke o nastavniku"
                  @click="onEditRowNastavnici"
                />
                <q-btn
                  v-if="RIWA_Nastavnik.length !== 0"
                  class="q-ml-sm"
                  color="red"
                  label="Obriši nastavnika s popisa"
                  @click="onDeleteRowNastavnici"
                />
              </div>
            </q-card-section>
            <q-card-section v-if="showNastavnici">
              <q-table
                title="Nastavnici"
                :rows="nastavnici"
                :columns="columnsNastavnici"
                row-key="idNastavnika"
                flat
                selection="single"
                v-model:selected="RIWA_Nastavnik"
                @update:selected="onSelectionRowNastavnici"
              />
            </q-card-section>
          </q-card>
        </div>
        <!--<div class="q-pa-md">{{ RIWA_Nastavnik }}</div>-->

        <div class="q-pa-md" v-if="showFormNastavnici">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-form @submit="onSaveNastavnici">
                <q-input
                  filled
                  v-model="urediNastavnika.titulaNastavnika"
                  label="Titula nastavnika"
                />
                <q-input
                  filled
                  v-model="urediNastavnika.imeIPrezimeNastavnika"
                  label="Ime i prezime nastavnika"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Unesite podatke o nastavniku: ime i prezime',
                  ]"
                />
                <div>
                  <q-btn label="Spremi podatke o nastavniku" type="submit" color="primary" />
                  <q-btn
                    label="Zatvori mogućnost unosa i izmjene podataka o nastavniku"
                    color="primary"
                    @click="onCloseNastavnici"
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- ovdje će Administrator raditi s polaznicima na svim edukacijama-->
        <div class="q-pa-md">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section class="row justify-between">
              <div>
                <q-btn
                  color="primary"
                  label="Pregled polaznika"
                  @click="promijeniPrikazPolaznika"
                />
              </div>
              <div>
                <q-btn color="primary" label="Novi polaznik" @click="onAddRowPolaznici" />
                <q-btn
                  v-if="RIWA_Polaznik.length !== 0"
                  class="q-ml-sm"
                  color="primary"
                  label="Izmijeni polaznika"
                  @click="onEditRowPolaznici"
                />
                <q-btn
                  v-if="RIWA_Polaznik.length !== 0"
                  class="q-ml-sm"
                  color="red"
                  label="Obriši polaznika"
                  @click="onDeleteRowPolaznici"
                />
              </div>
            </q-card-section>
            <q-card-section v-if="showPolaznici">
              <q-table
                title="Polaznici"
                :rows="polaznici"
                :columns="columnsPolaznici"
                row-key="idPolaznika"
                flat
                selection="single"
                v-model:selected="RIWA_Polaznik"
                @update:selected="onSelectionRowPolaznici"
              />
            </q-card-section>
          </q-card>
        </div>
        <!--<div class="q-pa-md">{{ RIWA_Polaznik }}</div>-->

        <div class="q-pa-md" v-if="showFormPolaznici">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-form @submit="onSavePolaznici">
                <q-input
                  filled
                  v-model="urediPolaznika.imeIPrezimePolaznika"
                  label="Podaci o polazniku: ime i prezime"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Unesite ime i prezime polaznika']"
                />
                <div>
                  <q-btn label="Spremi polaznika" type="submit" color="primary" />
                  <q-btn
                    label="Zatvori unos i izmjenu podataka o polazniku"
                    color="primary"
                    @click="onClosePolaznici"
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'

defineOptions({
  name: 'AdministratorPage',
})

// Definicija stupaca za q-table
const columnsEdukacije = [
  {
    name: 'nazivEdukacije',
    required: true,
    label: 'Naziv edukacije',
    align: 'left',
    field: 'nazivEdukacije',
    sortable: true,
  },
]

const columnsTermini = [
  {
    name: 'termin',
    required: true,
    label: 'Termin',
    align: 'left',
    field: 'termin',
    //sortable: true
  },
]

const columnsNastavnici = [
  {
    name: 'titulaNastavnika',
    label: 'Titula nastavnika',
    align: 'left',
    field: 'titulaNastavnika',
  },
  {
    name: 'imeIPrezimeNastavnika',
    required: true,
    label: 'Ime i prezime nastavnika',
    align: 'left',
    field: 'imeIPrezimeNastavnika',
    sortable: true,
  },
]

const columnsPolaznici = [
  {
    name: 'polaznik',
    required: true,
    label: 'Ime i prezime polaznika',
    align: 'left',
    field: 'imeIPrezimePolaznika',
    sortable: true,
  },
]

const edukacije = ref([])
const RIWA_Edukacija = ref([])
const urediEdukaciju = ref({})
const showFormEdukacije = ref(false)
const showEdukacije = ref(false)

const termini = ref([])
const RIWA_Termin = ref([])
const urediTermin = ref({})
const showFormTermini = ref(false)
const showTermini = ref(false)

const nastavnici = ref([])
const RIWA_Nastavnik = ref([])
const urediNastavnika = ref({})
const showFormNastavnici = ref(false)
const showNastavnici = ref(false)

const polaznici = ref([])
const RIWA_Polaznik = ref([])
const urediPolaznika = ref({})
const showFormPolaznici = ref(false)
const showPolaznici = ref(false)

const showEvidencije = ref(false)
const evidencijaPrikazana = ref(false) // Dodano
const odabranaEdukacija = ref(null)
const odabraniTermin = ref(null) // Dodano
const evidencija = ref([])

const promijeniPrikazEvidencija = () => {
  showEvidencije.value = !showEvidencije.value
}

const promijeniPrikazEdukacija = () => {
  showEdukacije.value = !showEdukacije.value
}

const promijeniPrikazTermina = () => {
  showTermini.value = !showTermini.value
}

const promijeniPrikazNastavnika = () => {
  showNastavnici.value = !showNastavnici.value
}

const promijeniPrikazPolaznika = () => {
  showPolaznici.value = !showPolaznici.value
}

const dohvatiTermine = async () => {
  try {
    const response = await api.get('/termini') // Ispravljen URL
    termini.value = response.data
  } catch (error) {
    console.error('Pogreška dohvaćanja termina:', error)
  }
}

const provjeriEvidenciju = async () => {
  try {
    if (!odabranaEdukacija.value || !odabraniTermin.value) {
      alert('Molimo odaberite edukaciju i termin.')
      return
    }
    // Provjerite jesu li odabranaEdukacija i odabraniTermin objekti i pristupite njihovim ID-ovima
    const edukacijaId = odabranaEdukacija.value.idEdukacije || odabranaEdukacija.value
    const terminId = odabraniTermin.value.idTermina || odabraniTermin.value

    console.log('Provjera evidencije za edukaciju:', edukacijaId, 'i termin:', terminId)
    const response = await api.get(`/evidencija/${edukacijaId}/${terminId}`)
    evidencija.value = response.data
    console.log('Dohvaćena evidencija:', evidencija.value)
    if (evidencija.value.length === 0) {
      alert('Odabrana edukacija nije održana u odabranom terminu.')
    } else {
      evidencijaPrikazana.value = true
    }
  } catch (error) {
    console.error('Pogreška provjere evidencije:', error)
    alert('Došlo je do pogreške pri dohvaćanju evidencije.')
  }
}

// Filtrirajte polaznike koji nisu null
const filtriraniPolaznici = computed(() => {
  return evidencija.value.filter((polaznik) => polaznik.imeIPrezimePolaznika)
})

// ovo je za rad administratora s edukacijama
const onReadEdukacije = async () => {
  try {
    const sveIzEdukacija = await api.get('/Administrator_Edukacija')
    edukacije.value = sveIzEdukacija.data
    RIWA_Edukacija.value = []
    showFormEdukacije.value = false
  } catch (error) {
    console.error(error)
  }
}

const onDeleteRowEdukacija = async () => {
  try {
    const sveIzEdukacija = await api.delete('/Administrator_Edukacija', {
      data: {
        idEdukacije: RIWA_Edukacija.value[0].idEdukacije,
      },
    })
    onReadEdukacije()
    RIWA_Edukacija.value = []
    console.log('Novi zapis:', sveIzEdukacija.data)
  } catch (error) {
    console.error(error)
  }
}

const onAddRowEdukacije = () => {
  RIWA_Edukacija.value = []
  urediEdukaciju.value.idEdukacije = null
  urediEdukaciju.value.nazivEdukacije = null
  showFormEdukacije.value = true
}

const onEditRowEdukacije = () => {
  urediEdukaciju.value = Object.assign({}, RIWA_Edukacija.value[0])
  showFormEdukacije.value = true
}

const onCloseEdukacije = () => {
  urediEdukaciju.value.idEdukacije = null
  urediEdukaciju.value.nazivEdukacije = null
  showFormEdukacije.value = false
}

const onSelectionRowEdukacije = () => {
  urediEdukaciju.value.idEdukacije = null
  urediEdukaciju.value.nazivEdukacije = null
  showFormEdukacije.value = false
}

const onSaveEdukacije = async () => {
  try {
    if (urediEdukaciju.value.idEdukacije === null) {
      await api.post('/Administrator_Edukacija', urediEdukaciju.value)
    } else {
      await api.put('/Administrator_Edukacija', urediEdukaciju.value)
    }
    onReadEdukacije()
  } catch (error) {
    console.error(error)
  }
}

// ovo je za rad administratora s terminima
const onReadTermini = async () => {
  try {
    const sveIzTermina = await api.get('/Administrator_Termin')
    termini.value = sveIzTermina.data
    RIWA_Termin.value = []
    showFormTermini.value = false
  } catch (error) {
    console.error(error)
  }
}

const onDeleteRowTermini = async () => {
  try {
    const sveIzTermina = await api.delete('/Administrator_Termin', {
      data: {
        idTermina: RIWA_Termin.value[0].idTermina,
      },
    })
    onReadTermini()
    RIWA_Termin.value = []
    console.log('Novi zapis:', sveIzTermina.data)
  } catch (error) {
    console.error(error)
  }
}

const onAddRowTermini = () => {
  RIWA_Termin.value = []
  urediTermin.value.idTermina = null
  urediTermin.value.termin = null
  showFormTermini.value = true
  console.log('Stanje termina nakon dodavanja:', termini.value)
}

const onEditRowTermini = () => {
  urediTermin.value = Object.assign({}, RIWA_Termin.value[0])
  showFormTermini.value = true
  console.log('Stanje termina nakon dodavanja:', termini.value)
}

const onCloseTermin = () => {
  urediTermin.value.idTermina = null
  urediTermin.value.termin = null
  showFormTermini.value = false
}

const onSelectionRowTermini = () => {
  urediTermin.value.idTermina = null
  urediTermin.value.termin = null
  showFormTermini.value = false
}

const onSaveTermini = async () => {
  try {
    if (urediTermin.value.idTermina === null) {
      await api.post('/Administrator_Termin', urediTermin.value)
    } else {
      await api.put('/Administrator_Termin', urediTermin.value)
    }
    onReadTermini()
  } catch (error) {
    console.error(error)
  }
}

// ovo je za rad administratora s nastavnicima
const onReadNastavnici = async () => {
  try {
    const sveIzNastavnika = await api.get('/Administrator_Nastavnik')
    nastavnici.value = sveIzNastavnika.data
    RIWA_Nastavnik.value = []
    showFormNastavnici.value = false
  } catch (error) {
    console.error(error)
  }
}

const onDeleteRowNastavnici = async () => {
  try {
    const sveIzNastavnika = await api.delete('/Administrator_Nastavnik', {
      data: {
        idNastavnika: RIWA_Nastavnik.value[0].idNastavnika,
      },
    })
    onReadNastavnici()
    RIWA_Nastavnik.value = []
    console.log('Novi zapis:', sveIzNastavnika.data)
  } catch (error) {
    console.error(error)
  }
}

const onAddRowNastavnici = () => {
  RIWA_Nastavnik.value = []
  urediNastavnika.value.idNastavnika = null
  urediNastavnika.value.titulaNastavnika = null
  urediNastavnika.value.imeIPrezimeNastavnika = null
  showFormNastavnici.value = true
  console.log('Stanje nastavnika nakon dodavanja:', nastavnici.value)
}

const onEditRowNastavnici = () => {
  urediNastavnika.value = Object.assign({}, RIWA_Nastavnik.value[0])
  showFormNastavnici.value = true
  console.log('Stanje nastavnika nakon dodavanja:', nastavnici.value)
}

const onCloseNastavnici = () => {
  urediNastavnika.value.idNastavnika = null
  urediNastavnika.value.titulaNastavnika = null
  urediNastavnika.value.imeIPrezimeNastavnika = null
  showFormNastavnici.value = false
}

const onSelectionRowNastavnici = () => {
  urediNastavnika.value.idNastavnika = null
  urediNastavnika.value.titulaNastavnika = null
  urediNastavnika.value.imeIPrezimeNastavnika = null
  showFormTermini.value = false
}

const onSaveNastavnici = async () => {
  try {
    if (urediNastavnika.value.idNastavnika === null) {
      await api.post('/Administrator_Nastavnik', urediNastavnika.value)
    } else {
      await api.put('/Administrator_Nastavnik', urediNastavnika.value)
    }
    onReadNastavnici()
  } catch (error) {
    console.error(error)
  }
}

// ovo je za rad administratora s podaciam o polaznicima
const onReadPolaznici = async () => {
  try {
    const sveIzPolaznika = await api.get('/Administrator_Polaznik')
    polaznici.value = sveIzPolaznika.data
    RIWA_Polaznik.value = []
    showFormPolaznici.value = false
  } catch (error) {
    console.error(error)
  }
}

const onDeleteRowPolaznici = async () => {
  try {
    const sveIzPolaznika = await api.delete('/Administrator_Polaznik', {
      data: {
        idPolaznika: RIWA_Polaznik.value[0].idPolaznika,
      },
    })
    onReadPolaznici()
    RIWA_Polaznik.value = []
    console.log('Novi zapis:', sveIzPolaznika.data)
  } catch (error) {
    console.error(error)
  }
}

const onAddRowPolaznici = () => {
  RIWA_Polaznik.value = []
  urediPolaznika.value.idPolaznika = null
  urediPolaznika.value.imeIPrezimePolaznika = null
  showFormPolaznici.value = true
  console.log('Stanje podataka o polaznicima nakon dodavanja:', polaznici.value)
}

const onEditRowPolaznici = () => {
  urediPolaznika.value = Object.assign({}, RIWA_Polaznik.value[0])
  showFormPolaznici.value = true
  console.log('Stanje podataka o polaznicima nakon dodavanja:', polaznici.value)
}

const onClosePolaznici = () => {
  urediPolaznika.value.idPolaznika = null
  urediPolaznika.value.imeIPrezimePolaznika = null
  showFormPolaznici.value = false
}

const onSelectionRowPolaznici = () => {
  urediPolaznika.value.idPolaznika = null
  urediPolaznika.value.imeIPrezimePolaznika = null
  showFormPolaznici.value = false
}

const onSavePolaznici = async () => {
  try {
    if (urediPolaznika.value.idPolaznika === null) {
      await api.post('/Administrator_Polaznik', urediPolaznika.value)
    } else {
      await api.put('/Administrator_Polaznik', urediPolaznika.value)
    }
    onReadPolaznici()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  onReadEdukacije()
  onReadTermini()
  onReadNastavnici()
  onReadPolaznici()
  dohvatiTermine()
})
</script>
