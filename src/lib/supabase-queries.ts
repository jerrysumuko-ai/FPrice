"use client";

import { createClient } from '@/utils/supabase/client';
import {
  FuelStation,
  NewsAlert,
  StationRow,
  NewsRow,
  rowToStation,
  rowToNews,
} from './types';

export async function fetchStations(): Promise<FuelStation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .order('name', { ascending: true });
  if (error) {
    console.error('fetchStations error:', error);
    return [];
  }
  return ((data as StationRow[]) ?? []).map(rowToStation);
}

export async function fetchStationById(id: string): Promise<FuelStation | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('fetchStationById error:', error);
    return null;
  }
  if (!data) return null;
  return rowToStation(data as StationRow);
}

export async function fetchStationsByIds(ids: string[]): Promise<FuelStation[]> {
  if (ids.length === 0) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .in('id', ids);
  if (error) {
    console.error('fetchStationsByIds error:', error);
    return [];
  }
  return ((data as StationRow[]) ?? []).map(rowToStation);
}

export async function fetchNewsAlerts(): Promise<NewsAlert[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('news_alerts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchNewsAlerts error:', error);
    return [];
  }
  return ((data as NewsRow[]) ?? []).map(rowToNews);
}

export async function submitFeedback(args: {
  stationId: string | null;
  subject: string;
  message: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from('feedback').insert({
    station_id: args.stationId,
    subject: args.subject,
    message: args.message,
  });
  if (error) throw error;
}

export async function submitPriceReport(args: {
  stationId: string;
  petrolPrice: number | null;
  dieselPrice: number | null;
}) {
  const supabase = createClient();
  const { error } = await supabase.from('price_reports').insert({
    station_id: args.stationId,
    petrol_price: args.petrolPrice,
    diesel_price: args.dieselPrice,
  });
  if (error) throw error;
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

// Calabar city-centre fallback coordinates
const CALABAR_LAT = 4.9517;
const CALABAR_LNG = 8.3220;

export async function createStation(args: {
  name: string;
  address: string;
  petrolPrice: number;
  dieselPrice: number;
  phone?: string;
  logoUrl?: string;
}): Promise<FuelStation> {
  const supabase = createClient();
  const id = `${slugify(args.name)}-${Date.now().toString(36)}`;

  // Never store base64 data URLs — they bloat the DB. Only store remote URLs.
  const safeLogoUrl =
    args.logoUrl && !args.logoUrl.startsWith('data:') ? args.logoUrl : null;

  const { data, error } = await supabase
    .from('stations')
    .insert({
      id,
      name: args.name,
      address: args.address,
      petrol_price: args.petrolPrice,
      diesel_price: args.dieselPrice,
      is_open: true,
      distance: '',
      rating: 0,
      lat: CALABAR_LAT,
      lng: CALABAR_LNG,
      image: `https://picsum.photos/seed/${id}/600/400`,
      last_updated: new Date().toISOString(),
      phone: args.phone ?? null,
      logo_url: safeLogoUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToStation(data as StationRow);
}
