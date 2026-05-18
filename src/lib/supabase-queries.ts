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
    .eq('status', 'approved')
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
    .in('id', ids)
    .eq('status', 'approved');
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

export async function uploadStationPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('station-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('station-photos').getPublicUrl(path);
  return data.publicUrl;
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
  lat: number;
  lng: number;
  photoUrl: string;
  phone?: string;
}): Promise<FuelStation> {
  const supabase = createClient();
  const id = `${slugify(args.name)}-${Date.now().toString(36)}`;

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
      lat: args.lat,
      lng: args.lng,
      image: args.photoUrl,
      last_updated: new Date().toISOString(),
      phone: args.phone ?? null,
      logo_url: null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return rowToStation(data as StationRow);
}
