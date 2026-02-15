
export type Crop = 
  | 'Wheat' | 'Rice' | 'Maize' | 'Bajra' | 'Jowar' | 'Barley' 
  | 'Sugarcane' | 'Cotton' | 'Soybean' | 'Mustard' | 'Groundnut' | 'Sunflower'
  | 'Tomato' | 'Potato' | 'Onion' | 'Chili' | 'Turmeric' | 'Ginger'
  | 'Banana' | 'Mango' | 'Grapes' | 'Apple' | 'Pomegranate'
  | 'Moong' | 'Urad' | 'Chana';

export type State = 
  | 'Andhra Pradesh' | 'Arunachal Pradesh' | 'Assam' | 'Bihar' | 'Chhattisgarh' 
  | 'Goa' | 'Gujarat' | 'Haryana' | 'Himachal Pradesh' | 'Jharkhand' 
  | 'Karnataka' | 'Kerala' | 'Madhya Pradesh' | 'Maharashtra' | 'Manipur' 
  | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Odisha' | 'Punjab' | 'Rajasthan' 
  | 'Sikkim' | 'Tamil Nadu' | 'Telangana' | 'Tripura' | 'Uttar Pradesh' 
  | 'Uttarakhand' | 'West Bengal';

export type CropStage = 'Sowing' | 'Flowering' | 'Harvest';
export type SoilType = 'Loamy' | 'Sandy' | 'Clay';
export type GrowthStage = 'Sowing' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';
export type EquipmentType = 'Tractor' | 'Harvester' | 'Seeder' | 'Sprayer' | 'Rotavator';

export interface MarketData {
  crop: Crop;
  state: State;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'up' | 'down';
  prices: number[]; // 5-day historical prices
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibilityRules: string[];
  requiredDocuments: string[];
  url: string;
  states?: State[]; // Optional restriction to specific states
}

export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  rainProbability: number;
  city: string;
  icon: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface FertilizerRule {
  crop: Crop;
  n_ha: number;
  p_ha: number;
  k_ha: number;
  timing: string;
  organicAlternative: string;
}

export interface MachineryListing {
  id: string;
  type: EquipmentType;
  model: string;
  owner: string;
  distance: number;
  cost: number;
  status: 'Available' | 'Booked';
  rating: number;
  contact: string;
  location: string;
}
