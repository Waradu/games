<template>
  <div class="w-full h-full flex flex-col gap-8 items-center p-8">
    <h1 class="text-4xl font-bold">Wordle</h1>
    <h1 class="text-4xl font-bold">{{ word }}</h1>
    <div class="flex flex-col gap-2 perspective-1000">
      <div v-for="row in guessCount" class="flex gap-2">
        <div
          v-for="column in lettersCount"
          class="relative preserve-3d perspective-1000 w-16 h-16"
          :id="`box-${row}-${column}`"
        >
          <div
            class="absolute inset-0 flex items-center justify-center text-2xl border-4 border-neutral-200 bg-transparent text-neutral-600 rounded-xl backface-hidden"
            :class="`row-${row}`"
          >
            {{
              row - 1 == currentLine
                ? currentText[column - 1]?.toUpperCase()
                : currentLine >= row
                ? guesses[row - 1][column - 1]?.toUpperCase()
                : ""
            }}
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center text-white text-2xl rounded-xl rotate-x-180 backface-hidden"
            :class="[
              `row-${row}-back`,
              currentLine >= row
                ? guesseResults[row - 1][column - 1] == LetterStatus.CORRECT
                  ? 'bg-green-500'
                  : guesseResults[row - 1][column - 1] == LetterStatus.PRESENT
                  ? 'bg-orange-500'
                  : 'bg-neutral-500'
                : '',
            ]"
          >
            {{
              row - 1 == currentLine && currentLine >= row
                ? guesses[row - 1][column - 1]?.toUpperCase()
                : "Y"
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Words from "~/assets/wordle/words.txt?raw";
import ExtraWords from "~/assets/wordle/extra_words.txt?raw";
import Characters from "~/assets/wordle/characters.txt?raw";
import { animate, stagger } from "motion-v";
import { Key } from "@waradu/keyboard";

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const words = Words.split("\n");
const extraWords = ExtraWords.split("\n");
const characters = Characters.split("\n");

const word = ref("");
let guesses = ref<string[]>([]);

const typedLetters = computed(() => {
  let letters = new Set();

  keyboard.flat().forEach((key) => {
    const keyInGuesses = guesses.value.some((guess) => guess.includes(key));
    if (keyInGuesses) letters.add(key);
  });

  return letters;
});

const currentLine = ref(0);
const currentLetter = ref(0);
const currentText = ref("");

const lettersCount = 5;
const guessCount = 6;

enum LetterStatus {
  ABSENT,
  PRESENT,
  CORRECT,
}

let guesseResults = ref<LetterStatus[][]>([]);

const { $keyboard } = useNuxtApp();
const { confetti } = useConfetti();

$keyboard.listen([Key.X], () => {
  confetti()
})

onMounted(() => {

  word.value = words[Math.floor(Math.random() * words.length)];
  
  window.addEventListener("keyup", (e) => {
    if (
      characters.includes(e.key) &&
      lettersCount > currentText.value.length &&
      !(e.ctrlKey || e.metaKey || e.altKey)
    ) {
      animate(
        `#box-${currentLine.value + 1}-${currentLetter.value + 1}`,
        { scale: [1, 1.1, 1] },
        { duration: 0.2, ease: "easeOut" }
      );
      currentText.value += e.key;
      currentLetter.value += 1;
    }
    if (e.key == "Backspace") {
      animate(
        `#box-${currentLine.value + 1}-${currentLetter.value}`,
        { scale: [1, 0.9, 1] },
        { duration: 0.2, ease: "easeOut" }
      );
      currentText.value = currentText.value.slice(0, -1);
      currentLetter.value -= 1;
    }
    if (
      e.key == "Enter" &&
      lettersCount == currentText.value.length &&
      currentLine.value < guessCount &&
      (words.includes(currentText.value) ||
        extraWords.includes(currentText.value))
    ) {
      animate(
        `.row-${currentLine.value + 1}`,
        { y: [1, -20, 1], rotateX: 180 },
        { delay: stagger(0.1), duration: 0.4, ease: "easeInOut" }
      );

      animate(
        `.row-${currentLine.value + 1}-back`,
        { y: [1, -20, 1], rotateX: 360 },
        { delay: stagger(0.1), duration: 0.4, ease: "easeInOut" }
      );

      currentLine.value += 1;
      currentLetter.value = 0;

      guesses.value.push(currentText.value);
      const result = checkWordleGuess(currentText.value);

      currentText.value = "";

      guesseResults.value.push(result);
      if (result.every((res) => res == LetterStatus.CORRECT)) {
        //confetti();
        return;
      }
      if (currentLine.value == guessCount) {
        return;
      }
    }
  });
});

function checkWordleGuess(guess: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(guess.length).fill(
    LetterStatus.ABSENT
  );
  const used = new Array(word.value.length).fill(false);

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === word.value[i]) {
      result[i] = LetterStatus.CORRECT;
      used[i] = true;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === LetterStatus.CORRECT) continue;

    for (let j = 0; j < word.value.length; j++) {
      if (!used[j] && guess[i] === word.value[j]) {
        result[i] = LetterStatus.PRESENT;
        used[j] = true;
        break;
      }
    }
  }

  return result;
}
</script>
