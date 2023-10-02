<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheNavigation from '@/components/TheNavigation.vue';
import NavigationFilter from '@/components/NavigationFilter.vue';

const isOpen = ref<boolean>(false);
</script>

<template>
  <TheHeader />

  <main>
    <aside id="main_navigation">
      <button
        class="button"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="main_navigation"
        aria-label="expand main navigation"
        @click="isOpen = !isOpen"
      >
        <span aria-hidden="true">↧</span>
      </button>
      <div>
        <NavigationFilter />
        <TheNavigation />
      </div>
    </aside>

    <RouterView class="router-view" :key="$route.fullPath" />
  </main>

  <TheFooter />
</template>

<style>
main {
  flex-grow: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  overflow-y: auto;
}

aside {
  padding: 1rem;
  border-right: 2px solid var(--orange);
  display: grid;
  grid-template-columns: 1fr min-content;
  align-items: start;
  gap: 2rem;
  overflow-y: auto;
}

aside > div {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  order: -1;
}

aside > .button {
  display: none;
}

.router-view {
  overflow-y: auto;
  display: flex;
  gap: 5rem;
  flex-direction: column;
  align-items: center;
  padding: 5rem;
}

.router-view h2 {
  text-align: center;
  font-size: 3rem;
}

.router-view p {
  font-size: 2.5rem;
}

@media (width < 960px) {
  main {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    overflow-y: initial;
  }

  aside {
    padding: 2rem;
    border-right: none;
    border-bottom: 2px solid var(--orange);
    overflow-y: initial;
  }

  aside > div {
    grid-column: 1 / 2;
  }

  aside > .button {
    display: flex;
    grid-column: 2 / -1;
    width: 6rem;
    height: 6rem;
    font-size: 3rem;
  }

  aside > .button[aria-expanded='true'] {
    transform: rotate(180deg);
    position: sticky;
    bottom: 5rem;
    align-self: end;
  }

  aside > .button[aria-expanded='false'] + div {
    display: none;
  }

  .router-view {
    overflow-y: initial;
    padding: 1rem;
  }
}
</style>
