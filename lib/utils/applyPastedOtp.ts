export function applyPastedOtp(currentCode: string[], pastedText: string, length = 6): string[] {
  const pasted = pastedText.replace(/\D/g, '').slice(0, length);

  if (!pasted) {
    return currentCode;
  }

  const next = [...currentCode];

  pasted.split('').forEach((digit, i) => {
    next[i] = digit;
  });

  return next;
}
