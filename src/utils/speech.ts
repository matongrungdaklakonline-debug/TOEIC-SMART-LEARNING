export function speakLines(
  lines: string[],
  rate = 1,
  onLineStart?: (index: number) => void,
  onDone?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onDone?.();
    return () => {};
  }

  window.speechSynthesis.cancel();
  let cancelled = false;

  const speakNext = (idx: number) => {
    if (cancelled || idx >= lines.length) {
      onDone?.();
      return;
    }
    onLineStart?.(idx);
    const cleanText = lines[idx].replace(/^(Speaker [AB]:|Man:|Woman:|Question:|Statement:|\([A-D]\))\s*/i, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'en-US';
    utter.rate = Math.max(0.6, Math.min(1.5, rate));
    // Alternate slight pitch for Speaker A/Man vs Speaker B/Woman
    if (/^(Woman:|Speaker A:)/i.test(lines[idx])) {
      utter.pitch = 1.08;
    } else if (/^(Man:|Speaker B:)/i.test(lines[idx])) {
      utter.pitch = 0.94;
    } else {
      utter.pitch = 1.0;
    }
    utter.onend = () => {
      if (!cancelled) speakNext(idx + 1);
    };
    utter.onerror = () => {
      if (!cancelled) speakNext(idx + 1);
    };
    window.speechSynthesis.speak(utter);
  };

  speakNext(0);

  return () => {
    cancelled = true;
    window.speechSynthesis.cancel();
  };
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
