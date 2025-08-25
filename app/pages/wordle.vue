<template>
  <div
    class="dark flex h-max min-h-full w-full flex-col items-center gap-2 bg-neutral-900 px-4 pt-4 pb-56 text-neutral-200 select-none"
  >
    <PageHeader>
      <div class="flex items-center gap-2">
        <div class="flex gap-2">
          <Button
            :title="isDaily ? 'Switch to random' : 'Switch to daily'"
            :icon="isDaily ? LucideCalendarClock : LucideShuffle"
            @click="toggleDaily"
          >
            <span>{{ isDaily ? "Daily" : "Random" }}</span>
          </Button>
          <Button title="Restart" :icon="LucideRotateCcw" @click="clear" />
          <Button title="Screenshot" :icon="LucideCamera" @click="screenshot" />
          <Button
            v-if="board.length > 0"
            title="Give Up"
            :icon="LucideX"
            @click="giveup"
          />
        </div>
      </div>
    </PageHeader>
    <h1 class="text-4xl font-bold">Wordle</h1>
    <div ref="screenshotArea" class="flex flex-col gap-4 bg-neutral-900 p-4">
      <div
        v-if="screenshotting"
        class="flex justify-between text-sm text-neutral-400"
      >
        <span class="">https://games.waradu.dev</span>
        <span v-if="state != GameState.PLAYING" class="text-neutral-200">
          "{{ word.toUpperCase() }}"
        </span>
      </div>
      <div
        class="perspective-1000 relative flex flex-col gap-2"
        :class="loading ? 'animate-pulse' : ''"
      >
        <div v-for="row in guessCount" :key="row" class="flex gap-2">
          <div
            v-for="column in lettersCount"
            :id="`box-${row}-${column}`"
            :key="`box-${row}-${column}`"
            class="preserve-3d perspective-1000 relative size-12 md:size-16"
          >
            <div
              class="absolute inset-0 flex items-center justify-center rounded-xl border-4 bg-neutral-900 text-xl text-neutral-200 backface-hidden md:text-2xl"
              :class="[
                `reset row-${row}`,
                currentLetter == column &&
                currentLine + 1 == row &&
                state == GameState.PLAYING
                  ? 'border-neutral-700'
                  : 'border-neutral-800',
                tileResult(row - 2, column - 1) === LetterStatus.CORRECT &&
                tileCurrentText(column - 1) === ''
                  ? 'text-neutral-600'
                  : '',
              ]"
              @click="() => setCurrentLetter(column, row)"
            >
              {{
                row - 1 == currentLine
                  ? tileResult(row - 2, column - 1) === LetterStatus.CORRECT
                    ? tileLetter(row - 2, column - 1)
                    : tileCurrentText(column - 1)
                  : currentLine > row - 1
                    ? tileLetter(row - 1, column - 1)
                    : ""
              }}
            </div>
            <div
              class="absolute inset-0 flex rotate-x-180 transform items-center justify-center rounded-xl text-2xl font-bold text-white backface-hidden"
              :class="[
                `reset-back row-${row}-back`,
                currentLine > row - 1 &&
                tileResult(row - 1, column - 1) === LetterStatus.CORRECT
                  ? 'bg-[#568637]'
                  : currentLine > row - 1 &&
                      tileResult(row - 1, column - 1) === LetterStatus.PRESENT
                    ? 'bg-[#b99c49]'
                    : currentLine > row - 1
                      ? 'bg-neutral-800'
                      : '',
              ]"
            >
              {{
                row - 1 == currentLine
                  ? tileCurrentText(column - 1)
                  : currentLine > row - 1
                    ? tileLetter(row - 1, column - 1)
                    : ""
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed right-0 bottom-0 left-0 flex w-full flex-col items-center gap-1 bg-neutral-900 p-1 md:p-4"
      :class="[
        state != GameState.PLAYING ? 'pointer-events-none opacity-20' : '',
        loading ? 'animate-pulse' : '',
      ]"
    >
      <div
        v-for="row in keyboard"
        :key="row.toString()"
        class="grid w-max max-w-full gap-1"
        :style="{
          gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
        }"
      >
        <div
          v-for="key in row"
          :key="key"
          class="flex h-12 w-20 max-w-full items-center justify-center rounded-xl transition-[filter] hover:brightness-150 active:brightness-150 md:h-14"
          :class="[
            keyhints[key] !== undefined
              ? keyhints[key] === LetterStatus.CORRECT
                ? 'bg-[#568637] text-white'
                : keyhints[key] === LetterStatus.PRESENT
                  ? 'bg-[#b99c49] text-white'
                  : 'bg-neutral-800 text-white'
              : 'bg-neutral-700 text-neutral-200',
          ]"
          @click="addKey(key)"
        >
          {{ key.toUpperCase() }}
        </div>
      </div>
    </div>
    <AnimatePresence>
      <motion.div
        v-if="modalOpen"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        class="text-md absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-neutral-900/80 backdrop-blur-sm"
      >
        <div v-if="state != GameState.PLAYING" class="text-xl">
          The answer was: <b>{{ word.toUpperCase() }}</b>
        </div>
        <div
          class="rounded-xl bg-neutral-800 p-4 px-8 text-xl transition-colors hover:bg-neutral-700 active:bg-neutral-700"
          @click="clear"
        >
          New Game
        </div>
        <div
          class="absolute top-2 right-2 rounded-md bg-neutral-800 p-2 transition-colors hover:bg-neutral-700 active:bg-neutral-700"
          @click="modalOpen = false"
        >
          <LucideX class="size-4 text-neutral-200" />
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script lang="ts" setup>
import Characters from "~/assets/wordle/characters.txt?raw";
import { animate, stagger, motion } from "motion-v";
import { Key } from "@waradu/keyboard";
import {
  LucideCalendarClock,
  LucideCamera,
  LucideRotateCcw,
  LucideShuffle,
  LucideX,
} from "lucide-vue-next";
import { toPng } from "html-to-image";
import {
  GameState,
  type KeyHints,
  type WordleBoard,
} from "~~/shared/types/wordle";

useHead({
  title: "Wordle",
});

const { $trpc, $toast } = useNuxtApp();

const boardRef = useTemplateRef("screenshotArea");
const screenshotting = ref(false);

const keyhints = ref<KeyHints>({});
const board = ref<WordleBoard>([]);

const daily = useRouteQuery("daily");
const isDaily = computed(() => daily.value !== undefined);

const toggleDaily = async () => {
  daily.value = isDaily.value ? undefined : null;
  await clear();
};

const tileAt = (r: number, c: number) => board.value?.[r]?.[c] ?? null;
const tileLetter = (r: number, c: number) =>
  tileAt(r, c)?.letter?.toUpperCase() ?? "";
const tileResult = (r: number, c: number) => tileAt(r, c)?.result ?? null;
const tileCurrentText = (c: number) => {
  const character = currentText.value[c];
  if (!character) return "";
  if (character == " ") return "?";
  return character.toUpperCase();
};

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
  ["↵", "z", "x", "c", "v", "b", "n", "m", "?", "⌫"],
] as const;

const state = ref<GameState>(GameState.PLAYING);

const characters = Characters.replaceAll("\r", "").split("\n");

const word = ref("");
const id = ref("");
const loading = ref(false);

const modalOpen = ref(false);

const currentLine = ref(0);
const currentLetter = ref(0);
const currentText = ref<string[]>([]);

const lettersCount = 5;
const guessCount = 6;

enum LetterStatus {
  ABSENT,
  PRESENT,
  CORRECT,
}

const { confetti } = useConfetti();

const setCurrentLetter = (column: number, row: number) => {
  if (
    row - 1 != currentLine.value ||
    loading.value ||
    currentText.value.length <= 0
  )
    return;

  if (column - 1 > currentText.value.length) {
    currentLetter.value = currentText.value.length;
    return;
  }

  currentLetter.value = column;
};

const addKey = (key: string) => {
  if (key == "⌫") {
    deleteChar();
    return;
  }

  if (key == "↵") {
    submit();
    return;
  }

  if (key == "?") {
    key = " ";
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
  currentText.value.splice(currentLetter.value, 0, key.toLowerCase());
  currentLetter.value += 1;
};

useKeybind([Key.All], (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || loading.value) return;

  addKey(e.key);
});

const deleteChar = () => {
  if (
    currentLetter.value == 0 ||
    state.value != GameState.PLAYING ||
    loading.value
  )
    return;

  animate(
    `#box-${currentLine.value + 1}-${currentLetter.value}`,
    { scale: [1, 0.9, 1] },
    { duration: 0.2, ease: "easeOut" },
  );
  currentText.value.splice(currentLetter.value - 1, 1);
  currentLetter.value -= 1;
};

useKeybind([Key.Backspace], deleteChar);

useKeybind([Key.ArrowLeft], () => {
  if (currentLetter.value == 0 || loading.value) return;
  currentLetter.value = currentLetter.value - 1;
});

useKeybind([Key.ArrowRight], () => {
  if (
    currentLetter.value == 5 ||
    currentLetter.value == currentText.value.length ||
    loading.value
  )
    return;
  currentLetter.value = currentLetter.value + 1;
});

const submit = async () => {
  if (loading.value) return;

  if (!id.value) {
    loading.value = true;
    const game = await $trpc.wordle.start.mutate({
      difficulty: "easy",
      type: isDaily.value ? "daily" : "normal",
    });
    loading.value = false;

    id.value = game.id;
  }

  if (state.value != GameState.PLAYING) {
    clear();
    return;
  }

  try {
    loading.value = true;
    const result = await $trpc.wordle.guess.mutate({
      word: currentText.value.join(""),
      id: id.value,
    });
    loading.value = false;

    state.value = result.state;
    board.value = result.board;
    keyhints.value = result.keyboard;

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
    currentText.value = [];

    if (state.value == GameState.WON) {
      word.value = result.word!;
      confetti();
      return;
    }

    if (state.value == GameState.DED) {
      word.value = result.word!;
      modalOpen.value = true;
      return;
    }
  } catch (err) {
    if (isTrpcError(err)) {
      if (err.data?.code == "NOT_FOUND") {
        $toast.error(err.message);
      }
    }

    loading.value = false;

    animate(
      `.row-${currentLine.value + 1}`,
      { rotate: [0, -5, 10, -5, 10, -5, 0], opacity: [1, 0.5, 1] },
      { duration: 0.6, ease: "easeInOut" },
    );
  }
};

useKeybind([Key.Enter], submit);

const reset = async () => {
  board.value = [];
  keyhints.value = {};
  currentLine.value = 0;
  currentLetter.value = 0;
  currentText.value = [];
  state.value = GameState.PLAYING;
  modalOpen.value = false;
  loading.value = false;
  if (id.value) {
    try {
      await $trpc.wordle.stop.mutate({ id: id.value });
    } catch {
      // ignore
    }
  }
  id.value = "";
};

onMounted(async () => {
  reset();
});

const giveup = async () => {
  if (loading.value) return;

  const result = await $trpc.wordle.stop.mutate({
    id: id.value,
  });
  state.value = result.state;
  board.value = result.board;
  keyhints.value = result.keyboard;
  word.value = result.word;
  modalOpen.value = true;
};

const clear = async () => {
  if (loading.value) return;

  await reset();

  animate(`.reset`, { rotateX: 0 }, { duration: 0 });

  animate(`.reset-back`, { rotateX: 180 }, { duration: 0 });

  animate(
    `.reset`,
    { scale: [1, 1.1, 0.95, 1] },
    { duration: 0.5, ease: "easeInOut" },
  );
};
</script>
