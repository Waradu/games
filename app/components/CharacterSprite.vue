<template>
  <div
    class="aspect-square bg-no-repeat [image-rendering:pixelated]"
    :style="{
      backgroundImage: `url(${Sprite})`,
      backgroundSize: `${sizeRem * 5}rem ${sizeRem * 4}rem`,
      backgroundPosition: `-${index * sizeRem}rem -${layer * sizeRem}rem`,
      width: `${sizeRem}rem`,
      height: `${sizeRem}rem`,
    }"
  />
</template>

<script lang="ts" setup>
import Sprite from "~/assets/character/character.png";

const sizeRem = computed(() => props.size * 0.25);

const props = defineProps<{
  layer: number;
  index: number;
  size: number;
}>();
</script>
