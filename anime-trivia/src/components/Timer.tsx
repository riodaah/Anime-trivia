import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

interface Props {
  onTimeUp: () => void;
  timerKey: number;
}

const Timer: React.FC<Props> = ({ onTimeUp, timerKey }) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    setTimeLeft(15);
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, timerKey]);

  const progress = (timeLeft / 15) * 100;

  return (
    <div className="timer my-3">
        <ProgressBar now={progress} label={`${timeLeft}s`} variant="info" style={{ height: '30px', fontSize: '16px' }} />
    </div>
  );
};

export default Timer;
