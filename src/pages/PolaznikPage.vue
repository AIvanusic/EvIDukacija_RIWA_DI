<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <h2>Odaberite svoje ime i prezime</h2>

        <q-select
          v-model="odabraniPolaznik"
          :options="polaznici"
          option-value="idPolaznik"
          option-label="imeIPrezimePolaznika"
          label="Ime i prezime"
          filled
        />

        <div v-if="odabraniPolaznik">
          <p>
            Dobar Vam dan, {{ odabraniPolaznik.imeIPrezimePolaznika }}. Dalje, molim Vas, odaberite
            kojoj ste edukaciji prisustvovali.
          </p>
        </div>
      </q-page>
    </q-page-container>

    <q-page-container>
      <q-page>
        <h2>Odaberite edukaciju.</h2>

        <q-select
          v-model="odabranaEdukacija"
          :options="edukacija"
          option-value="idEdukacije"
          option-label="nazivEdukacije"
          label="Kliknite za prikaz popisa održanih edukacija"
          filled
        />

        <div v-if="odabranaEdukacija">
          <p>
            Zahvaljujemo. Dalje, molim Vas, odaberite u kojem ste terminu ili terminima
            prisustvovali edukaciji "{{ odabranaEdukacija.nazivEdukacije }}".
          </p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const polaznici = ref([]) // Popis polaznika
const odabraniPolaznik = ref(null) // Odabrana osoba

const edukacija = ref([]) // Popis edukacija
const odabranaEdukacija = ref(null) // Odabrana edukacija

// Funkcija za dohvaćanje podataka iz API-ja
const fetchPolaznici = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/polaznici')
    polaznici.value = response.data
  } catch (error) {
    console.error('Greška pri dohvaćanju polaznika:', error)
  }
}
const fetchEdukacija = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/polaznici')
    edukacija.value = response.data
  } catch (error) {
    console.error('Greška pri dohvaćanju polaznika:', error)
  }
}
// Dohvati podatke kad se stranica učita
onMounted(fetchPolaznici)
onMounted(fetchEdukacija)
</script>
