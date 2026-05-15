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

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function LoadingSpinner() {
  return (
    <div style={spinnerContainerStyle}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>📡 Ma'lumotlar yuklanmoqda...</p>
    </div>
  );
}

export default LoadingSpinner;