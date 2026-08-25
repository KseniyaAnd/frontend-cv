import { ReactNode } from 'react';

type IconButtonProps = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

function IconButton({
  children,
  size = 'md',
  onClick,
  ariaLabel,
  className = '',
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`
        flex items-center justify-center
        rounded-full
        bg-background
        text-text-secondary
        transition-colors
        hover:bg-border
        hover:text-text
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default IconButton;
