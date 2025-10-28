import { useState, useEffect, useCallback } from 'react';

export interface UseResendCountdownReturn {
  countdown: number;
  canResend: boolean;
  startCountdown: (seconds?: number) => void;
  resetCountdown: () => void;
}

export const useResendCountdown = (defaultSeconds: number = 60): UseResendCountdownReturn => {
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;

    if (countdown > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdown]);

  const startCountdown = useCallback((seconds: number = defaultSeconds) => {
    setCountdown(seconds);
    setCanResend(false);
  }, [defaultSeconds]);

  const resetCountdown = useCallback(() => {
    setCountdown(0);
    setCanResend(true);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  return {
    countdown,
    canResend,
    startCountdown,
    resetCountdown,
  };
};

export default useResendCountdown;
