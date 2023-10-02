<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <h1>
      <RouterLink :to="{ name: 'home' }">fedorandsamat</RouterLink>
    </h1>
  </header>
</template>

<style scoped>
header {
  flex-shrink: 0;
  min-height: 85px;
  max-height: 135px;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 2px solid var(--orange);
}

h1 {
  font-size: 1.75rem;
}

a {
  color: var(--orange);
}
</style>
