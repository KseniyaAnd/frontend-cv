'use client';

import { useState } from 'react';
import { Controller, Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

type InputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
  rules?: RegisterOptions<T, FieldPath<T>>;
};

export function Input<T extends FieldValues>({
  control,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  rules,
}: InputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="w-full">
          <div className="relative">
            <input
              {...field}
              id={name}
              type={inputType}
              autoComplete={autoComplete}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? `${name}-error` : undefined}
              className={`w-full rounded-input border bg-surface px-4 py-3.5 text-sm text-text placeholder:text-text-secondary outline-none transition focus:border-text ${
                type === 'password' ? 'pr-12' : ''
              } ${
                fieldState.invalid ? 'border-primary' : 'border-border hover:border-text-secondary'
              }`}
            />

            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-text-secondary hover:text-text"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          {fieldState.error && (
            <p id={`${name}-error`} className="mt-2 text-sm text-primary">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
