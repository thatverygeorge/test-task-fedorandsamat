<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  slug: string;
}>();

const navigationStore = useNavigationStore();
const page = navigationStore.getPage('link', props.slug);

if (!page) {
  const route = useRoute();
  const router = useRouter();
  router.push({
    name: 'notFound',
    params: {
      pathMatch: route.path.split('/').slice(1),
    },
    query: route.query,
    hash: route.hash,
  });
} else {
  navigationStore.openTree(page);
}
</script>

<template>
  <section aria-labelledby="page-heading">
    <h2 id="page-heading">page: {{ slug }}</h2>

    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero pariatur in sint officiis
      minima. Vel ad ea eveniet necessitatibus illo deserunt, dolorum temporibus ipsam velit illum
      sed maxime neque nihil. Voluptas laudantium rerum animi, beatae, unde harum velit asperiores
      magnam quod sed nobis quaerat at. Sint, error! Nulla eligendi soluta magni? Accusantium optio
      architecto quae magni doloremque tempore modi itaque? Odio nesciunt labore facilis excepturi
      soluta quidem mollitia, doloribus minus aut illo hic nisi maiores architecto optio consectetur
      dignissimos iure atque reprehenderit et cupiditate reiciendis voluptas? Quam explicabo eum
      nam. Recusandae laborum tempora quas ducimus quo, quaerat et accusantium ipsam aliquid ipsum,
      illo consectetur culpa non delectus esse id optio maiores nostrum assumenda obcaecati nisi
      itaque! Iste ipsa fugit accusantium! Qui fugit accusamus repellat quisquam, in esse quasi
      laudantium aperiam repellendus veniam voluptatum nostrum quam omnis quae aut laboriosam
      aspernatur eius ea ducimus, sint ad amet. Maxime odit maiores earum? Rerum veniam, nobis
      placeat autem omnis sunt quam vel ut amet perspiciatis architecto laboriosam dicta ducimus
      voluptas sed ea aperiam vitae facilis debitis unde hic aliquid. Assumenda repellendus dolores
      ab? Provident nobis, aut debitis nemo laborum laudantium repellendus autem tempore quos vitae
      iusto accusamus consequatur earum molestiae id. Veritatis laudantium non optio deleniti
      laboriosam soluta consequuntur excepturi a id porro! Natus temporibus amet mollitia iste. Quod
      est asperiores sint. Ab voluptatum repellendus similique eaque? Numquam quasi ab voluptatem
      culpa facilis repudiandae laborum vel at facere voluptatum, sequi, blanditiis minus
      voluptates? Sint minima omnis beatae enim fugit aut consequuntur molestiae dolore sed!
      Mollitia minus cum explicabo, maxime suscipit commodi distinctio molestiae optio itaque
      corrupti! Quidem, repellendus exercitationem reprehenderit neque quasi nihil? Aperiam,
      ducimus, doloremque temporibus quaerat pariatur tempora a ex voluptatem incidunt quasi
      accusamus fuga dolor rerum labore iure quia suscipit, maiores praesentium? Delectus dolorum
      saepe nihil animi beatae sapiente repellat.
    </p>
  </section>
</template>
