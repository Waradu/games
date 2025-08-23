<script setup lang="ts">
import { LucideLayoutGrid, type LucideProps } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";

useHead({
  title: "Home",
});

interface Game {
  name: string;
  icon: FunctionalComponent<LucideProps, {}, any, {}>;
  href: string;
}

const games: Game[] = [
  {
    name: "Wordle",
    icon: LucideLayoutGrid,
    href: "/wordle",
  },
];
</script>

<template>
  <div
    class="flex h-max min-h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900 select-none"
  >
    <NuxtLink
      v-for="game in games"
      :key="game.name"
      class="flex items-center gap-4 rounded-md bg-neutral-800 p-2 px-4 text-neutral-200 transition hover:bg-neutral-700 hover:text-white active:bg-neutral-700 active:text-white"
      :to="game.href"
    >
      <component :is="game.icon" class="size-5" />
      <span class="text-xl">{{ game.name }}</span>
    </NuxtLink>
  </div>
</template>
