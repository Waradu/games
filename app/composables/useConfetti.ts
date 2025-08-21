import JSConfetti from "js-confetti";

export function useConfetti() {
  let jsConfetti: JSConfetti | null = null;

  onMounted(() => {
    jsConfetti = new JSConfetti();
  });

  const run = () => {
    if (!jsConfetti) return;

    jsConfetti.addConfetti({
      confettiRadius: 6,
      confettiNumber: 200,
    });
  };

  return { confetti: run };
}
