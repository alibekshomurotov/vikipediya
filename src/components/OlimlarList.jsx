import React from 'react';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const cardStyle = {
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative'
};

const imageContainerStyle = {
  position: 'relative',
  height: '250px',
  overflow: 'hidden'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease'
};

const categoryBadgeStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '5px 15px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '600',
  zIndex: 1
};

const cardContentStyle = {
  padding: '20px'
};

const titleStyle = {
  fontSize: '1.4rem',
  marginBottom: '8px',
  color: '#2d3748',
  fontFamily: 'Georgia, serif'
};

const originalNameStyle = {
  fontSize: '0.85rem',
  color: '#a0aec0',
  marginBottom: '12px',
  fontStyle: 'italic'
};

const descriptionStyle = {
  fontSize: '0.9rem',
  color: '#4a5568',
  lineHeight: '1.5',
  marginBottom: '15px',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid #e2e8f0'
};

const readMoreStyle = {
  color: '#667eea',
  fontWeight: '600',
  fontSize: '0.85rem'
};

function OlimlarList({ olimlar, setTanlanganOlim, lang }) {
  const handleCardHover = (e, isHovering, imageElement) => {
    const card = e.currentTarget;
    if (isHovering) {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 30px 50px rgba(0,0,0,0.2)';
      if (imageElement) {
        imageElement.style.transform = 'scale(1.1)';
      }
    } else {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      if (imageElement) {
        imageElement.style.transform = 'scale(1)';
      }
    }
  };

  if (olimlar.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🔍 {lang === 'uz' ? 'Hech qanday olim topilmadi' : 'No scientists found'}</h3>
        <p style={{ color: '#718096' }}>
          {lang === 'uz' ? 'Iltimos, qidiruv so\'zini o\'zgartiring' : 'Please change your search term'}
        </p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {olimlar.map(olim => (
        <div
          key={olim.id}
          style={cardStyle}
          onClick={() => setTanlanganOlim(olim)}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('.card-image');
            handleCardHover(e, true, img);
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('.card-image');
            handleCardHover(e, false, img);
          }}
          className="fade-in"
        >
          <div style={imageContainerStyle}>
            {olim.category && (
              <div style={categoryBadgeStyle}>{olim.category}</div>
            )}
            <img 
              src={olim.image} 
              alt={olim.name}
              style={imageStyle}
              className="card-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(olim.name);
              }}
            />
          </div>
          <div style={cardContentStyle}>
            <h3 style={titleStyle}>{olim.name}</h3>
            {olim.originalName && olim.originalName !== olim.name && (
              <div style={originalNameStyle}>{olim.originalName}</div>
            )}
            <div style={descriptionStyle}>
              {olim.description || (lang === 'uz' ? 'Ma\'lumot mavjud emas' : 'No information available')}
            </div>
            <div style={infoRowStyle}>
              {olim.nationality && (
                <span style={{ fontSize: '0.8rem', color: '#718096' }}>🌍 {olim.nationality}</span>
              )}
              <span style={readMoreStyle}>
                {lang === 'uz' ? 'Batafsil →' : 'Read more →'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OlimlarList;