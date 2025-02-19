<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="q-pa-md">
          <q-table
            title="Edukacije"
            :rows="edukacije"
            :columns="columns"
            row-key="idEdukacije"
            flat
            selection="single"
            v-model:selected="RIWA_Edukacija"
            @update:selected="onSelectionRow"
          >
            <template v-slot:top>
              <q-btn color="primary" label="Pregledaj ponuđene edukacije" @click="onRead" />
              <q-space />
              <q-btn color="primary" label="Nova edukacija" @click="onAddRow" />
              <q-btn
                v-if="RIWA_Edukacija.length !== 0"
                class="q-ml-sm"
                color="primary"
                label="Izmijeni edukaciju"
                @click="onEditRow"
              />
              <q-btn
                v-if="RIWA_Edukacija.length !== 0"
                class="q-ml-sm"
                color="red"
                label="Obriši edukaciju"
                @click="onDeleteRow"
              />
            </template>
          </q-table>
        </div>
        <!-- Ako želite prikazati selektirane podatke za debug, odkomentirajte sljedeće -->
        <div class="q-pa-md">{{ RIWA_Edukacija }}</div>
        <div class="q-pa-md" v-if="showForm">
          <q-card flat bordered class="q-pa-sm">
            <q-card-section>
              <q-form @submit="onSave">
                <q-input
                  filled
                  v-model="urediEdukaciju.nazivEdukacije"
                  label="Naziv edukacije"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Unesite naziv edukacije']"
                />
                <div>
                  <q-btn label="Spremi" type="submit" color="primary" />
                  <q-btn label="Zatvori" color="primary" @click="onClose" class="q-ml-sm" />
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
const columns = [
  {
    name: 'nazivEdukacije',
    required: true,
    label: 'Naziv edukacije',
    align: 'left',
    field: 'nazivEdukacije',
    sortable: true,
  },
]

const edukacije = ref([])
const RIWA_Edukacija = ref([])
const urediEdukaciju = ref({})
const showForm = ref(false)

const onRead = async () => {
  try {
    const sveIzEdukacija = await api.get('/RIWA_Edukacija')
    edukacije.value = sveIzEdukacija.data
    RIWA_Edukacija.value = []
    showForm.value = false
  } catch (error) {
    console.error(error)
  }
}

const onDeleteRow = async () => {
  try {
    const sveIzEdukacija = await api.delete('/RIWA_Edukacija', {
      data: {
        idEdukacije: RIWA_Edukacija.value[0].idEdukacije,
      },
    })
    onRead()
    RIWA_Edukacija.value = []
    console.log('Novi zapis:', sveIzEdukacija.data)
  } catch (error) {
    console.error(error)
  }
}

const onAddRow = () => {
  RIWA_Edukacija.value = []
  urediEdukaciju.value.idEdukacije = null
  urediEdukaciju.value.nazivEdukacije = null
  showForm.value = true
}

const onEditRow = () => {
  urediEdukaciju.value = Object.assign({}, RIWA_Edukacija.value[0])
  showForm.value = true
}

const onClose = () => {
  urediEdukaciju.value.idEdukacije = null
  urediEdukaciju.value.nazivEdukacije = null
  showForm.value = false
}

const onSelectionRow = () => {
  urediEdukaciju.value.idEdukacije = null
  urediEdukaciju.value.nazivEdukacije = null
  showForm.value = false
}

const onSave = async () => {
  try {
    if (urediEdukaciju.value.idEdukacije === null) {
      await api.post('/RIWA_Edukacija', urediEdukaciju.value)
    } else {
      await api.put('/RIWA_Edukacija', urediEdukaciju.value)
    }
    onRead()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  onRead()
})
</script>
