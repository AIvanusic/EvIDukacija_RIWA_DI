<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md flex column items-center">
        <!--u koraku 1 odabire se polaznik-->
        <div v-if="korak === 1">
          <h3>Odaberite svoje ime i prezime</h3>

          <q-select
            v-model="odabraniPolaznik"
            :options="polaznici"
            option-value="idPolaznika"
            option-label="imeIPrezimePolaznika"
            label="Molim, kliknite kako biste odabrali svoje ime i prezime"
            filled
            class="q-mb-md"
          />
          <p v-if="odabraniPolaznik">
            Dobar Vam dan, {{ odabraniPolaznik.imeIPrezimePolaznika }}. Dalje, molim Vas, odaberite
            kojoj ste edukaciji prisustvovali.
          </p>
          <q-btn v-if="odabraniPolaznik" @click="sljedeciKorak" color="purple" label="Nastavite!" />
        </div>

        <!--u koraku 2 odabire se edukacija-->
        <div v-if="korak === 2">
          <h3>Odaberite edukaciju.</h3>

          <q-select
            v-model="odabranaEdukacija"
            :options="edukacija"
            option-value="idEdukacije"
            option-label="nazivEdukacije"
            label="Kliknite za prikaz popisa održanih edukacija"
            filled
            class="q-mb-md"
          />
          <p v-if="odabranaEdukacija">
            Zahvaljujemo. Dalje, molim Vas, odaberite u kojem ste terminu ili terminima
            prisustvovali edukaciji "{{ odabranaEdukacija.nazivEdukacije }}".
          </p>
          <q-btn
            v-if="odabranaEdukacija"
            @click="sljedeciKorak"
            color="purple"
            label="Nastavite!"
          />
        </div>

        <!-- u koraku 3 odabire se termin-->
        <div v-if="korak === 3">
          <h3>Odaberite između ponuđenih termina.</h3>

          <q-select
            v-model="odabraniTermin"
            :options="termin"
            option-value="idTermina"
            option-label="termin"
            label="Kliknite za prikaz popisa termina u kojima se održavala edukacija"
            filled
            class="q-mb-md"
          />
          <p v-if="tekstPolaznik">{{ tekstPolaznik }}</p>
          <p v-if="tekstEdukacija">{{ tekstEdukacija }}</p>
          <p v-if="odabraniTermin">
            Zahvaljujemo. Zabilježit će se da ste edukaciji prisustvovali u terminu "{{
              odabraniTermin.termin
            }}".
          </p>
          <q-btn
            v-if="odabraniTermin"
            @click="spremiEvidenciju"
            color="green"
            label="Prihvati unos!"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const korak = ref(1)

const tekstPolaznik = ref('')
const tekstEdukacija = ref('')

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

const sljedeciKorak = () => {
  if (korak.value === 1) {
    tekstPolaznik.value = `Dobar Vam dan, ${odabraniPolaznik.value.imeIPrezimePolaznika}. Sada, molim Vas, odaberite edkukaciju kojoj ste prisustvovali.`
    dohvatiEdukacije()
  } else if (korak.value === 2) {
    tekstEdukacija.value = `Zahvaljujemo. Sada, molim Vas, odaberite u kojem ste terminu ili terminima prisustvovali edukaciji "${odabranaEdukacija.value.nazivEdukacije}".`
    dohvatiTermine()
  }
  korak.value++
}

// Kada korisnik potvrdi odabir, sprema se evidencija
const spremiEvidenciju = async () => {
  try {
    await axios.post('http://localhost:3000/api/evidencija', {
      polaznikId: odabraniPolaznik.value.idPolaznika,
      edukacijaId: odabranaEdukacija.value.idEdukacije,
      terminId: odabraniTermin.value.idTermina,
    })
    alert('Evidencija uspješno spremljena!')
    korak.value = 1 // Resetiraj formu
  } catch (error) {
    console.error('Greška pri spremanju evidencije:', error)
  }
}

// Automatski dohvaća polaznike kad se stranica učita
onMounted(dohvatiPolaznike)
</script>
