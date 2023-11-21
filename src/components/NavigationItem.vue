<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation';
import { RouterLink } from 'vue-router';
import type { Page } from '@/types';

const props = defineProps<{
  page: Page | undefined;
}>();
const navigationStore = useNavigationStore();
</script>

<template>
  <template v-if="props.page">
    <li v-if="!props.page.childPageKeys">
      <RouterLink :to="{ name: 'page', params: { slug: props.page.link } }">
        {{ props.page.name.toLowerCase() }}
      </RouterLink>
    </li>
    <li v-else>
      <button
        class="button"
        type="button"
        :aria-expanded="props.page.isOpen"
        :aria-controls="`id_${props.page.key}_menu`"
        :aria-label="`expand ${props.page.name.toLowerCase()} menu`"
        @click="navigationStore.toggleItem(props.page.key)"
      >
        <span aria-hidden="true">▶</span>
      </button>
      <RouterLink :to="{ name: 'page', params: { slug: props.page.link } }">
        {{ props.page.name.toLowerCase() }}
      </RouterLink>
      <ul :id="`id_${props.page.key}_menu`">
        <NavigationItem
          v-for="child in props.page.childPageKeys"
          :page="navigationStore.getPage('key', child)"
          :key="child"
        />
      </ul>
    </li>
  </template>
</template>

<style scoped>
li {
  position: relative;
  padding-left: 2.5rem;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  grid-column: 1 / -1;
}

button {
  width: 2rem;
  height: 2rem;
  border: none;
  padding: 0;
  position: absolute;
  top: -2px;
  left: 0;
}

button[aria-expanded='true'] {
  rotate: 90deg;
}

button[aria-expanded='false'] ~ ul {
  display: none;
}
</style>
