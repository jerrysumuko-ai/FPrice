export interface FuelStation {
  id: string;
  name: string;
  address: string;
  petrolPrice: number;
  dieselPrice: number;
  isOpen: boolean;
  distance: string;
  rating: number;
  lat: number;
  lng: number;
  image: string;
  lastUpdated: string;
}

export const MOCK_STATIONS: FuelStation[] = [
  {
    id: 'mobil-marian',
    name: 'Mobile (Mobile) Marian',
    address: 'Marian Road, Calabar',
    petrolPrice: 650,
    dieselPrice: 1100,
    isOpen: true,
    distance: '0.5km',
    rating: 4.8,
    lat: 4.965,
    lng: 8.335,
    image: 'https://picsum.photos/seed/mobil-marian/600/400',
    lastUpdated: '10:32 AM'
  },
  {
    id: 'uddy-king-parliamentary',
    name: 'Uddy King Parliamentary',
    address: 'Parliamentary Extension, Calabar',
    petrolPrice: 640,
    dieselPrice: 1080,
    isOpen: true,
    distance: '1.5km',
    rating: 4.4,
    lat: 4.982,
    lng: 8.342,
    image: 'https://picsum.photos/seed/uddy-parl/600/400',
    lastUpdated: '09:45 AM'
  },
  {
    id: 'shafa',
    name: 'Shafa Energy',
    address: 'Murtala Mohammed Highway, Calabar',
    petrolPrice: 630,
    dieselPrice: 1050,
    isOpen: true,
    distance: '2.1km',
    rating: 4.2,
    lat: 4.995,
    lng: 8.338,
    image: 'https://picsum.photos/seed/shafa/600/400',
    lastUpdated: '11:15 AM'
  },
  {
    id: 'uddy-king-effio-ette',
    name: 'Uddy King Effio-Ette',
    address: 'Effio-Ette Junction, Calabar',
    petrolPrice: 645,
    dieselPrice: 1090,
    isOpen: true,
    distance: '1.8km',
    rating: 4.5,
    lat: 4.972,
    lng: 8.348,
    image: 'https://picsum.photos/seed/uddy-effio/600/400',
    lastUpdated: '10:50 AM'
  },
  {
    id: 'nnpc-highway',
    name: 'NNPC Mega Station',
    address: 'Murtala Mohammed Highway, Calabar',
    petrolPrice: 610,
    dieselPrice: 1020,
    isOpen: true,
    distance: '3.0km',
    rating: 4.1,
    lat: 5.012,
    lng: 8.331,
    image: 'https://picsum.photos/seed/nnpc-cal/600/400',
    lastUpdated: '08:20 AM'
  }
];

export const NEWS_ALERTS = [
  {
    id: 'n1',
    title: 'Upcoming Price Adjustment',
    content: 'Petroleum Marketers association hints at a potential 5% increase in petrol prices starting Monday.',
    date: '2 hours ago',
    type: 'warning'
  }
];
