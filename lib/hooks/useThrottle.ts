// Client-side rate limiting for game actions
// Prevents spamming and reduces unnecessary API calls

import { useRef, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

type ThrottledFunction<T extends AnyFunction> = (
  ...args: Parameters<T>
) => ReturnType<T> | undefined;

export function useThrottle(delay: number = 1000): <T extends AnyFunction>(
  fn: T
) => ThrottledFunction<T> {
  const lastCallTime = useRef<number>(0);

  const throttle = useCallback(
    <T extends AnyFunction>(fn: T): ThrottledFunction<T> => {
      return (...args: Parameters<T>): ReturnType<T> | undefined => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime.current;

        if (timeSinceLastCall >= delay) {
          // Execute immediately if enough time has passed
          lastCallTime.current = now;
          return fn(...args);
        }

        // Throttled: action ignored
        return undefined;
      };
    },
    [delay]
  );

  return throttle;
}

// Hook for debouncing (waits for user to stop acting)
export function useDebounce(delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    <T extends AnyFunction>(fn: T) => {
      return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    },
    [delay]
  );

  return debounce;
}
