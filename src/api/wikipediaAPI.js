import axios from 'axios';

// O'zbek tili uchun Wikipedia API
const WIKI_API_URL = 'https://uz.wikipedia.org/w/api.php';
const WIKI_API_URL_EN = 'https://en.wikipedia.org/w/api.php';

// 30 ta eng mashhur olim (tez yuklash uchun)
export const scientistNames = [
  // Fiziklar (8 ta)
  'Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla',
  'Stephen Hawking', 'Niels Bohr', 'Richard Feynman', 'Michael Faraday',
  
  // Matematiklar (5 ta)
  'Archimedes', 'Pythagoras', 'Leonhard Euler', 'Alan Turing', 'Ada Lovelace',
  
  // Kimyogarlar (4 ta)
  'Marie Curie', 'Dmitri Mendeleev', 'Louis Pasteur', 'Alfred Nobel',
  
  // Biologlar (5 ta)
  'Charles Darwin', 'Gregor Mendel', 'Alexander Fleming', 'Francis Crick', 'James Watson',
  
  // Astronomlar (3 ta)
  'Johannes Kepler', 'Nicolaus Copernicus', 'Edwin Hubble',
  
  // Ixtirochilar (3 ta)
  'Thomas Edison', 'Alexander Graham Bell', 'Leonardo da Vinci',
  
  // Sharq allomalari (5 ta)
  'Avicenna', 'Al-Biruni', 'Al-Khwarizmi', 'Al-Farabi', 'Omar Khayyam'
];

// Takrorlanishlarni olib tashlash
export const uniqueScientists = [...new Map(scientistNames.map(s => [s.toLowerCase(), s])).values()];

// Kechikish funksiyasi (API ni haddan tashqari yuklamaslik uchun)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Sahifa ma'lumotini olish (O'zbek tilida)
export const getWikipediaPage = async (title, useUzbek = true) => {
  try {
    const apiUrl = useUzbek ? WIKI_API_URL : WIKI_API_URL_EN;
    
    const response = await axios.get(apiUrl, {
      params: {
        action: 'query',
        titles: title,
        prop: 'extracts|pageimages',
        exintro: true,
        explaintext: true,
        exlimit: 1,
        exchars: 2500,
        pithumbsize: 400,
        format: 'json',
        origin: '*',
        redirects: 1
      }
    });
    
    const pages = response.data.query?.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1') {
      // O'zbek tilida topilmasa, ingliz tilidan olish
      if (useUzbek) {
        return await getWikipediaPage(title, false);
      }
      return null;
    }
    
    const page = pages[pageId];
    
    if (!page.extract || page.extract.length < 50) {
      if (useUzbek) {
        return await getWikipediaPage(title, false);
      }
      return null;
    }
    
    return {
      title: page.title,
      extract: page.extract || '',
      description: page.extract?.substring(0, 200) || '',
      thumbnail: page.thumbnail?.source || null,
      pageUrl: `https://uz.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, '_'))}`
    };
  } catch (error) {
    if (error.response?.status === 429) {
      await delay(1500);
      return getWikipediaPage(title, useUzbek);
    }
    return null;
  }
};

// Kategoriyani aniqlash
const getCategory = (text, title) => {
  if (!text) return 'Olim';
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('fizik') || lowerText.includes('fizika')) return '⚛️ Fizik';
  if (lowerText.includes('matematik')) return '📐 Matematik';
  if (lowerText.includes('kimyo') || lowerText.includes('kimyogar')) return '🧪 Kimyogar';
  if (lowerText.includes('biolog') || lowerText.includes('biologiya')) return '🔬 Biolog';
  if (lowerText.includes('astronom') || lowerText.includes('astronomiya')) return '🌌 Astronom';
  if (lowerText.includes('ixtiro') || lowerText.includes('ixtirochi')) return '💡 Ixtirochi';
  if (lowerText.includes('tabib') || lowerText.includes('tibbiyot')) return '💊 Tabib';
  if (lowerText.includes('faylasuf')) return '📖 Faylasuf';
  
  return '🔬 Olim';
};

// Barcha olimlarni yuklash (30 ta)
export const getAllScientists = async (onProgress) => {
  const targetCount = 30;
  const results = [];
  const processedNames = new Set();
  
  console.log(`🚀 ${targetCount} ta eng mashhur olim yuklanmoqda...`);
  
  for (let i = 0; i < uniqueScientists.length && results.length < targetCount; i++) {
    const name = uniqueScientists[i];
    
    if (processedNames.has(name.toLowerCase())) continue;
    processedNames.add(name.toLowerCase());
    
    try {
      const pageData = await getWikipediaPage(name, true);
      
      if (pageData && pageData.extract && pageData.extract.length > 50) {
        results.push({
          id: name.toLowerCase().replace(/\s/g, '_'),
          name: name,
          category: getCategory(pageData.extract, name),
          description: pageData.description || pageData.extract.substring(0, 180),
          fullDescription: pageData.extract,
          image: pageData.thumbnail,
          pageUrl: pageData.pageUrl
        });
        console.log(`✅ ${results.length}/${targetCount} - ${name}`);
      } else {
        console.log(`⚠️ ${name} - o'tkazib yuborildi`);
      }
      
      if (onProgress) {
        onProgress(results.length, targetCount);
      }
      
      // API ni haddan tashqari yuklamaslik uchun kechikish (500ms)
      await delay(500);
      
    } catch (err) {
      console.log(`❌ ${name} - xato`);
    }
  }
  
  console.log(`📊 Jami ${results.length} ta olim yuklandi!`);
  return results;
};

// Qidiruv funksiyasi
export const searchScientists = async (query) => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const searchResponse = await axios.get(WIKI_API_URL, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
        srlimit: 8
      }
    });
    
    const results = [];
    for (const result of searchResponse.data.query?.search || []) {
      const pageData = await getWikipediaPage(result.title, true);
      if (pageData && pageData.extract) {
        results.push({
          id: result.pageid,
          name: result.title,
          category: getCategory(pageData.extract, result.title),
          description: pageData.extract.substring(0, 200),
          fullDescription: pageData.extract,
          image: pageData.thumbnail,
          pageUrl: pageData.pageUrl
        });
      }
      await delay(300);
    }
    
    return results;
  } catch (error) {
    console.error('Qidiruv xatosi:', error);
    return [];
  }
};

// Aniq olimni qidirish
export const searchExactScientist = async (query) => {
  if (!query || query.trim().length < 2) return null;
  
  try {
    const pageData = await getWikipediaPage(query, true);
    if (pageData && pageData.extract && pageData.extract.length > 50) {
      return {
        title: pageData.title,
        extract: pageData.extract,
        thumbnail: pageData.thumbnail,
        pageUrl: pageData.pageUrl
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default {
  getAllScientists,
  searchScientists,
  searchExactScientist,
  uniqueScientists
};  