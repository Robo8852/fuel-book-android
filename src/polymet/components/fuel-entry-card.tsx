import { Card, CardContent } from "@/components/ui/card";
import {
  FuelIcon,
  CalendarIcon,
  GaugeIcon,
  DollarSignIcon,
  DropletIcon,
} from "lucide-react";
import { FuelEntry } from "@/polymet/data/fuel-entries-data";

interface FuelEntryCardProps {
  entry: FuelEntry;
}

export function FuelEntryCard({ entry }: FuelEntryCardProps) {
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-white dark:bg-blue-950 border-blue-100 dark:border-blue-900 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-900 dark:bg-blue-800 flex items-center justify-center">
              <FuelIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-white">
                {entry.station || "Fuel Station"}
              </p>
              <div className="flex items-center gap-1 text-sm text-blue-700 dark:text-blue-300">
                <CalendarIcon className="w-3 h-3" />

                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900 dark:text-white">
              ${entry.cost.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              ${entry.pricePerLiter.toFixed(2)}/L
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <DropletIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />

            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Amount</p>
              <p className="font-semibold text-blue-900 dark:text-white">
                {entry.fuelAmount.toFixed(1)}L
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GaugeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />

            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Odometer
              </p>
              <p className="font-semibold text-blue-900 dark:text-white">
                {entry.odometer.toLocaleString()} km
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600 dark:bg-blue-400 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white dark:text-blue-900">
                {entry.fuelType[0]}
              </span>
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Type</p>
              <p className="font-semibold text-blue-900 dark:text-white">
                {entry.fuelType}
              </p>
            </div>
          </div>
        </div>

        {entry.notes && (
          <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 italic">
              {entry.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
