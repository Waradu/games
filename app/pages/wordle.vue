<template>
  <div
    class="dark flex h-max min-h-full w-full flex-col items-center gap-4 bg-neutral-900 p-8 px-4 text-neutral-200 select-none"
  >
    <h1 class="flex items-center gap-4 text-4xl font-bold">
      <span>Wordle</span>
      <div
        class="rounded-md bg-neutral-800 p-2 hover:bg-neutral-700 active:bg-neutral-700"
        @click="reset"
      >
        <LucideRotateCcw class="size-4 text-neutral-200" />
      </div>
      <div
        class="rounded-md bg-neutral-800 p-2 hover:bg-neutral-700 active:bg-neutral-700"
        @click="screenshot"
      >
        <LucideCamera class="size-4 text-neutral-200" />
      </div>
    </h1>
    <div ref="boardRef" class="flex flex-col gap-4 bg-neutral-900 p-4">
      <div
        v-if="screenshotting"
        class="flex justify-between text-sm text-neutral-400"
      >
        <span class="">https://games.waradu.dev</span>
        <span v-if="state != GameState.PLAYING" class="text-neutral-200">
          "{{ word.toUpperCase() }}"
        </span>
      </div>
      <div class="perspective-1000 flex flex-col gap-2">
        <div v-for="row in guessCount" :key="row" class="flex gap-2">
          <div
            v-for="column in lettersCount"
            :id="`box-${row}-${column}`"
            :key="column"
            class="preserve-3d perspective-1000 relative size-12 lg:size-16"
          >
            <div
              class="absolute inset-0 flex items-center justify-center rounded-xl border-4 border-neutral-800 bg-transparent text-xl text-neutral-200 backface-hidden lg:text-2xl"
              :class="`reset row-${row}`"
            >
              {{
                row - 1 == currentLine
                  ? currentText[column - 1]?.toUpperCase()
                  : currentLine >= row
                    ? guesses[row - 1]![column - 1]?.toUpperCase()
                    : ""
              }}
            </div>
            <div
              class="absolute inset-0 flex rotate-x-180 transform items-center justify-center rounded-xl text-2xl font-bold text-white backface-hidden"
              :class="[
                `reset-back row-${row}-back`,
                currentLine >= row
                  ? guesseResults[row - 1]![column - 1] == LetterStatus.CORRECT
                    ? 'bg-[#568637]'
                    : guesseResults[row - 1]![column - 1] ==
                        LetterStatus.PRESENT
                      ? 'bg-[#b99c49]'
                      : 'bg-neutral-800'
                  : '',
              ]"
            >
              {{
                row - 1 == currentLine
                  ? currentText[column - 1]?.toUpperCase()
                  : currentLine >= row
                    ? guesses[row - 1]![column - 1]?.toUpperCase()
                    : ""
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-full max-w-[800px] flex-col items-center gap-1 lg:gap-2">
      <div
        v-for="row in keyboard"
        :key="row.toString()"
        class="grid w-full gap-1 lg:gap-2"
        :style="{
          gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
        }"
      >
        <div
          v-for="key in row"
          :key="key"
          class="flex h-12 items-center justify-center rounded-xl transition-colors"
          :class="[
            keyStatuses.get(key) !== undefined
              ? keyStatuses.get(key) === LetterStatus.CORRECT
                ? 'bg-[#568637] text-white'
                : keyStatuses.get(key) === LetterStatus.PRESENT
                  ? 'bg-[#b99c49] text-white'
                  : 'bg-neutral-800 text-white'
              : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600 active:bg-neutral-600',
          ]"
          @click="addKey(key)"
        >
          {{ key.toUpperCase() }}
        </div>
      </div>
    </div>
    <div
      v-if="modalOpen"
      class="text-md absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-neutral-900/80 backdrop-blur-sm"
    >
      <div v-if="state != GameState.PLAYING">
        {{ `The answer was: ${word}` }}
      </div>
      <div class="rounded-xl bg-neutral-800 p-4 px-8 text-xl" @click="reset">
        New Game
      </div>
      <div
        class="absolute top-2 right-2 rounded-md bg-neutral-800 p-2 hover:bg-neutral-700 active:bg-neutral-700"
        @click="modalOpen = false"
      >
        <LucideX class="size-4 text-neutral-200" />
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
import { LucideCamera, LucideRotateCcw, LucideX } from "lucide-vue-next";
import { toPng } from "html-to-image";

useHead({
  title: "Wordle",
});

const boardRef = ref<HTMLElement | null>(null);
const screenshotting = ref(false);

const screenshot = async () => {
  if (!boardRef.value) return;
  screenshotting.value = true;
  setTimeout(async () => {
    try {
      if (!boardRef.value) return;

      const dataUrl = await toPng(boardRef.value, {
        skipFonts: true,
      });
      screenshotting.value = false;

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "board.png";
      a.click();
    } catch (e) {
      console.error("screenshot failed", e);
    }
  }, 1);
};

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
const guesses = ref<string[]>([]);

const modalOpen = ref(false);

const keyStatuses = computed(() => {
  const map = new Map<string, LetterStatus>();

  guesses.value.forEach((guess) => {
    const result = checkWordleGuess(guess);

    for (let i = 0; i < guess.length; i++) {
      const key = guess[i];
      const status = result[i];

      if (!key) return;

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

const guesseResults = ref<LetterStatus[][]>([]);

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
    { duration: 0.2, ease: "easeOut" },
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
    { duration: 0.2, ease: "easeOut" },
  );
  currentText.value = currentText.value.slice(0, -1);
  currentLetter.value -= 1;
};

$keyboard.listen([Key.Backspace], deleteChar);

const submit = () => {
  if (state.value != GameState.PLAYING) {
    reset();
    return;
  }

  if (
    lettersCount != currentText.value.length ||
    !(
      words.includes(currentText.value) ||
      extraWords.includes(currentText.value)
    ) ||
    guesses.value.includes(currentText.value)
  ) {
    animate(
      `.row-${currentLine.value + 1}`,
      { rotate: [0, -5, 10, -5, 10, -5, 0], opacity: [1, 0.5, 1] },
      { duration: 0.6, ease: "easeInOut" },
    );
    return;
  }
  if (state.value != GameState.PLAYING) return;

  animate(
    `.row-${currentLine.value + 1}`,
    { y: [0, -20, 5, 0], rotateX: 180 },
    { delay: stagger(0.1), duration: 0.4, ease: "easeInOut" },
  );

  animate(
    `.row-${currentLine.value + 1}-back`,
    { y: [0, -20, 5, 0], rotateX: 360 },
    { delay: stagger(0.1), duration: 0.4, ease: "easeInOut" },
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
  word.value = words[Math.floor(Math.random() * words.length)] ?? "noway";
});

const reset = () => {
  guesseResults.value = [];
  currentLine.value = 0;
  currentLetter.value = 0;
  currentText.value = "";
  guesses.value = [];
  state.value = GameState.PLAYING;
  word.value = words[Math.floor(Math.random() * words.length)] ?? "noway";
  modalOpen.value = false;

  animate(`.reset`, { rotateX: 0 }, { duration: 0 });

  animate(`.reset-back`, { rotateX: 180 }, { duration: 0 });

  for (let i = 0; i < guessCount; i++) {
    const ix = i;
    setTimeout(() => {
      animate(
        `.row-${ix + 1}`,
        { scale: [1, 1.2, 1] },
        { delay: stagger(0.1), duration: 0.4, ease: "easeInOut" },
      );
    }, ix * 100);
  }

  animate(
    `.reset`,
    { scale: [1, 1.1, 1] },
    { delay: stagger(0.1), duration: 0.4 },
  );
};

function checkWordleGuess(guess: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(guess.length).fill(
    LetterStatus.ABSENT,
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
