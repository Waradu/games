<script setup lang="ts">
import {
  LucideLayoutGrid,
  LucideTerminal,
  type LucideProps,
} from "lucide-vue-next";
import type { FunctionalComponent } from "vue";

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
    class="bg-neutral-900 w-full min-h-full h-max flex flex-col gap-2 items-center justify-center select-none"
  >
    <NuxtLink
      class="flex gap-4 text-neutral-200 items-center bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-700 hover:text-white active:text-white transition p-2 px-4 rounded-md"
      v-for="game in games"
      :to="game.href"
    >
      <component :is="game.icon" class="size-5" />
      <span class="text-xl">{{ game.name }}</span>
    </NuxtLink>
  </div>
</template>
