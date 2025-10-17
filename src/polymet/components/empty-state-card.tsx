import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon, AlertTriangleIcon } from "lucide-react";
import { getNearbyStates } from "@/data/state-coverage";

interface EmptyStateCardProps {
  stateName: string;
  onClick?: () => void;
}

export function EmptyStateCard({ stateName, onClick }: EmptyStateCardProps) {
  const nearbyStates = getNearbyStates(stateName);
  const nearbyWithStations = nearbyStates.filter(state => 
    // This would need to be connected to actual data in a real implementation
    true // For now, assume all nearby states have stations
  );

  return (
    <Card
      className="bg-orange-50 border-orange-300 hover:shadow-lg hover:border-orange-500 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-900">
                {stateName}
              </h3>
              <p className="text-sm text-orange-700 font-medium">
                No Covenant Fuel Stations
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-orange-800 font-medium">
              There are currently no fuel stations in {stateName}
            </p>
            <p className="text-orange-700 text-sm">
              Covenant Fuel Network doesn't have coverage in this state yet.
            </p>
          </div>

          {/* Nearby States Suggestions */}
          {nearbyWithStations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-orange-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPinIcon className="w-4 h-4 text-orange-700" />
                <span className="text-sm font-semibold text-orange-900">
                  Try nearby states:
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {nearbyWithStations.slice(0, 3).map((nearbyState) => (
                  <span
                    key={nearbyState}
                    className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition-colors"
                  >
                    {nearbyState}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-orange-200">
            <p className="text-xs text-orange-600">
              💡 Tip: Use the search to find stations in nearby states
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


