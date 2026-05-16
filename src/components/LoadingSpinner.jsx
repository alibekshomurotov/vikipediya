import React from 'react';

const spinnerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px'
};

const spinnerStyle = {
  width: '70px',
  height: '70px',
  border: '4px solid rgba(255,255,255,0.3)',
  borderTop: '4px solid white',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const textStyle = {
  marginTop: '20px',
  color: 'white',
  fontSize: '1.1rem',
  fontWeight: '500'
};

const progressStyle = {
  marginTop: '15px',
  color: 'rgba(255,255,255,0.8)',
  fontSize: '0.9rem'
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function LoadingSpinner({ lang, progress }) {
  return (
    <div style={spinnerContainerStyle}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>
        {lang === 'uz' ? '📡 Ma\'lumotlar yuklanmoqda...' : '📡 Loading data...'}
      </p>
      {progress && progress.total > 0 && (
        <p style={progressStyle}>
          {progress.current} / {progress.total} 
          {lang === 'uz' ? ' ta olim yuklandi' : ' scientists loaded'}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;