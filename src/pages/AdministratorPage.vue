<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="q-pa-md">
          <!-- ovdje će se upravljati edukacijama-->
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-table
                title="Edukacije"
                :rows="edukacije"
                :columns="columnsEdukacije"
                row-key="idEdukacije"
                flat
                selection="single"
                v-model:selected="RIWA_Edukacija"
                @update:selected="onSelectionRowEdukacije"
              >
                <template v-slot:top>
                  <q-btn
                    color="primary"
                    label="Pregledaj ponuđene edukacije"
                    @click="onReadEdukacije"
                  />
                  <q-space />
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
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>

        <!-- ovdje će se raditi s terminima na svim edukacijama-->

        <div>
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-table
                title="Termini"
                :rows="termini"
                :columns="columnsTermini"
                row-key="idTermina"
                flat
                selection="single"
                v-model:selected="RIWA_Termin"
                @update:selected="onSelectionRowTermini"
              >
                <template v-slot:top>
                  <q-btn color="primary" label="Pregledaj termine" @click="onReadTermini" />
                  <q-space />
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
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>

        <!-- Ako želite prikazati selektirane podatke za debug, odkomentirajte sljedeće -->
        <div class="q-pa-md">{{ RIWA_Edukacija }}</div>
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
                    label="Zatvori popis edukacija"
                    color="primary"
                    @click="onCloseEdukacije"
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

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
                    label="Zatvori unos termina"
                    color="primary"
                    @click="onCloseTermin"
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
import { ref, onMounted } from 'vue'
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
const edukacije = ref([])
const RIWA_Edukacija = ref([])
const urediEdukaciju = ref({})
const showFormEdukacije = ref(false)

const termini = ref([])
const RIWA_Termin = ref([])
const urediTermin = ref({})
const showFormTermini = ref(false)

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

onMounted(() => {
  onReadEdukacije()
  onReadTermini()
})
</script>
