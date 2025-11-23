'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/util';

type SafeHTMLAttributes = Omit<
  HTMLAttributes<HTMLDivElement>,
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

interface CardProps extends SafeHTMLAttributes {
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'rounded-xl transition-all duration-200',
          {
            'bg-card': variant === 'default',
            'bg-card-elevated shadow-lg hover:shadow-xl': variant === 'elevated',
            'bg-card border-2 border-border': variant === 'bordered',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-border transition-colors', className)}
      {...props}
    />
  );
});

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    />
  );
});

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-border transition-colors', className)}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';
