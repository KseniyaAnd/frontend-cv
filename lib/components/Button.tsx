import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'ghost';
};

export function Button({
  children,
  loading = false,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'flex h-12 items-center justify-center rounded-button text-sm font-bold uppercase tracking-wider transition';

  const variants = {
    primary:
      'w-60 bg-primary text-primary-contrast hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
    ghost: 'text-xs text-text-secondary hover:text-text disabled:opacity-50',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
}
