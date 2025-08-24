<template>
  <div class="size-full p-12">
    <div class="w-max rounded-full p-1" :style="{ backgroundColor: color }">
      <div class="relative">
        <CharacterSprite :size="size" :index="base" :layer="0" />
        <CharacterSprite
          v-if="beard"
          class="absolute top-0"
          :size="size"
          :index="base"
          :layer="1"
        />
        <CharacterSprite
          class="absolute top-0"
          :size="size"
          :index="eyes"
          :layer="2"
        />
        <CharacterSprite
          class="absolute top-0"
          :size="size"
          :index="hat"
          :layer="3"
        />
      </div>
    </div>
    <div class="flex w-48 flex-col items-start gap-2">
      <input v-model="base" type="range" min="0" max="4" step="1" />
      <input v-model="eyes" type="range" min="0" max="4" step="1" />
      <input v-model="hat" type="range" min="0" max="4" step="1" />
      <input v-model="beard" type="checkbox" />
      <input v-model="color" type="color" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const size = ref(12);
const base = ref(0);
const eyes = ref(0);
const hat = ref(0);
const beard = ref(false);
const color = ref("#ffffff");
</script>
