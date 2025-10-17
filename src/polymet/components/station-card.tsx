import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon, BuildingIcon, PhoneIcon, Navigation } from "lucide-react";
import type { FuelStation } from "@/types/fuel-station";
import { STATION_BADGES } from "@/config/constants";

interface StationCardProps {
  station: FuelStation;
  onClick?: () => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  // Get badge color based on station type
  const getStationTypeBadge = () => {
    switch (station.stationType) {
      case 'Exclusive':
        return <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">{STATION_BADGES.exclusive} EXCLUSIVE</span>;
      case 'Primary':
        return <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{STATION_BADGES.primary} PRIMARY</span>;
      case 'Limited':
        return <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">{STATION_BADGES.limited} LIMITED</span>;
      case 'Covenant Terminal':
        return <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">{STATION_BADGES.covenant} COVENANT</span>;
      default:
        return null;
    }
  };

  // Get brand badge with proper colors
  const getBrandBadge = () => {
    switch (station.brand) {
      case 'TA':
        return <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">TA</span>;
      case 'PETRO':
        return <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">PETRO</span>;
      case 'Covenant':
        return <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">COVENANT</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">{station.brand}</span>;
    }
  };

  return (
    <Card
      className="bg-white border-blue-300 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Station Name & Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-blue-900">
                  {station.stationName}
                </h3>
                {getBrandBadge()}
              </div>
              <div className="flex items-center gap-2">
                {getStationTypeBadge()}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p>{station.address}</p>
                <p>
                  {station.city}, {station.state} {station.zip}
                </p>
              </div>
            </div>

            {/* Exit Info */}
            {station.exitInfo && (
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-700" />
                <span className="text-sm text-blue-800">{station.exitInfo}</span>
              </div>
            )}

            {/* Phone */}
            {station.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-blue-700" />
                <span className="text-sm text-blue-800">{station.phone}</span>
              </div>
            )}

            {/* NaviGo ID */}
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-mono text-blue-900 font-semibold">
                NaviGo: {station.navigoId}
              </span>
            </div>

            {/* Amenities (for Covenant terminals) */}
            {station.amenities && station.amenities.length > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {station.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* State Badge */}
          <div className="flex-shrink-0">
            <div className="px-3 py-1 bg-blue-900 rounded-full">
              <span className="text-sm font-bold text-white">{station.state}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
