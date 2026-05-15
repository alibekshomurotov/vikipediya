import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Qidiruv from './components/Qidiruv';
import OlimlarList from './components/OlimlarList';
import OlimDetail from './components/OlimDetail';
import LoadingSpinner from './components/LoadingSpinner';
import { getOlimlar, searchWikipedia } from './api/wikipediaAPI';
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

  // Til o'zgarganda ma'lumotlarni qayta yuklash
  useEffect(() => {
    fetchOlimlar();
  }, [lang]);

  useEffect(() => {
    if (qidiruvMatni.trim() === '' && !searchMode) {
      setFilterlanganOlimlar(olimlar);
    } else if (qidiruvMatni.trim() !== '') {
      const timer = setTimeout(() => {
        if (qidiruvMatni.trim()) handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [qidiruvMatni, olimlar]);

  const fetchOlimlar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOlimlar(lang);
      setOlimlar(data);
      setFilterlanganOlimlar(data);
    } catch (err) {
      setError(lang === 'uz' ? 'Ma\'lumotlarni yuklashda xatolik yuz berdi.' : 'Error loading data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (qidiruvMatni.trim() === '') return;
    setSearchMode(true);
    setLoading(true);
    try {
      const results = await searchWikipedia(qidiruvMatni, lang);
      setFilterlanganOlimlar(results);
    } catch (err) {
      console.error('Qidiruv xatosi:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setQidiruvMatni('');
    setSearchMode(false);
    setFilterlanganOlimlar(olimlar);
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

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
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
          <LoadingSpinner />
        ) : tanlanganOlim ? (
          <OlimDetail 
            olim={tanlanganOlim} 
            setTanlanganOlim={setTanlanganOlim}
            lang={lang}
          />
        ) : (
          <>
            {searchMode && (
              <div className="search-info glass-effect">
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
            <OlimlarList 
              olimlar={filterlanganOlimlar} 
              setTanlanganOlim={setTanlanganOlim}
              lang={lang}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;