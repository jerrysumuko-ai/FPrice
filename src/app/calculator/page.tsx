"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Fuel, Droplets } from 'lucide-react';
import { MOCK_STATIONS } from '@/lib/mock-data';

export default function CalculatorPage() {
  const [amount, setAmount] = useState<string>('5000');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel'>('petrol');
  const [customPrice, setCustomPrice] = useState<string>(MOCK_STATIONS[0].petrolPrice.toString());

  const liters = parseFloat(amount) / parseFloat(customPrice);

  useEffect(() => {
    const avgPrice = fuelType === 'petrol' 
      ? MOCK_STATIONS[0].petrolPrice 
      : MOCK_STATIONS[0].dieselPrice;
    setCustomPrice(avgPrice.toString());
  }, [fuelType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Fuel Calculator</h1>
        <p className="text-muted-foreground">Estimate how much fuel you can get for your budget.</p>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-primary size-5" />
            Conversion Tool
          </CardTitle>
          <CardDescription>Enter amount and select fuel type to calculate volume.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Budget Amount (₦)</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg font-semibold"
              />
            </div>

            <div className="grid gap-2">
              <Label>Fuel Type</Label>
              <RadioGroup value={fuelType} onValueChange={(v) => setFuelType(v as any)} className="flex gap-4">
                <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border flex-1 cursor-pointer">
                  <RadioGroupItem value="petrol" id="petrol" />
                  <Label htmlFor="petrol" className="flex items-center gap-2 cursor-pointer">
                    <Fuel className="size-4 text-primary" /> Petrol (PMS)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border flex-1 cursor-pointer">
                  <RadioGroupItem value="diesel" id="diesel" />
                  <Label htmlFor="diesel" className="flex items-center gap-2 cursor-pointer">
                    <Droplets className="size-4 text-secondary" /> Diesel (AGO)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Current Rate (₦/Litre)</Label>
              <Input 
                id="price" 
                type="number" 
                value={customPrice} 
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 text-center space-y-2">
            <div className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Estimated Volume</div>
            <div className="text-5xl font-black text-primary">
              {isNaN(liters) ? '0.00' : liters.toFixed(2)}
              <span className="text-xl ml-2 font-bold opacity-60">Litres</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
