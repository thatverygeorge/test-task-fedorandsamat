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
      <li v-for="page in filterStore.filteredNavigation" :key="page.key">
        <RouterLink :to="{ name: 'page', params: { slug: page.link } }">
          {{ page.name.toLowerCase() }}
        </RouterLink>
      </li>
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
