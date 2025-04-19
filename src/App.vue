<template>
  <router-view />
</template>

<script>
export default {
  mounted() {
    window.addEventListener('keydown', this.otvoriPomoc)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.otvoriPomoc)
  },
  methods: {
    otvoriPomoc(e) {
      if (e.key === 'F1') {
        e.preventDefault()
        window.open('/help/EvIDukacija-Korisnicki-Prirucnik.pdf', '_blank')
      }
    },
  },
}
</script>
