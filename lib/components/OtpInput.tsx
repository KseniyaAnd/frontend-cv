'use client';

import { useEffect, useRef } from 'react';

type OtpInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
};

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!disabled) {
      inputs.current[0]?.focus();
    }
  }, [disabled]);

  const handleChange = (index: number, input: string) => {
    if (disabled) return;
    if (!/^\\d?$/.test(input)) return;

    const next = [...value];
    next[index] = input;
    onChange(next);

    if (input && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Backspace':
        if (value[index]) {
          const next = [...value];
          next[index] = '';
          onChange(next);
        } else if (index > 0) {
          inputs.current[index - 1]?.focus();
        }
        break;

      case 'ArrowLeft':
        if (index > 0) {
          inputs.current[index - 1]?.focus();
        }
        break;

      case 'ArrowRight':
        if (index < length - 1) {
          inputs.current[index + 1]?.focus();
        }
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();

    const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length);

    if (!pasted) return;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
    onChange(next);

    const focusIndex = Math.min(pasted.length, length - 1);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          value={value[index] ?? ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          className={`h-12 w-12 rounded-input border bg-surface text-center text-xl text-text outline-none transition ${
            error ? 'border-primary' : 'border-border focus:border-primary'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
}
