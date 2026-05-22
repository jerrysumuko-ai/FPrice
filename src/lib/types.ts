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
  phone?: string;
  logoUrl?: string;
  placeName?: string;
  status: string;
}

export interface NewsAlert {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
}

export type StationRow = {
  id: string;
  name: string;
  address: string;
  petrol_price: number;
  diesel_price: number;
  is_open: boolean;
  distance: string;
  rating: number;
  lat: number;
  lng: number;
  image: string;
  last_updated: string;
  phone?: string;
  logo_url?: string;
  place_name?: string;
  status: string;
};

export type NewsRow = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
};

export function rowToStation(row: StationRow): FuelStation {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    petrolPrice: row.petrol_price,
    dieselPrice: row.diesel_price,
    isOpen: row.is_open,
    distance: row.distance,
    rating: Number(row.rating),
    lat: Number(row.lat),
    lng: Number(row.lng),
    image: row.image,
    lastUpdated: row.last_updated,
    phone: row.phone,
    logoUrl: row.logo_url,
    placeName: row.place_name,
    status: row.status ?? 'approved',
  };
}

export function rowToNews(row: NewsRow): NewsAlert {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: row.date,
    type: row.type,
  };
}
