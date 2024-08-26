import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (endTime: number): TimeLeft => {
  const total = endTime - new Date().getTime();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const daysLeft = Math.floor(total / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutesLeft = Math.floor((total / (1000 * 60)) % 60);
  const secondsLeft = Math.floor((total / 1000) % 60);

  return {
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  };
};

const useTimer = (startTime: string, endTime: string) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVotingAllowed, setIsVotingAllowed] = useState(true);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    // Check if dates are valid
    if (isNaN(start) || isNaN(end)) {
      console.error("Invalid date", { startTime, endTime });
      return;
    }

    if (new Date().getTime() < start) {
      setIsVotingAllowed(false);
      return;
    } else {
      setIsVotingAllowed(true);
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(end);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days <= 0 &&
        newTimeLeft.hours <= 0 &&
        newTimeLeft.minutes <= 0 &&
        newTimeLeft.seconds <= 0
      ) {
        clearInterval(timer);
        setIsVotingAllowed(false); // Disable voting after time is up
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return { timeLeft, isVotingAllowed };
};

export default useTimer;
