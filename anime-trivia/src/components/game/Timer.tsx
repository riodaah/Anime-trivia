import React, { useState, useEffect } from 'react';

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
    <div className="my-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Tiempo restante</span>
        <span className="text-lg font-bold text-blue-400">{timeLeft}s</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;




