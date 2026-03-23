"use client";

import { useEffect, useState } from "react";

type TypewriterHeadingProps = {
  className?: string;
  text: string;
};

export function TypewriterHeading({
  className,
  text
}: TypewriterHeadingProps) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);

    let timeoutId = 0;
    let cancelled = false;

    const getDelayForCharacter = (character: string) => {
      if (character === " ") {
        return 78;
      }

      if (/[.,]/.test(character)) {
        return 165;
      }

      return 52;
    };

    const run = (length: number, delay: number) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        if (length < text.length) {
          const nextLength = length + 1;
          setVisibleLength(nextLength);
          run(nextLength, getDelayForCharacter(text[nextLength - 1] ?? ""));
          return;
        }

        setVisibleLength(text.length);
        timeoutId = window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          setVisibleLength(0);
          run(0, 180);
        }, 3000);
      }, delay);
    };

    run(0, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [text]);

  const visibleText = text.slice(0, visibleLength);

  return (
    <h1 className={className}>
      <span className="typewriter-shell">
        <span className="typewriter-ghost" aria-hidden="true">
          {text}
        </span>
        <span className="typewriter-live" aria-live="off">
          {visibleText}
          <span aria-hidden="true" className="typewriter-cursor" />
        </span>
      </span>
    </h1>
  );
}
