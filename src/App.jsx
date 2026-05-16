import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Qidiruv from './components/Qidiruv';
import OlimlarList from './components/OlimlarList';
import OlimDetail from './components/OlimDetail';
import LoadingSpinner from './components/LoadingSpinner';
import { getAllScientists, searchScientists, searchExactScientist } from './api/wikipediaAPI';
import './App.css';

function App() {
  const [olimlar, setOlimlar] = useState([]);
  const [filterlanganOlimlar, setFilterlanganOlimlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qidiruvMatni, setQidiruvMatni] = useState('');
  const [tanlanganOlim, setTanlanganOlim] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [lang, setLang] = useState('uz');
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Boshlang'ich olimlarni yuklash (API dan)
  useEffect(() => {
    fetchInitialScientists();
  }, []);

  // Qidiruv matni o'zgarganda
  useEffect(() => {
    if (!searchMode && qidiruvMatni.trim() === '') {
      setFilterlanganOlimlar(olimlar);
    }
  }, [qidiruvMatni, olimlar, searchMode]);

  const fetchInitialScientists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllScientists((current, total) => {
        setProgress({ current, total });
      });
      setOlimlar(data);
      setFilterlanganOlimlar(data);
      console.log(`${data.length} ta olim yuklandi`);
    } catch (err) {
      setError(lang === 'uz' 
        ? 'Ma\'lumotlarni yuklashda xatolik yuz berdi. Internet aloqangizni tekshiring.'
        : 'Error loading data. Please check your internet connection.');
      console.error('Xato:', err);
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleSearch = async () => {
    if (!qidiruvMatni.trim()) {
      if (searchMode) {
        resetSearch();
      }
      return;
    }
    
    setSearchMode(true);
    setLoading(true);
    setError(null);
    
    try {
      // Avval aniq olimni qidirish (Ibn Sino, Beruniy va boshqalar uchun)
      const exactMatch = await searchExactScientist(qidiruvMatni);
      
      if (exactMatch && exactMatch.extract && exactMatch.extract.length > 50) {
        // Aniq olim topildi
        const olim = {
          id: exactMatch.title?.toLowerCase().replace(/\s/g, '_') || qidiruvMatni.toLowerCase().replace(/\s/g, '_'),
          name: exactMatch.title || qidiruvMatni,
          originalName: exactMatch.title,
          category: getCategoryFromText(exactMatch.extract),
          description: exactMatch.extract.substring(0, 300),
          fullDescription: exactMatch.extract,
          image: exactMatch.thumbnail,
          pageUrl: exactMatch.pageUrl
        };
        setFilterlanganOlimlar([olim]);
      } else {
        // API orqali umumiy qidiruv
        const results = await searchScientists(qidiruvMatni);
        
        if (results && results.length > 0) {
          setFilterlanganOlimlar(results);
        } else {
          setFilterlanganOlimlar([]);
          setError(lang === 'uz' 
            ? `"${qidiruvMatni}" bo'yicha hech qanday olim topilmadi.`
            : `No scientists found for "${qidiruvMatni}".`);
        }
      }
    } catch (err) {
      console.error('Qidiruv xatosi:', err);
      setError(lang === 'uz' 
        ? 'Qidiruvda xatolik yuz berdi. Qayta urinib ko\'ring.'
        : 'Search error. Please try again.');
      setFilterlanganOlimlar([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromText = (text) => {
    if (!text) return 'Olim';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('physicist') || lowerText.includes('physics')) return 'Fizik';
    if (lowerText.includes('chemist') || lowerText.includes('chemistry')) return 'Kimyogar';
    if (lowerText.includes('biologist') || lowerText.includes('biology')) return 'Biolog';
    if (lowerText.includes('mathematician') || lowerText.includes('mathematics')) return 'Matematik';
    if (lowerText.includes('astronomer') || lowerText.includes('astronomy')) return 'Astronom';
    if (lowerText.includes('inventor')) return 'Ixtirochi';
    if (lowerText.includes('philosopher')) return 'Faylasuf';
    if (lowerText.includes('physician') || lowerText.includes('medicine')) return 'Tabib';
    return 'Olim';
  };

  const resetSearch = () => {
    setQidiruvMatni('');
    setSearchMode(false);
    setFilterlanganOlimlar(olimlar);
    setError(null);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'uz' ? 'en' : 'uz');
    setTanlanganOlim(null);
    setSearchMode(false);
    setQidiruvMatni('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Progress bar komponenti
  const ProgressBar = () => {
    if (progress.total === 0) return null;
    const percent = (progress.current / progress.total) * 100;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: '#e2e8f0',
        zIndex: 9999
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>
    );
  };

  if (error && !loading && olimlar.length === 0 && !searchMode) {
    return (
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <ProgressBar />
        <Header 
          lang={lang} 
          toggleLanguage={toggleLanguage}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="container">
          <div className="error-message">
            <h2>⚠️ {lang === 'uz' ? 'Xatolik' : 'Error'}</h2>
            <p>{error}</p>
            <button onClick={fetchInitialScientists} className="retry-btn">
              🔄 {lang === 'uz' ? 'Qayta urunish' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <ProgressBar />
      <Header 
        lang={lang} 
        toggleLanguage={toggleLanguage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="container">
        <Qidiruv 
          qidiruvMatni={qidiruvMatni} 
          setQidiruvMatni={setQidiruvMatni}
          olimlarSoni={filterlanganOlimlar.length}
          onSearch={handleSearch}
          onReset={resetSearch}
          searchMode={searchMode}
          lang={lang}
        />
        
        {loading ? (
          <LoadingSpinner lang={lang} progress={progress} />
        ) : tanlanganOlim ? (
          <OlimDetail 
            olim={tanlanganOlim} 
            setTanlanganOlim={setTanlanganOlim}
            lang={lang}
          />
        ) : (
          <>
            {searchMode && (
              <div className={`search-info ${darkMode ? 'dark' : ''}`}>
                <p>
                  {lang === 'uz' 
                    ? `🔍 "${qidiruvMatni}" bo'yicha qidiruv natijalari: ${filterlanganOlimlar.length} ta topildi`
                    : `🔍 Search results for "${qidiruvMatni}": ${filterlanganOlimlar.length} found`}
                </p>
                <button onClick={resetSearch} className="reset-search-btn">
                  {lang === 'uz' ? '📋 Barcha olimlarni ko\'rsatish' : '📋 Show all scientists'}
                </button>
              </div>
            )}
            
            {filterlanganOlimlar.length === 0 && !loading && searchMode ? (
              <div className="no-results">
                <h3>🔍 {lang === 'uz' ? 'Hech qanday olim topilmadi' : 'No scientists found'}</h3>
                <p>
                  {lang === 'uz' 
                    ? `"${qidiruvMatni}" bo'yicha hech qanday natija topilmadi. Iltimos, boshqa so'z bilan qidirib ko'ring.`
                    : `No results found for "${qidiruvMatni}". Please try a different search term.`}
                </p>
                <button onClick={resetSearch} className="retry-btn">
                  {lang === 'uz' ? '🔍 Barcha olimlarni ko\'rish' : '🔍 View all scientists'}
                </button>
              </div>
            ) : (
              <OlimlarList 
                olimlar={filterlanganOlimlar} 
                setTanlanganOlim={setTanlanganOlim}
                lang={lang}
              />
            )}
          </>
        )}
      </div>
      
      <footer className={`footer ${darkMode ? 'dark' : ''}`}>
        <div className="container">
          <p>
            {lang === 'uz' 
              ? `📚 ${olimlar.length} ta mashhur olim • Ma'lumotlar Wikipedia API dan olinadi`
              : `📚 ${olimlar.length} famous scientists • Data from Wikipedia API`}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;