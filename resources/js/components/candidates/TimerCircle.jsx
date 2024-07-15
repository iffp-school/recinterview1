import React from 'react';

const TimerCircle = ({ label, time, totalTime }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (time / totalTime) * circumference;

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const getCircleColor = (time, totalTime) => {
        const percentage = time / totalTime;
        if (percentage > 0.5) return '#4caf50'; // green
        if (percentage > 0.25) return '#ffeb3b'; // yellow
        return '#f44336'; // red
    };

    return (
        <div className="flex flex-col items-center">
            <span className="text-white mb-2">{label}</span>
            <svg className="w-24 h-24">
                <circle
                    className="text-gray-300"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-green-500"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1s linear', stroke: getCircleColor(time, totalTime) }}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    className="text-lg text-black"
                >
                    {formatTime(time)}
                </text>
            </svg>
        </div>
    );
};

export default TimerCircle;
