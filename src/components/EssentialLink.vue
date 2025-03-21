<template>
  <q-item clickable @click="handleClick" :to="props.route" tag="router-link">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'EssentialLink',
})

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  route: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },

  action: {
    type: Function, // Ovdje dodajemo podršku za funkciju
    default: null,
  },

  onClick: { type: Function, default: null },
})

const handleClick = () => {
  if (props.onClick) {
    props.onClick() // Ako postoji `onClick`, pokreni ga
  }
}
</script>
