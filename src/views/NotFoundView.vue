<template>
  <section aria-labelledby="not-found-heading">
    <h2 id="not-found-heading">404. not found</h2>

    <RouterLink :to="{ name: 'home' }">go home</RouterLink>
  </section>
</template>

<style scoped>
a {
  font-size: 2rem;
  color: var(--orange);
}
</style>
