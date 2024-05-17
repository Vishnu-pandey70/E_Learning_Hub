import React from 'react';

const Progress = ({ value }) => {
    if(value>100) value = 100;
  const getColor = (value) => {
    if (value < 30) {
      return 'red';
    } else if (value >= 30 && value < 70) {
      return 'yellow'; 
    } else {
      return 'green'; 
    }
  };

  const getTextColor = () => {
    if (value < 30) {
        return 'white'; 
      } else if (value >= 30 && value < 70) {
        return 'black'; 
      } else {
        return 'white';
      }
  };

  const progressBarStyles = {
    height: '32px',
    width: `min(max(${value}%, 3%),100%)`,
    minWidth : '40px',
    backgroundColor: getColor(value),
    marginBottom: '25px',
    color: getTextColor(),
  };

  return (
    <div className="progress-container">
      <div className="progress-bar rounded-3" role="progressbar" style={progressBarStyles} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
        {
          value===0? <span className="sr-only p-2">{value}%</span> : <span className="sr-only p-2">{value}% Completed</span> 
        }
      </div>
    </div>
  );
};

export default Progress;
