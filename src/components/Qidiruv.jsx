import React, { useState, useEffect, useRef } from 'react';

const qidiruvStyle = {
  marginBottom: '30px',
  position: 'relative'
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

const suggestionsStyle = {
  position: 'absolute',
  top: '70px',
  left: 0,
  right: 0,
  background: 'white',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  zIndex: 1000,
  maxHeight: '300px',
  overflowY: 'auto'
};

const suggestionItemStyle = {
  padding: '12px 20px',
  cursor: 'pointer',
  borderBottom: '1px solid #e2e8f0',
  transition: 'background 0.2s'
};

const resultCountStyle = {
  marginTop: '12px',
  textAlign: 'center',
  color: 'white',
  fontSize: '14px',
  opacity: 0.9
};

const tipStyle = {
  marginTop: '8px',
  textAlign: 'center',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '12px'
};

function Qidiruv({ qidiruvMatni, setQidiruvMatni, olimlarSoni, onSearch, onReset, searchMode, lang }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Qidiruv takliflari (faqat olimlar)
  const scientistSuggestions = [
    'Albert Einstein', 'Nikola Tesla', 'Isaac Newton', 'Galileo Galilei',
    'Marie Curie', 'Charles Darwin', 'Stephen Hawking', 'Thomas Edison',
    'Michael Faraday', 'Alan Turing', 'Louis Pasteur', 'Archimedes'
  ];

  useEffect(() => {
    if (qidiruvMatni.length > 1) {
      const filtered = scientistSuggestions.filter(s => 
        s.toLowerCase().includes(qidiruvMatni.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [qidiruvMatni]);

  const handleSuggestionClick = (suggestion) => {
    setQidiruvMatni(suggestion);
    setShowSuggestions(false);
    onSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    onSearch();
    setShowSuggestions(false);
  };

  return (
    <div style={qidiruvStyle}>
      <div style={inputWrapperStyle}>
        <input
          ref={inputRef}
          type="text"
          placeholder={lang === 'uz' 
            ? '🔍 Olim nomi bo\'yicha qidirish (masalan: Nikola Tesla, Albert Einstein)...' 
            : '🔍 Search by scientist name (e.g., Nikola Tesla, Albert Einstein)...'}
          value={qidiruvMatni}
          onChange={(e) => setQidiruvMatni(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => qidiruvMatni.length > 1 && setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
        <button 
          style={searchButtonStyle}
          onClick={handleSearchClick}
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
        
        {showSuggestions && suggestions.length > 0 && (
          <div style={suggestionsStyle}>
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                style={suggestionItemStyle}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                🔬 {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={resultCountStyle}>
        {searchMode 
          ? (lang === 'uz' ? `🔍 ${olimlarSoni} ta olim topildi` : `🔍 ${olimlarSoni} scientists found`)
          : (lang === 'uz' ? `📚 ${olimlarSoni} ta mashhur olim` : `📚 ${olimlarSoni} famous scientists`)}
      </div>
      
      <div style={tipStyle}>
        💡 {lang === 'uz' 
          ? 'Maslahat: Olimning to\'liq ismini kiriting (Einstein, Tesla, Newton)'
          : 'Tip: Enter full scientist name (Einstein, Tesla, Newton)'}
      </div>
    </div>
  );
}

export default Qidiruv;