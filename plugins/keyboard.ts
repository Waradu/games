import { useKeyboard } from "@waradu/keyboard";

export default defineNuxtPlugin((nuxtApp) => {
  const keyboard = useKeyboard();

  nuxtApp.hook("app:mounted", () => {
    keyboard.init();
  });

  return {
    provide: {
      keyboard,
    },
  };
});
