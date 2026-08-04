import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
};

export function PasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: PasswordInputProps<T>) {
  const t = useTranslations('auth');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="w-full">
          <div className="relative">
            <input
              {...field}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder ?? label}
              className={`w-full rounded-input border bg-surface px-4 py-3.5 pr-12 text-sm text-text placeholder:text-text-secondary outline-none transition ${
                fieldState.error
                  ? 'border-primary focus:border-primary'
                  : 'border-border focus:border-text'
              }`}
            />

            <button
              type="button"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {fieldState.error?.message && (
            <p className="mt-1.5 text-xs text-primary">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
