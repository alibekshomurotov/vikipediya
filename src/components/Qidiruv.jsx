import React from 'react';

const qidiruvStyle = {
  marginBottom: '30px'
};

const inputWrapperStyle = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap'
};

const inputStyle = {
  flex: 1,
  padding: '18px 25px',
  fontSize: '16px',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '50px',
  outline: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)'
};

const searchButtonStyle = {
  padding: '18px 35px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
};

const resultCountStyle = {
  marginTop: '12px',
  textAlign: 'center',
  color: 'white',
  fontSize: '14px',
  opacity: 0.9
};

function Qidiruv({ qidiruvMatni, setQidiruvMatni, olimlarSoni, onSearch, onReset, searchMode, lang }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div style={qidiruvStyle}>
      <div style={inputWrapperStyle}>
        <input
          type="text"
          placeholder={lang === 'uz' 
            ? '🔍 Olim nomi bo\'yicha qidirish (masalan: Nikola Tesla, Albert Einstein)...' 
            : '🔍 Search by scientist name (e.g., Nikola Tesla, Albert Einstein)...'}
          value={qidiruvMatni}
          onChange={(e) => setQidiruvMatni(e.target.value)}
          onKeyPress={handleKeyPress}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
        <button 
          style={searchButtonStyle}
          onClick={onSearch}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          {lang === 'uz' ? '🔍 Qidirish' : '🔍 Search'}
        </button>
      </div>
      <div style={resultCountStyle}>
        {searchMode 
          ? (lang === 'uz' ? `${olimlarSoni} ta natija topildi` : `${olimlarSoni} results found`)
          : (lang === 'uz' ? `${olimlarSoni} ta mashhur olim` : `${olimlarSoni} famous scientists`)}
      </div>
    </div>
  );
}

export default Qidiruv;