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
}

export const MOCK_STATIONS: FuelStation[] = [
  {
    id: '1',
    name: 'TotalEnergies Calabar Road',
    address: '12 Calabar Road, Calabar',
    petrolPrice: 650,
    dieselPrice: 1100,
    isOpen: true,
    distance: '0.8km',
    rating: 4.5,
    lat: 4.958,
    lng: 8.328,
    image: 'https://picsum.photos/seed/total/600/400'
  },
  {
    id: '2',
    name: 'NNPC Retail Murtala Mohammed',
    address: 'Murtala Mohammed Highway, Calabar',
    petrolPrice: 610,
    dieselPrice: 1050,
    isOpen: true,
    distance: '1.2km',
    rating: 4.2,
    lat: 4.975,
    lng: 8.332,
    image: 'https://picsum.photos/seed/nnpc/600/400'
  },
  {
    id: '3',
    name: 'Mobil Mary Slessor',
    address: 'Mary Slessor Avenue, Calabar',
    petrolPrice: 660,
    dieselPrice: 1150,
    isOpen: true,
    distance: '2.5km',
    rating: 4.8,
    lat: 4.962,
    lng: 8.341,
    image: 'https://picsum.photos/seed/mobil/600/400'
  },
  {
    id: '4',
    name: 'Rainoil Atimbo',
    address: 'Atimbo Road, Calabar',
    petrolPrice: 645,
    dieselPrice: 1090,
    isOpen: false,
    distance: '3.1km',
    rating: 4.0,
    lat: 4.981,
    lng: 8.355,
    image: 'https://picsum.photos/seed/rainoil/600/400'
  },
  {
    id: '5',
    name: 'Ardova PLC Airport Road',
    address: 'Airport Road, Calabar',
    petrolPrice: 655,
    dieselPrice: 1120,
    isOpen: true,
    distance: '4.2km',
    rating: 4.3,
    lat: 4.967,
    lng: 8.349,
    image: 'https://picsum.photos/seed/ardova/600/400'
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
