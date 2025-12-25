"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function TypingQuote() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const fullText = '"Crystal clear prints, from our House to yours."';
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const pauseDuration = 2500;

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (text.length < fullText.length) {
          // Typing
          setText(fullText.substring(0, text.length + 1));
        } else {
          // Pause, then start deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (text.length > 0) {
          // Deleting
          setText(fullText.substring(0, text.length - 1));
        } else {
          // Finished deleting, start typing again
          setIsDeleting(false);
        }
      }
    };

    const typingInterval = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, typingInterval);

    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  return (
    <div className="pb-12 text-center">
        <p
            className="text-4xl md:text-5xl inline-block"
            style={{
                fontFamily: "var(--font-moon-time)",
                color: "#7B3F00",
            }}
        >
            {text}
            <span className="animate-blink-twice opacity-100">|</span>
        </p>
    </div>
  );
}
