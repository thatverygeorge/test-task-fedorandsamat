<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import debounce from 'lodash.debounce';

const INPUT_DELAY = 1000;

const filterStore = useFilterStore();

function handleInput(evt: Event) {
  const target = evt.target as HTMLInputElement;
  filterStore.filter = target.value;
}

const debouncedHandleInput = debounce(handleInput, INPUT_DELAY);
</script>

<template>
  <form @submit.prevent>
    <fieldset>
      <legend>filter</legend>
      <input
        :value="filterStore.filter"
        @input="debouncedHandleInput"
        id="filter"
        name="filter"
        type="text"
        autocomplete="off"
      />
      <button class="button" type="button" @click="filterStore.clear">clear</button>
    </fieldset>
  </form>
</template>

<style scoped>
fieldset {
  display: grid;
  grid-template-columns: 1fr min-content;
  align-items: start;
  gap: 1rem;
  font-size: 1.25rem;
  border: 2px solid var(--black);
  padding: 1rem;
  border-radius: 5px;
  margin: 0;
}

label {
  cursor: pointer;
}

input {
  grid-column: 1 / -1;
  width: 100%;
  min-height: 5rem;
  font-family: inherit;
  font-size: inherit;
  border: 2px solid var(--orange);
  border-radius: 5px;
  padding: 1rem;
  background-color: transparent;
}

input:focus-visible {
  border-color: var(--black);
  outline: none;
}

button {
  grid-column: 1 / -1;
  min-width: 15rem;
  min-height: 5rem;
}

@media (width < 960px) {
  input {
    grid-column: 1 / 2;
  }

  button {
    grid-column: 2 / -1;
  }
}

@media (width < 768px) {
  input {
    grid-column: 1 / -1;
  }

  button {
    grid-column: 1 / -1;
  }
}
</style>
