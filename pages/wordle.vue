<template>
  <div
    class="w-full min-h-full h-max dark flex flex-col gap-8 items-center p-8 px-4 bg-neutral-900 text-neutral-200 select-none"
  >
    <h1 class="text-4xl font-bold flex items-center gap-4">
      <span>Wordle</span>
      <div
        class="p-2 bg-neutral-800 active:bg-neutral-700 hover:bg-neutral-700 rounded-md"
        @click="reset"
      >
        <LucideRotateCcw class="size-4" />
      </div>
    </h1>
    <div class="flex flex-col gap-2 perspective-1000">
      <div v-for="row in guessCount" class="flex gap-2">
        <div
          v-for="column in lettersCount"
          class="relative preserve-3d perspective-1000 size-12 lg:size-16"
          :id="`box-${row}-${column}`"
        >
          <div
            class="absolute inset-0 flex items-center justify-center text-xl lg:text-2xl border-4 border-neutral-800 bg-transparent text-neutral-400 rounded-xl backface-hidden"
            :class="`reset row-${row}`"
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
            class="absolute inset-0 flex items-center justify-center text-white text-2xl rounded-xl rotate-x-180 transform backface-hidden font-bold"
            :class="[
              `reset-back row-${row}-back`,
              currentLine >= row
                ? guesseResults[row - 1][column - 1] == LetterStatus.CORRECT
                  ? 'bg-[#568637]'
                  : guesseResults[row - 1][column - 1] == LetterStatus.PRESENT
                  ? 'bg-[#b99c49]'
                  : 'bg-neutral-800'
                : '',
            ]"
          >
            {{
              row - 1 == currentLine
                ? currentText[column - 1]?.toUpperCase()
                : currentLine >= row
                ? guesses[row - 1][column - 1]?.toUpperCase()
                : ""
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1 lg:gap-2 items-center w-full max-w-[800px]">
      <div
        v-for="row in keyboard"
        class="grid gap-1 lg:gap-2 w-full"
        :style="{
          gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
        }"
      >
        <div
				  v-for="key in row"
				  :key="key"
				  class="h-12 flex justify-center items-center rounded-xl transition-colors cursor-pointer"
				  :class="[
				    keyStatuses.get(key) !== undefined
				      ? keyStatuses.get(key) === LetterStatus.CORRECT
				        ? 'bg-[#568637] text-white'
				        : keyStatuses.get(key) === LetterStatus.PRESENT
				        ? 'bg-[#b99c49] text-white'
				        : 'bg-neutral-800 text-white'
				      : 'bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-600 text-neutral-200'
				  ]"
				  @click="addKey(key)"
				>
				  {{ key.toUpperCase() }}
				</div>
      </div>
    </div>
    <div
      class="flex flex-col items-center justify-center absolute inset-0 z-10 bg-neutral-900/80 backdrop-blur-xs text-md gap-4"
      v-if="modalOpen"
    >
      <div v-if="state != GameState.PLAYING">{{ `The answer was: ${word}` }}</div>
      <div
        class="bg-neutral-800 rounded-xl cursor-pointer p-4 px-8 text-xl"
        v-if="state != GameState.PLAYING"
        @click="reset"
      >
        New Game
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
import { LucideRefreshCcw, LucideRotateCcw } from "lucide-vue-next";

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["⌫", "z", "x", "c", "v", "b", "n", "m", "↵"],
];

enum GameState {
  PLAYING,
  DED,
  WON,
}

const state = ref<GameState>(GameState.PLAYING);

const words = Words.split("\n");
const extraWords = ExtraWords.split("\n");
const characters = Characters.split("\n");

const word = ref("");
let guesses = ref<string[]>([]);

const modalOpen = ref(false);

const keyStatuses = computed(() => {
  const map = new Map<string, LetterStatus>();

  guesses.value.forEach((guess) => {
    const result = checkWordleGuess(guess);

    for (let i = 0; i < guess.length; i++) {
      const key = guess[i];
      const status = result[i];
      const prev = map.get(key) ?? LetterStatus.ABSENT;

      if (
        status === LetterStatus.CORRECT ||
        (status === LetterStatus.PRESENT && prev !== LetterStatus.CORRECT) ||
        (status === LetterStatus.ABSENT && !map.has(key))
      ) {
        map.set(key, status);
      }
    }
  });

  return map;
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

const addKey = (key: string) => {
  if (key == "⌫") {
    deleteChar();
    return;
  }

  if (key == "↵") {
    submit();
    return;
  }

  if (
    !characters.includes(key.toLowerCase()) ||
    lettersCount <= currentText.value.length ||
    state.value != GameState.PLAYING
  )
    return;

  animate(
    `#box-${currentLine.value + 1}-${currentLetter.value + 1}`,
    { scale: [1, 1.1, 1] },
    { duration: 0.2, ease: "easeOut" }
  );
  currentText.value += key.toLowerCase();
  currentLetter.value += 1;
};

$keyboard.listen([Key.All], (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  addKey(e.key);
});

const deleteChar = () => {
  if (currentLetter.value == 0 || state.value != GameState.PLAYING) return;

  animate(
    `#box-${currentLine.value + 1}-${currentLetter.value}`,
    { scale: [1, 0.9, 1] },
    { duration: 0.2, ease: "easeOut" }
  );
  currentText.value = currentText.value.slice(0, -1);
  currentLetter.value -= 1;
};

$keyboard.listen([Key.Backspace], deleteChar);

const submit = () => {
  if (
    lettersCount != currentText.value.length ||
    !(
      words.includes(currentText.value) ||
      extraWords.includes(currentText.value)
    )
  ) {
    animate(
      `.row-${currentLine.value + 1}`,
      { rotate: [0, -5, 10, -5, 0] },
      { duration: 0.4, ease: "easeInOut" }
    );
    return;
  }
  if (state.value != GameState.PLAYING) return;

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
    confetti();
    state.value = GameState.WON;
    modalOpen.value = true;
    return;
  }
  if (currentLine.value == guessCount) {
    state.value = GameState.DED;
    modalOpen.value = true;
    return;
  }
};

$keyboard.listen([Key.Enter], submit);

onMounted(() => {
  word.value = words[Math.floor(Math.random() * words.length)];
});

const reset = () => {
  guesseResults.value = [];
  currentLine.value = 0;
  currentLetter.value = 0;
  currentText.value = "";
  guesses.value = [];
  state.value = GameState.PLAYING;
  word.value = words[Math.floor(Math.random() * words.length)];
	modalOpen.value = false;

  animate(`.reset`, { rotateX: 0 }, { duration: 0 });

  animate(`.reset-back`, { rotateX: 180 }, { duration: 0 });

  for (let i = 0; i < guessCount; i++) {
    const ix = i;
    setTimeout(() => {
      animate(
        `.row-${ix + 1}`,
        { scale: [1, 1.2, 1] },
        { delay: stagger(0.1), duration: 0.4, ease: "easeInOut" }
      );
    }, ix * 100);
  }

  animate(
    `.reset`,
    { scale: [1, 1.1, 1] },
    { delay: stagger(0.1), duration: 0.4 }
  );
};

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
