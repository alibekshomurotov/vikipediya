import React from 'react';

const detailContainerStyle = {
  background: 'white',
  borderRadius: '30px',
  padding: '40px',
  marginTop: '20px',
  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
  animation: 'fadeIn 0.5s ease-out'
};

const backButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '50px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '30px',
  transition: 'all 0.3s ease'
};

const headerStyle = {
  display: 'flex',
  gap: '40px',
  marginBottom: '40px',
  flexWrap: 'wrap'
};

const imageStyle = {
  width: '280px',
  height: '280px',
  objectFit: 'cover',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
};

const infoStyle = {
  flex: 1
};

const nameStyle = {
  fontSize: '2.5rem',
  color: '#2d3748',
  marginBottom: '10px',
  fontFamily: 'Georgia, serif'
};

const originalNameStyle = {
  fontSize: '1.1rem',
  color: '#a0aec0',
  marginBottom: '20px',
  fontStyle: 'italic'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '15px',
  marginBottom: '30px'
};

const infoCardStyle = {
  background: '#f7fafc',
  padding: '15px',
  borderRadius: '15px',
  transition: 'transform 0.3s ease'
};

const infoLabelStyle = {
  fontWeight: '600',
  color: '#667eea',
  marginBottom: '5px',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const infoValueStyle = {
  color: '#2d3748',
  fontSize: '1rem',
  lineHeight: '1.4'
};

const sectionStyle = {
  marginBottom: '30px'
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  color: '#2d3748',
  marginBottom: '15px',
  borderLeft: '4px solid #667eea',
  paddingLeft: '15px'
};

const descriptionStyle = {
  lineHeight: '1.8',
  color: '#4a5568',
  fontSize: '1rem',
  textAlign: 'justify'
};

const listStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  listStyle: 'none'
};

const listItemStyle = {
  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
  padding: '10px 18px',
  borderRadius: '25px',
  fontSize: '0.9rem',
  color: '#667eea',
  fontWeight: '500'
};

const wikiLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  textDecoration: 'none',
  padding: '12px 25px',
  borderRadius: '50px',
  fontWeight: '500',
  marginTop: '20px',
  transition: 'all 0.3s ease'
};

function OlimDetail({ olim, setTanlanganOlim, lang }) {
  return (
    <div style={detailContainerStyle} className="fade-in">
      <button 
        style={backButtonStyle}
        onClick={() => setTanlanganOlim(null)}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        ← {lang === 'uz' ? 'Barcha olimlar' : 'All scientists'}
      </button>
      
      <div style={headerStyle}>
        {olim.image && (
          <img 
            src={olim.image} 
            alt={olim.name}
            style={imageStyle}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/280x280?text=' + encodeURIComponent(olim.name);
            }}
          />
        )}
        
        <div style={infoStyle}>
          <h1 style={nameStyle}>{olim.name}</h1>
          {olim.originalName && olim.originalName !== olim.name && (
            <div style={originalNameStyle}>{olim.originalName}</div>
          )}
          
          <div style={infoGridStyle}>
            {olim.birthDate && (
              <div style={infoCardStyle}>
                <div style={infoLabelStyle}>📅 {lang === 'uz' ? 'Tug\'ilgan' : 'Born'}</div>
                <div style={infoValueStyle}>{olim.birthDate}</div>
              </div>
            )}
            
            {olim.deathDate && (
              <div style={infoCardStyle}>
                <div style={infoLabelStyle}>⚰️ {lang === 'uz' ? 'Vafot etgan' : 'Died'}</div>
                <div style={infoValueStyle}>{olim.deathDate}</div>
              </div>
            )}
            
            {olim.nationality && (
              <div style={infoCardStyle}>
                <div style={infoLabelStyle}>🌍 {lang === 'uz' ? 'Millati' : 'Nationality'}</div>
                <div style={infoValueStyle}>{olim.nationality}</div>
              </div>
            )}
            
            {olim.category && (
              <div style={infoCardStyle}>
                <div style={infoLabelStyle}>🔬 {lang === 'uz' ? 'Soha' : 'Field'}</div>
                <div style={infoValueStyle}>{olim.category}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {olim.fullDescription && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            {lang === 'uz' ? '📖 Tarjimai hol' : '📖 Biography'}
          </h2>
          <div style={descriptionStyle}>{olim.fullDescription}</div>
        </div>
      )}
      
      {olim.knownFor && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            {lang === 'uz' ? '💡 Mashhurligi' : '💡 Known For'}
          </h2>
          <div style={descriptionStyle}>{olim.knownFor}</div>
        </div>
      )}
      
      {olim.discoveries && olim.discoveries.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            {lang === 'uz' ? '🔬 Kashfiyotlari' : '🔬 Discoveries'}
          </h2>
          <ul style={listStyle}>
            {olim.discoveries.map((discovery, idx) => (
              <li key={idx} style={listItemStyle}>✨ {discovery}</li>
            ))}
          </ul>
        </div>
      )}
      
      {olim.awards && olim.awards.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            {lang === 'uz' ? '🏆 Mukofotlari' : '🏆 Awards'}
          </h2>
          <ul style={listStyle}>
            {olim.awards.map((award, idx) => (
              <li key={idx} style={{...listItemStyle, background: '#fef5e7', color: '#d69e2e'}}>🏅 {award}</li>
            ))}
          </ul>
        </div>
      )}
      
      <a 
        href={olim.pageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        style={wikiLinkStyle}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        📖 {lang === 'uz' ? 'Wikipedia\'da to\'liq o\'qish' : 'Read full article on Wikipedia'} →
      </a>
    </div>
  );
}

export default OlimDetail;