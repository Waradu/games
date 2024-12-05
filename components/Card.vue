<template>
  <div class="card">
    <div class="front"></div>
    <div class="back"></div>
  </div>
</template>

<script lang="ts" setup>
import type { Card, Type } from "~/types/cards";

const card: Card[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "W",
];

const type: Type[] = ["Spades", "Clubs", "Hearts", "Diamonds"];

const props = defineProps<{
  card: Card;
  type: Type;
}>();

const scale = 6;
const x = card.indexOf(props.card);
const y = type.indexOf(props.type);
</script>

<style lang="scss">
.card {
  --width: 11px;
  --height: 18px;
  --scale: v-bind(scale);
  width: calc(var(--width) * var(--scale));
  height: calc(var(--height) * var(--scale));
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.2s, background 0s;
  transform: perspective(400px) rotateX(45deg);
  cursor: $cursor_pointer;

  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("~/assets/game/cards.png");
    background-repeat: no-repeat;
    background-size: 1800%;
    image-rendering: pixelated;
    backface-visibility: hidden;
    background-position: calc(
        calc(calc(var(--width) * var(--scale)) * v-bind(x)) * -1
      )
      calc(calc(calc(var(--height) * var(--scale)) * v-bind(y)) * -1);
  }

  .back {
    background-position: calc(calc(calc(var(--width) * var(--scale)) * 15) * -1)
      calc(calc(calc(var(--height) * var(--scale)) * 0) * -1);
    transform: rotateX(180deg) rotateZ(180deg);
  }

  &:hover {
    scale: 1.1;
  }
}
</style>
