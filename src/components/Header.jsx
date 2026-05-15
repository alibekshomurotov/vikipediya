import React from 'react';

const headerStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  color: 'white',
  padding: '30px 0',
  textAlign: 'center',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
};

const titleStyle = {
  fontSize: '2.5rem',
  marginBottom: '10px',
  fontFamily: 'Georgia, serif',
  letterSpacing: '2px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
};

const subtitleStyle = {
  fontSize: '1.1rem',
  opacity: 0.95,
  marginBottom: '20px'
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginTop: '15px'
};

const buttonStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: '8px 20px',
  borderRadius: '25px',
  cursor: 'pointer',
  color: 'white',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease'
};

function Header({ lang, toggleLanguage, darkMode, toggleDarkMode }) {
  return (
    <header style={headerStyle}>
      <div className="container">
        <h1 style={titleStyle}>
          {lang === 'uz' ? '🔬 Mashhur Olimlar Ensiklopediyasi' : '🔬 Encyclopedia of Famous Scientists'}
        </h1>
        <p style={subtitleStyle}>
          {lang === 'uz' 
            ? 'Dunyoning eng buyuk olimlari haqida to\'liq ma\'lumot' 
            : 'Complete information about the world\'s greatest scientists'}
        </p>
        <div style={controlsStyle}>
          <button 
            style={buttonStyle}
            onClick={toggleLanguage}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            {lang === 'uz' ? '🌐 English' : '🌐 O\'zbekcha'}
          </button>
          <button 
            style={buttonStyle}
            onClick={toggleDarkMode}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;