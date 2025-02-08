<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleRightDrawer" />

        <q-toolbar-title> EvIDukacija </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" show-if-above bordered>
      <q-list>
        <q-item-label header> Molimo, odaberite u kojoj ulozi pristupate. </q-item-label>

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
    //link: 'https://github.com/quasarframework',
  },
  {
    title: 'Polaznica/Polaznik edukacije',
    caption: 'Dođoh, vidjeh, naučih!',
    icon: 'person',
    route: '/polaznik',
    //link: 'https://chat.quasar.dev',
  },
]

const rightDrawerOpen = ref(false)

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
