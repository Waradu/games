<script setup lang="ts">
import { LucideArrowLeft } from "lucide-vue-next";
</script>

<template>
  <div
    class="fixed top-0 right-0 left-0 z-5 flex h-16 justify-between gap-2 border-b border-neutral-800 bg-neutral-900 p-3"
  >
    <div class="flex items-center gap-2">
      <NuxtLink to="/" class="flex size-10 items-center justify-center">
        <LucideArrowLeft class="size-5" />
      </NuxtLink>
      <slot />
    </div>
    <div class="size-10 rounded-full bg-neutral-600"></div>
  </div>
</template>
