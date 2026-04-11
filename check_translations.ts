
import { pt } from './src/translations/pt';
import { en } from './src/translations/en';
import { es } from './src/translations/es';
import { fr } from './src/translations/fr';
import { de } from './src/translations/de';
import { it } from './src/translations/it';
import { nl } from './src/translations/nl';
import { zh } from './src/translations/zh';
import { he } from './src/translations/he';

const langs = { pt, en, es, fr, de, it, nl, zh, he };
const allKeys = new Set<string>();
Object.values(langs).forEach(lang => {
  Object.keys(lang).forEach(key => allKeys.add(key));
});

Object.entries(langs).forEach(([name, lang]) => {
  const missing = Array.from(allKeys).filter(key => !(key in lang));
  if (missing.length > 0) {
    console.log(`Language ${name} is missing keys: ${missing.join(', ')}`);
  }
});
