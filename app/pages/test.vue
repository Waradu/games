<template>
  <div class="text-white">
    <h1>Guess: {{ id }}</h1>
    <button @click="start">Start</button>
    <input v-model="text" type="text" />
    <button @click="guess">Guess</button>
    <button @click="stop">Stop</button>
    <h1>guesses: {{ guesses }}</h1>
    <h1>word: {{ word }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { GameResult } from "~~/shared/types/wordle";

const id = ref("");
const text = ref("");
const word = ref("");
const guesses = ref(0);

const { $trpc } = useNuxtApp();

const start = async () => {
  const game = await $trpc.wordle.start.mutate();

  id.value = game.id;
};

const guess = async () => {
  if (!id.value) return;

  const result = await $trpc.wordle.guess.mutate({
    id: id.value,
    word: text.value,
  });

  if (result.result == GameResult.PLAYING) {
    guesses.value = result.guesses.length;
    console.log(result.guesses);
    return;
  }

  word.value = result.word!;
  id.value = "";
};

const stop = async () => {
  if (!id.value) return;

  const result = await $trpc.wordle.stop.mutate({ id: id.value });

  word.value = result.word;
  id.value = "";
};
</script>
