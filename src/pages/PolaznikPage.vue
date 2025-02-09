<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <h2>Odaberite svoje ime i prezime</h2>

        <q-select
          v-model="odabraniPolaznik"
          :options="polaznici"
          option-value="idPolaznika"
          option-label="imeIPrezimePolaznika"
          label="Molim, odaberite svoje ime i prezime"
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

    <q-page-container>
      <q-page>
        <h2>Odaberite između ponuđenih termina.</h2>

        <q-select
          v-model="odabraniTermin"
          :options="termin"
          option-value="idTermina"
          option-label="termin"
          label="Kliknite za prikaz popisa termina u kojima se održavala edukacija"
          filled
        />

        <div v-if="odabraniTermin">
          <p>
            Zahvaljujemo. Zabilježit će se da ste edukaciji prisustvovali u terminu "{{
              odabraniTermin.termin
            }}".
          </p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const polaznici = ref([]) // popis polaznika
const odabraniPolaznik = ref(null) // odabrani polaznik

const edukacija = ref([]) // popis edukacija
const odabranaEdukacija = ref(null) // odabrana

const termin = ref([]) // popis termina
const odabraniTermin = ref(null) // odabrani termin

// Funkcija za dohvaćanje podataka iz baze putem API-ja
const dohvatiPolaznike = async () => {
  try {
    const response_polaznici = await axios.get('http://localhost:3000/api/polaznici_polaznici')
    polaznici.value = response_polaznici.data
  } catch (error) {
    console.error('Greška pri dohvaćanju polaznika:', error)
  }
}
const dohvatiEdukacije = async () => {
  try {
    const response_edukacije = await axios.get('http://localhost:3000/api/polaznici_edukacije')
    edukacija.value = response_edukacije.data
  } catch (error) {
    console.error('Greška pri dohvaćanju popisa održanih edukacija:', error)
  }
}
const dohvatiTermine = async () => {
  try {
    const response_termini = await axios.get('http://localhost:3000/api/polaznici_termini')
    termin.value = response_termini.data
  } catch (error) {
    console.error('Greška pri dohvaćanju popisa održanih edukacija:', error)
  }
}

// Dohvati podatke kad se stranica učita
onMounted(dohvatiPolaznike)
onMounted(dohvatiEdukacije)
onMounted(dohvatiTermine)
</script>
