<template>
  <component
    :is="asComp"
    :to="link"
    class="flex h-10 min-w-10 items-center gap-2 overflow-hidden rounded-xl bg-neutral-700 p-3 text-sm text-neutral-200 transition-colors hover:bg-neutral-600 hover:text-neutral-200 active:bg-neutral-600 active:text-neutral-200"
  >
    <slot />
    <component :is="icon" v-if="icon" class="size-4" />
  </component>
</template>

<script lang="ts" setup>
import type { LucideIcon } from "lucide-vue-next";

const props = defineProps<{
  icon?: LucideIcon;
  link?: string;
}>();

const asComp = computed(() =>
  props.link ? resolveComponent("NuxtLink") : "button",
);
</script>
