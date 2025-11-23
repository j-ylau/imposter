'use client';

import { HTMLAttributes, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/util';

type SafeModalAttributes = Omit<
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

interface ModalProps extends SafeModalAttributes {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'relative bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors',
              className
            )}
            {...props}
          >
            {title && (
              <div className="px-6 py-4 border-b border-border transition-colors">
                <h2 className="text-xl font-bold text-fg">{title}</h2>
              </div>
            )}
            <div className="px-6 py-4 text-fg">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
