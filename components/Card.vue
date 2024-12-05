<template>
  <div class="card" ref="target" @mousedown="drag" @mouseup="stopDrag">
    <div class="front"></div>
    <div class="back"></div>
  </div>
</template>

<script lang="ts" setup>
import type { Card, Type } from "~/types/cards";

const target = ref<HTMLElement>();

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
const x = ref(card.indexOf(props.card));
const y = ref(type.indexOf(props.type));

const dx = ref(0);
const dy = ref(0);
const relx = ref(0);
const rely = ref(0);
const moving = ref(true);

const drag = (e: MouseEvent) => {
  if (!target.value) return;

  const rect = target.value.getBoundingClientRect();
  relx.value = e.clientX - rect.left;
  rely.value = e.clientY - rect.top;

  target.value.classList.add("dragging");
  moving.value = true;
};

const stopDrag = (e: MouseEvent) => {
  if (!target.value) return;

  const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);

  const dropElements = document.querySelectorAll(".drop");

  console.log(dropElements);

  dropElements.forEach((dropElement) => {
    if (dropElement.contains(elementUnderMouse)) {
      if (!target.value) return;
      console.log(dropElement);
      dropElement.appendChild(target.value);
    }
  });

  relx.value = 0;
  rely.value = 0;

  target.value.classList.remove("dragging");
  moving.value = false;
};

onMounted(() => {
  document.addEventListener("mousemove", (e: MouseEvent) => {
    dx.value = e.clientX;
    dy.value = e.clientY;
  });

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("mouseleave", stopDrag);
});
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
  transition: scale 0.2s;
  transform: perspective(400px);
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

  &.dragging {
    position: fixed;
    top: calc((v-bind(dy) - v-bind(rely)) * 1px);
    left: calc((v-bind(dx) - v-bind(relx)) * 1px);
    pointer-events: none;
    scale: 1.1;
    rotate: 10deg;
  }
}
</style>
