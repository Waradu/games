<template>
  <div class="flex size-full items-center justify-center flex-col gap-12">
    <div class="relative">
      <div
        class="aspect-[12/7] w-48 [image-rendering:pixelated]"
        :style="{
          mask: `url(${backgroundColor}) no-repeat center / contain`,
          '-webkit-mask': `url(${backgroundColor}) no-repeat center / contain`,
          backgroundColor: color,
        }"
      />
      <div
        class="absolute top-0 aspect-[12/7] w-48 [image-rendering:pixelated]"
        :style="{
          mask: `url(${background}) no-repeat center / contain`,
          '-webkit-mask': `url(${background}) no-repeat center / contain`,
          backgroundColor: colorAlt,
        }"
      />
      <div
        class="absolute top-0 aspect-[12/7] w-48 bg-cover bg-no-repeat [image-rendering:pixelated]"
        :style="{
          backgroundImage: `url(${overlay})`,
        }"
      />
      <div
        class="absolute top-0 aspect-[12/7] w-48 bg-cover bg-no-repeat [image-rendering:pixelated] hover:invert"
        :style="{
          backgroundImage: `url(${outline})`,
        }"
      />
    </div>
    <div class="flex w-48 flex-col items-start gap-2">
      <input v-model="color" type="color" />
      <input v-model="colorAlt" type="color" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import outline from "~/assets/general/chip/outline.png";
import background from "~/assets/general/chip/background.png";
import backgroundColor from "~/assets/general/chip/backgroundColor.png";
import overlay from "~/assets/general/chip/overlay.png";

const color = ref("#6666ff");
const colorAlt = ref("#ffffff");
</script>
