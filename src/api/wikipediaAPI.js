import axios from 'axios';

// Wikipedia API
const WIKI_SEARCH_URL = 'https://{lang}.wikipedia.org/w/api.php';

// Mashhur olimlarning ro'yxati (kengaytirilgan)
export const mashhurOlimlar = [
  { name: 'Albert Einstein', nameUz: 'Albert Eynshteyn', category: 'Fizik' },
  { name: 'Nikola Tesla', nameUz: 'Nikola Tesla', category: 'Ixtirochi' },
  { name: 'Isaac Newton', nameUz: 'Isaak Nyuton', category: 'Fizik, Matematik' },
  { name: 'Galileo Galilei', nameUz: 'Galileo Galiley', category: 'Astronom, Fizik' },
  { name: 'Marie Curie', nameUz: 'Mari Kyuri', category: 'Kimyogar, Fizik' },
  { name: 'Charles Darwin', nameUz: 'Charlz Darvin', category: 'Biolog' },
  { name: 'Alan Turing', nameUz: 'Alan Tyuring', category: 'Kompyuter olimi' },
  { name: 'Stephen Hawking', nameUz: 'Stiven Xoking', category: 'Fizik, Kosmolog' },
  { name: 'Thomas Edison', nameUz: 'Tomas Edison', category: 'Ixtirochi' },
  { name: 'Michael Faraday', nameUz: 'Maykl Faraday', category: 'Fizik, Kimyogar' },
  { name: 'Richard Feynman', nameUz: 'Richard Feynman', category: 'Fizik' },
  { name: 'Niels Bohr', nameUz: 'Nils Bor', category: 'Fizik' },
  { name: 'Werner Heisenberg', nameUz: 'Verner Geyzenberg', category: 'Fizik' },
  { name: 'Max Planck', nameUz: 'Maks Plank', category: 'Fizik' },
  { name: 'Louis Pasteur', nameUz: 'Lui Paster', category: 'Biolog, Kimyogar' },
  { name: 'Alexander Graham Bell', nameUz: 'Aleksandr Grem Bell', category: 'Ixtirochi' },
  { name: 'Ada Lovelace', nameUz: 'Ada Lavleys', category: 'Matematik' },
  { name: 'Archimedes', nameUz: 'Arximed', category: 'Matematik, Fizik' },
  { name: 'Pythagoras', nameUz: 'Pifagor', category: 'Matematik, Faylasuf' },
  { name: 'Aristotle', nameUz: 'Aristotel', category: 'Faylasuf, Olim' }
];

// Tilga qarab API URL olish
const getApiUrl = (lang = 'en') => {
  return WIKI_SEARCH_URL.replace('{lang}', lang);
};

// Sahifa ma'lumotini olish (to'liq)
export const getWikipediaPage = async (title, lang = 'en') => {
  try {
    const response = await axios.get(getApiUrl(lang), {
      params: {
        action: 'query',
        titles: title,
        prop: 'extracts|pageimages|images|info',
        exintro: false,
        exlimit: 1,
        explaintext: true,
        exsectionformat: 'plain',
        pithumbsize: 500,
        pilimit: 1,
        format: 'json',
        origin: '*'
      }
    });
    
    const pages = response.data.query?.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1') {
      throw new Error('Sahifa topilmadi');
    }
    
    const page = pages[pageId];
    
    // Qo'shimcha rasmlarni olish
    let imageUrl = page.thumbnail?.source || null;
    
    if (!imageUrl) {
      imageUrl = await getPageImage(title, lang);
    }
    
    return {
      title: page.title,
      extract: page.extract || '',
      description: page.extract?.substring(0, 300) || '',
      thumbnail: imageUrl,
      pageId: page.pageid,
      fullUrl: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, '_'))}`
    };
  } catch (error) {
    console.error(`Wikipedia xato (${title}):`, error);
    return null;
  }
};

// Sahifaning asosiy rasmini olish
const getPageImage = async (title, lang = 'en') => {
  try {
    const response = await axios.get(getApiUrl(lang), {
      params: {
        action: 'query',
        titles: title,
        prop: 'pageimages',
        pithumbsize: 500,
        format: 'json',
        origin: '*'
      }
    });
    
    const pages = response.data.query?.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId]?.thumbnail?.source || null;
  } catch (error) {
    return null;
  }
};

// Barcha olimlarni olish (ko'p tilli)
export const getOlimlar = async (lang = 'en') => {
  try {
    const olimlarData = await Promise.all(
      mashhurOlimlar.map(async (olim) => {
        try {
          const searchTitle = lang === 'uz' ? olim.nameUz : olim.name;
          const pageData = await getWikipediaPage(olim.name, lang);
          
          // Agar Uzbek tilida topilmasa, Ingliz tilidan olish
          let finalData = pageData;
          if (lang === 'uz' && (!pageData || !pageData.extract)) {
            const enData = await getWikipediaPage(olim.name, 'en');
            finalData = enData;
          }
          
          return {
            id: olim.name.toLowerCase().replace(/\s/g, '_'),
            name: lang === 'uz' ? olim.nameUz : olim.name,
            originalName: olim.name,
            category: olim.category,
            description: finalData?.description || `${olim.name} - mashhur olim`,
            fullDescription: finalData?.extract || '',
            image: finalData?.thumbnail || getDefaultImage(olim.name),
            birthDate: extractInfo(finalData?.extract || '', 'birth'),
            deathDate: extractInfo(finalData?.extract || '', 'death'),
            nationality: extractInfo(finalData?.extract || '', 'nationality'),
            knownFor: extractInfo(finalData?.extract || '', 'known_for'),
            awards: extractAwards(finalData?.extract || ''),
            discoveries: extractDiscoveries(finalData?.extract || ''),
            pageUrl: finalData?.fullUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(olim.name.replace(/\s/g, '_'))}`
          };
        } catch (err) {
          return {
            id: olim.name.toLowerCase().replace(/\s/g, '_'),
            name: lang === 'uz' ? olim.nameUz : olim.name,
            originalName: olim.name,
            category: olim.category,
            description: `${olim.name} - mashhur olim`,
            fullDescription: '',
            image: getDefaultImage(olim.name),
            pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(olim.name.replace(/\s/g, '_'))}`
          };
        }
      })
    );
    return olimlarData;
  } catch (error) {
    console.error('API xato:', error);
    throw error;
  }
};

// Default rasm (agar Wikipedia'da rasm topilmasa)
const getDefaultImage = (name) => {
  const defaultImages = {
    'Albert Einstein': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
    'Nikola Tesla': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg',
    'Isaac Newton': 'https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg',
    'Marie Curie': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Marie_Curie_c._1920s.jpg',
    'Stephen Hawking': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking_050506.jpg'
  };
  return defaultImages[name] || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(name);
};

// Ma'lumotlarni ekstraksiya qilish
const extractInfo = (text, type) => {
  if (!text) return '';
  
  const patterns = {
    birth: [/born\s+([^.!]+)/i, /(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/, /(\d{4})/],
    death: [/died\s+([^.!]+)/i, /death[^.]*(\d{4})/i],
    nationality: [/([A-Z][a-z]+)\s+(?:physicist|scientist|inventor)/i, /was\s+an?\s+([A-Z][a-z]+)/i],
    known_for: [/known for\s+([^.!]+)/i, /famous for\s+([^.!]+)/i, /best known for\s+([^.!]+)/i]
  };
  
  const typePatterns = patterns[type];
  if (!typePatterns) return '';
  
  for (const pattern of typePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  return '';
};

const extractAwards = (text) => {
  const awards = [];
  const patterns = [
    /Nobel\s+Prize/i,
    /(?:won|received)\s+the\s+([^.!]+?)(?:prize|medal|award)/i,
    /([A-Z][a-z]+)\s+Medal/i
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(new RegExp(pattern, 'gi'));
    if (matches) {
      matches.forEach(m => awards.push(m));
    }
  }
  return [...new Set(awards)].slice(0, 5);
};

const extractDiscoveries = (text) => {
  const discoveries = [];
  const patterns = [
    /discovered\s+([^.!]+)/i,
    /invented\s+([^.!]+)/i,
    /developed\s+([^.!]+?(?:theory|equation|law))/i,
    /theory of\s+([^.!]+)/i
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(new RegExp(pattern, 'gi'));
    if (matches) {
      matches.forEach(m => discoveries.push(m));
    }
  }
  return [...new Set(discoveries)].slice(0, 5);
};

// Qidiruv funksiyasi
export const searchWikipedia = async (query, lang = 'en') => {
  try {
    const searchResponse = await axios.get(getApiUrl(lang), {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
        srlimit: 20
      }
    });
    
    const searchResults = searchResponse.data.query?.search || [];
    
    const results = await Promise.all(
      searchResults.slice(0, 12).map(async (result) => {
        const pageData = await getWikipediaPage(result.title, lang);
        return {
          id: result.pageid,
          name: result.title,
          description: pageData?.description || result.snippet?.replace(/<[^>]*>/g, '') || '',
          fullDescription: pageData?.extract || '',
          image: pageData?.thumbnail,
          pageUrl: pageData?.fullUrl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/\s/g, '_'))}`
        };
      })
    );
    
    return results;
  } catch (error) {
    console.error('Qidiruv xatosi:', error);
    return [];
  }
};

export default { getOlimlar, searchWikipedia, getWikipediaPage };