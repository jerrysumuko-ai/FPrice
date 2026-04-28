"use client";

import {
  FuelStation,
  NewsAlert,
  StationRow,
  NewsRow,
  rowToStation,
  rowToNews,
} from './types';

async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchStations(): Promise<FuelStation[]> {
  try {
    const data = await jsonFetch<StationRow[]>('/api/stations');
    return (data ?? []).map(rowToStation);
  } catch (err) {
    console.error('fetchStations error:', err);
    return [];
  }
}

export async function fetchStationById(id: string): Promise<FuelStation | null> {
  try {
    const data = await jsonFetch<StationRow | null>(
      `/api/stations/${encodeURIComponent(id)}`,
    );
    if (!data) return null;
    return rowToStation(data);
  } catch (err) {
    console.error('fetchStationById error:', err);
    return null;
  }
}

export async function fetchStationsByIds(ids: string[]): Promise<FuelStation[]> {
  if (ids.length === 0) return [];
  try {
    const data = await jsonFetch<StationRow[]>('/api/stations/by-ids', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    return (data ?? []).map(rowToStation);
  } catch (err) {
    console.error('fetchStationsByIds error:', err);
    return [];
  }
}

export async function fetchNewsAlerts(): Promise<NewsAlert[]> {
  try {
    const data = await jsonFetch<NewsRow[]>('/api/news');
    return (data ?? []).map(rowToNews);
  } catch (err) {
    console.error('fetchNewsAlerts error:', err);
    return [];
  }
}

export async function submitFeedback(args: {
  stationId: string | null;
  subject: string;
  message: string;
}) {
  await jsonFetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({
      stationId: args.stationId,
      subject: args.subject,
      message: args.message,
    }),
  });
}

export async function submitPriceReport(args: {
  stationId: string;
  petrolPrice: number | null;
  dieselPrice: number | null;
}) {
  await jsonFetch('/api/price-reports', {
    method: 'POST',
    body: JSON.stringify({
      stationId: args.stationId,
      petrolPrice: args.petrolPrice,
      dieselPrice: args.dieselPrice,
    }),
  });
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || `station-${Date.now()}`
  );
}

export async function createStation(args: {
  name: string;
  address: string;
  petrolPrice: number;
  dieselPrice: number;
  phone?: string;
  logoUrl?: string;
}): Promise<FuelStation> {
  const id = `${slugify(args.name)}-${Date.now().toString(36)}`;
  const now = new Date();
  const lastUpdated = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const row = await jsonFetch<StationRow>('/api/stations', {
    method: 'POST',
    body: JSON.stringify({
      id,
      name: args.name,
      address: args.address,
      petrolPrice: args.petrolPrice,
      dieselPrice: args.dieselPrice,
      isOpen: true,
      distance: '',
      rating: '0',
      lat: '0',
      lng: '0',
      image: `https://picsum.photos/seed/${id}/600/400`,
      lastUpdated,
      phone: args.phone ?? null,
      logoUrl: args.logoUrl ?? null,
    }),
  });

  return rowToStation(row);
}
