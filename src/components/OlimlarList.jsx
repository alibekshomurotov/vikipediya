import React from 'react';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '25px',
  marginTop: '20px'
};

const cardStyle = {
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

function OlimlarList({ olimlar, setTanlanganOlim, lang }) {
  // Unikal key yaratish - id va index qo'shilgan
  const uniqueOlimlar = React.useMemo(() => {
    const seen = new Map();
    return olimlar.filter(olim => {
      const key = olim.id || olim.name?.toLowerCase().replace(/\s/g, '_');
      if (seen.has(key)) {
        return false;
      }
      seen.set(key, true);
      return true;
    });
  }, [olimlar]);

  if (uniqueOlimlar.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>🔍 {lang === 'uz' ? 'Hech qanday olim topilmadi' : 'No scientists found'}</h3>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {uniqueOlimlar.map((olim, index) => (
        <div
          key={`${olim.id || olim.name}-${index}`}
          style={cardStyle}
          onClick={() => setTanlanganOlim(olim)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
        >
          {olim.image && (
            <img 
              src={olim.image} 
              alt={olim.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(olim.name);
              }}
            />
          )}
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{olim.name}</h3>
            <div style={{ color: '#667eea', fontSize: '0.85rem', marginBottom: '10px' }}>
              {olim.category || 'Olim'}
            </div>
            <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {olim.description?.substring(0, 100)}...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OlimlarList;