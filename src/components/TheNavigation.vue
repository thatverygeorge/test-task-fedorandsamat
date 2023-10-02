<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation';
import { useFilterStore } from '@/stores/filter';
import NavigationItem from '@/components/NavigationItem.vue';

const navigationStore = useNavigationStore();
const filterStore = useFilterStore();
</script>

<template>
  <nav aria-label="main">
    <ul v-if="!filterStore.filter && navigationStore.navigation">
      <NavigationItem
        v-for="root in navigationStore.navigation.rootLevelKeys"
        :page="navigationStore.navigation.pages[root]"
        :key="root"
      />
    </ul>
    <ul v-else-if="filterStore.filteredNavigation.length">
      <RouterLink
        v-for="page in filterStore.filteredNavigation"
        :to="{ name: 'page', params: { slug: page.link } }"
        :key="page.key"
      >
        {{ page.name.toLowerCase() }}
      </RouterLink>
    </ul>
    <p v-else>nothing to show yet</p>
  </nav>
</template>

<style scoped>
nav {
  height: 100%;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.25rem;
}

p {
  font-size: 1.25rem;
}
</style>
