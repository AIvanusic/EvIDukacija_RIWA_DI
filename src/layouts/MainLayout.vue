<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-header">
      <q-toolbar>
        <!-- Verzija aplikacije u gornjem lijevom kutu -->
        <div>v{{ $q.version }}</div>

        <!-- Poravnanje naslova alatne trake desno -->
        <q-toolbar-title class="q-ml-auto"> mEvIDukacija </q-toolbar-title>

        <!-- Hamburger menu u gornjem desnom kutu -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleRightDrawer"
          class="menu-icon"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" show-if-above bordered>
      <q-list>
        <q-item-label header> mEvIDukacija </q-item-label>

        <!-- <q-item-label header> Molimo, odaberite u kojoj ulozi pristupate. </q-item-label>-->

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const linksList = [
  {
    title: 'Voditelj/ica projekta / Administrator/ica',
    caption: 'Sve pod kontrolom ;)',
    icon: 'school',
    route: '/administrator',
  },
  {
    title: 'Nastavnica/Nastavnik',
    caption: 'Kvalificirani i stručni, spremni dijeliti svoje znanje',
    icon: 'work',
    route: '/nastavnik',
  },
  {
    title: 'Polaznica/Polaznik edukacije',
    caption: 'Dođoh, vidjeh, naučih!',
    icon: 'person',
    route: '/polaznik',
  },
  {
    title: 'Postavke',
    caption: 'Tu je sve po mom!',
    icon: 'settings',
    route: '/postavke', // Ažurirani link na odgovarajuću stranicu unutar aplikacije
  },
  {
    title: 'Kontakt',
    caption: 'Kako do nas?',
    icon: 'rss_feed',
    route: '/kontakt', // Ažurirajte link na odgovarajuću stranicu unutar aplikacije
  },
  {
    title: 'Podijeli',
    caption: 'Podijelite ovu aplikaciju',
    icon: 'share',
    onClick: shareApp, // POZIVAMO shareApp FUNKCIJU
  },
]

const rightDrawerOpen = ref(false)

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

//function shareApp() {
//const shareUrl = 'https://www.veleri.hr'

//if (navigator.share) {
//navigator
//.share({
//title: 'Podijeli aplikaciju',
//text: 'Pogledaj ovu aplikaciju!',
//url: shareUrl,
//})
//.catch((error) => console.log('Greška pri dijeljenju:', error))
//} else if (window.cordova && window.cordova.InAppBrowser) {
//window.cordova.InAppBrowser.open(shareUrl, '_system')
//} else {
//window.open(shareUrl, '_blank')
//}
//}
function shareApp() {
  const shareUrl = 'https://www.veleri.hr'

  if (window.cordova && window.cordova.InAppBrowser) {
    window.cordova.InAppBrowser.open(shareUrl, '_system')
  } else {
    window.open(shareUrl, '_blank')
  }
}
</script>

<style>
.custom-header {
  background-color: #346c69;
  color: white;
}

.q-btn--flat {
  color: #346c69;
}

.q-item--clickable:hover {
  background-color: rgba(52, 108, 105, 0.1);
}

.q-item--clickable:active {
  background-color: rgba(52, 108, 105, 0.2);
}

.menu-icon {
  color: white;
}

/* Stilovi za odabrane stavke u meniju */
.q-item--active .q-item-label,
.q-item--active .q-icon {
  color: #346c69 !important;
}

/* Dodajte dodatne stilove po potrebi */
.text-turquoise {
  color: #346c69 !important;
}
</style>
