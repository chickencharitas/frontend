import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimers = (initialDuration = 30) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  // Update progress whenever currentTime or duration changes
  useEffect(() => {
    const newProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, [currentTime, duration]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now() - (currentTime * 1000);
    
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newTime = Math.min(duration, Math.max(0, elapsed + accumulatedTimeRef.current));
      
      setCurrentTime(newTime);
      
      if (newTime >= duration) {
        setIsRunning(false);
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, duration]);

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      accumulatedTimeRef.current = currentTime;
      setIsRunning(false);
    }
  }, [isRunning, currentTime]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentTime(0);
    accumulatedTimeRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setTimerDuration = useCallback((newDuration) => {
    if (newDuration >= 0) {
      setDuration(newDuration);
      // Adjust currentTime if it exceeds the new duration
      if (currentTime > newDuration) {
        setCurrentTime(newDuration);
      }
    }
  }, [currentTime]);

  const addTime = useCallback((seconds) => {
    setCurrentTime(prev => Math.max(0, prev + seconds));
  }, []); 

  return {
    isRunning,
    currentTime,
    duration,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerDuration,
    addTime,
  };
};

export default useTimers;
