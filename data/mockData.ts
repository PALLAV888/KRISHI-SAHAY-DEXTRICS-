
import { MarketData, Scheme, FertilizerRule, State, Crop } from '../types';

export const STATES: State[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

export const CROPS: Crop[] = [
  'Wheat', 'Rice', 'Maize', 'Bajra', 'Jowar', 'Barley', 
  'Sugarcane', 'Cotton', 'Soybean', 'Mustard', 'Groundnut', 'Sunflower',
  'Tomato', 'Potato', 'Onion', 'Chili', 'Turmeric', 'Ginger',
  'Banana', 'Mango', 'Grapes', 'Apple', 'Pomegranate',
  'Moong', 'Urad', 'Chana'
];

// Helper to generate some semi-realistic market data if specific one isn't found
export const getMockMarketData = (crop: Crop, state: State): MarketData => {
  const basePrice = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
  return {
    crop,
    state,
    minPrice: basePrice - 200,
    maxPrice: basePrice + 300,
    modalPrice: basePrice + 50,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    prices: Array.from({ length: 5 }, () => basePrice + Math.floor(Math.random() * 200 - 100))
  };
};

export const MARKET_DATA: MarketData[] = [
  { crop: "Tomato", state: "Maharashtra", minPrice: 1100, maxPrice: 1450, modalPrice: 1350, trend: 'up', prices: [1200, 1250, 1300, 1280, 1350] },
  { crop: "Wheat", state: "Punjab", minPrice: 2050, maxPrice: 2250, modalPrice: 2200, trend: 'up', prices: [2100, 2150, 2125, 2180, 2200] },
  { crop: "Rice", state: "Uttar Pradesh", minPrice: 1750, maxPrice: 1950, modalPrice: 1870, trend: 'down', prices: [1800, 1820, 1850, 1830, 1870] },
  { crop: "Onion", state: "Maharashtra", minPrice: 800, maxPrice: 1100, modalPrice: 950, trend: 'up', prices: [900, 850, 820, 880, 950] },
  { crop: "Cotton", state: "Gujarat", minPrice: 6500, maxPrice: 7500, modalPrice: 7100, trend: 'up', prices: [6800, 6950, 7100, 7050, 7100] },
  { crop: "Sugarcane", state: "Uttar Pradesh", minPrice: 310, maxPrice: 350, modalPrice: 340, trend: 'up', prices: [315, 320, 330, 335, 340] },
];

export const SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'A central sector scheme that provides income support to all landholding farmers families across the country.',
    eligibilityRules: ['Must own cultivable land', 'Farmers with landholding in their names', 'Small and marginal farmers'],
    requiredDocuments: ['Aadhar Card', 'Land Ownership Papers', 'Bank Passbook'],
    url: 'https://pmkisan.gov.in/'
  },
  {
    id: 'pm-fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'An insurance service for farmers for their yields, designed to provide financial support in case of crop failure.',
    eligibilityRules: ['All farmers including sharecroppers and tenant farmers', 'Must be growing notified crops in notified areas'],
    requiredDocuments: ['Land Possession Certificate', 'Sowing Certificate', 'Identity Proof'],
    url: 'https://pmfby.gov.in/'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    description: 'Provides farmers with timely access to credit for their cultivation and other needs as well as post-harvest expenses.',
    eligibilityRules: ['Owner cultivators', 'Tenant farmers, oral lessees & sharecroppers', 'Self Help Groups (SHGs)'],
    requiredDocuments: ['Application Form', 'Identity Proof', 'Address Proof', 'Land Records'],
    url: 'https://www.myscheme.gov.in/schemes/kcc'
  },
  {
    id: 'jalyukt-shivar',
    name: 'Jalyukt Shivar Abhiyan',
    description: 'Water conservation scheme to make the state drought-free.',
    eligibilityRules: ['Farmers in drought-prone villages', 'Landowner in Maharashtra'],
    requiredDocuments: ['7/12 Extract', 'Aadhar Card'],
    url: 'https://mjp.maharashtra.gov.in/',
    states: ['Maharashtra']
  },
  {
    id: 'punjab-debt-waiver',
    name: 'Punjab Crop Loan Waiver Scheme',
    description: 'Financial assistance for debt relief for small and marginal farmers.',
    eligibilityRules: ['Small farmers (2.5 to 5 acres)', 'Marginal farmers (up to 2.5 acres)', 'Punjab Domicile'],
    requiredDocuments: ['Land Ownership Document', 'Bank Certificate'],
    url: 'https://punjab.gov.in/',
    states: ['Punjab']
  }
];

export const FERTILIZER_RULES: FertilizerRule[] = [
  { crop: 'Wheat', n_ha: 120, p_ha: 60, k_ha: 40, timing: 'Basal dose at sowing, followed by top dressing during crown root initiation.', organicAlternative: 'FYM @ 10-15 tonnes/ha.' },
  { crop: 'Rice', n_ha: 100, p_ha: 50, k_ha: 50, timing: 'Split doses: 50% basal, 25% at tillering, 25% at panicle initiation.', organicAlternative: 'Green manuring (Dhaincha).' },
  { crop: 'Tomato', n_ha: 150, p_ha: 100, k_ha: 100, timing: 'Basal application of P and K; N in 3-4 split doses during growth.', organicAlternative: 'Poultry manure or Neem cake.' },
  { crop: 'Onion', n_ha: 100, p_ha: 50, k_ha: 50, timing: '50% N + full P and K at transplanting; remaining N at 30-45 days.', organicAlternative: 'Bio-fertilizers like Azotobacter.' },
  { crop: 'Cotton', n_ha: 100, p_ha: 50, k_ha: 50, timing: '3 splits: Sowing, 45 DAS, 90 DAS.', organicAlternative: 'Vermicompost @ 5 tonnes/ha.' },
  { crop: 'Sugarcane', n_ha: 250, p_ha: 115, k_ha: 115, timing: 'Basal, 30, 60, and 90-120 days after planting.', organicAlternative: 'Press mud or Compost.' },
  { crop: 'Maize', n_ha: 120, p_ha: 60, k_ha: 40, timing: 'Basal + Top dressing at knee high and silking stage.', organicAlternative: 'Bio-fertilizers (Azospirillum).' },
  { crop: 'Soybean', n_ha: 20, p_ha: 80, k_ha: 40, timing: 'Basal dose at sowing.', organicAlternative: 'Rhizobium culture seed treatment.' },
];
