<template>
  <q-page class="q-pa-md">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>Dark Mode</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
            :model-value="$q.dark.isActive"
            @update:model-value="toggleDarkMode"
            color="primary"
            keep-color
          >
            <template v-slot:thumb>
              <q-icon name="dark_mode" class="dark-mode-icon" />
            </template>
          </q-toggle>
        </q-item-section>
      </q-item>

      <q-item clickable @click="changeLanguage">
        <q-item-section>
          <q-item-label>Promjena jezika</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="language" class="language-icon" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function toggleDarkMode(value) {
  $q.dark.set(value)
}

function changeLanguage() {
  // Logika za promjenu jezika
  alert('Promjena jezika nije implementirana')
}
</script>

<style>
/* Ikona unutar thumb-a mijenja boju kada je dark mode aktivan */
.dark-mode-icon {
  color: white !important;
}

.language-icon {
  color: #346c69;
}

/* Dodavanje još stilskog oblikovanja po potrebi */
</style>
