<script setup lang="ts"></script>

<template>
  <footer>
    <span>
      made by
      <a href="https://github.com/thatverygeorge" target="_blank" rel="noopener noreferrer">
        @thatverygeorge
      </a>
    </span>
  </footer>
</template>

<style scoped>
footer {
  flex-shrink: 0;
  min-height: 85px;
  max-height: 135px;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  align-items: center;
  border-top: 2px solid var(--orange);
}

span {
  font-size: 1.5rem;
  text-align: end;
}

a {
  color: var(--orange);
}
</style>
