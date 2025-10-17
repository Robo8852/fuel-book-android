export interface FuelEntry {
  id: string;
  date: string;
  fuelAmount: number; // in liters
  cost: number;
  pricePerLiter: number;
  odometer: number; // in km
  fuelType: "Petrol" | "Diesel" | "Premium";
  station?: string;
  notes?: string;
}

export const fuelEntries: FuelEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    fuelAmount: 45.5,
    cost: 68.25,
    pricePerLiter: 1.5,
    odometer: 45230,
    fuelType: "Petrol",
    station: "Shell Station",
    notes: "Full tank",
  },
  {
    id: "2",
    date: "2024-01-08",
    fuelAmount: 42.0,
    cost: 63.0,
    pricePerLiter: 1.5,
    odometer: 44680,
    fuelType: "Petrol",
    station: "BP Station",
  },
  {
    id: "3",
    date: "2024-01-01",
    fuelAmount: 48.2,
    cost: 72.3,
    pricePerLiter: 1.5,
    odometer: 44120,
    fuelType: "Petrol",
    station: "Shell Station",
    notes: "New year fill-up",
  },
  {
    id: "4",
    date: "2023-12-24",
    fuelAmount: 40.0,
    cost: 60.0,
    pricePerLiter: 1.5,
    odometer: 43550,
    fuelType: "Petrol",
    station: "Total Station",
  },
  {
    id: "5",
    date: "2023-12-17",
    fuelAmount: 46.8,
    cost: 70.2,
    pricePerLiter: 1.5,
    odometer: 42980,
    fuelType: "Petrol",
    station: "Shell Station",
  },
];

export interface VehicleInfo {
  name: string;
  model: string;
  year: number;
  licensePlate: string;
  currentOdometer: number;
}

export const vehicleInfo: VehicleInfo = {
  name: "My Car",
  model: "Toyota Camry",
  year: 2020,
  licensePlate: "ABC 1234",
  currentOdometer: 45230,
};

export interface FuelStatistics {
  totalSpent: number;
  totalFuel: number;
  averageConsumption: number; // km per liter
  averageCostPerKm: number;
  totalDistance: number;
}

export const calculateStatistics = (entries: FuelEntry[]): FuelStatistics => {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalSpent = entries.reduce((sum, entry) => sum + entry.cost, 0);
  const totalFuel = entries.reduce((sum, entry) => sum + entry.fuelAmount, 0);

  const totalDistance =
    sortedEntries.length > 1
      ? sortedEntries[sortedEntries.length - 1].odometer -
        sortedEntries[0].odometer
      : 0;

  const averageConsumption = totalFuel > 0 ? totalDistance / totalFuel : 0;
  const averageCostPerKm = totalDistance > 0 ? totalSpent / totalDistance : 0;

  return {
    totalSpent,
    totalFuel,
    averageConsumption,
    averageCostPerKm,
    totalDistance,
  };
};
