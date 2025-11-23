'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/util';

type SafeButtonHTMLAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

interface ButtonProps extends SafeButtonHTMLAttributes {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', onClick, disabled, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      // Haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-primary-fg hover:bg-primary-hover focus:ring-primary shadow-md hover:shadow-lg':
              variant === 'primary',
            'bg-bg-subtle text-fg hover:bg-border focus:ring-border':
              variant === 'secondary',
            'bg-danger text-primary-fg hover:bg-danger/90 focus:ring-danger shadow-md hover:shadow-lg':
              variant === 'danger',
            'bg-transparent hover:bg-bg-subtle focus:ring-border text-fg-muted':
              variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
