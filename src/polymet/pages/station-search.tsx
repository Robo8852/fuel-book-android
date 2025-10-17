import { useState, useMemo } from "react";
import { SearchBar } from "@/polymet/components/search-bar";
import { FilterSection } from "@/polymet/components/filter-section";
import { StationCard } from "@/polymet/components/station-card";
import { EmptyStateCard } from "@/polymet/components/empty-state-card";
import { SearchIcon, MapPinIcon } from "lucide-react";
import { allFuelStations, availableStates, availableStationTypes, availableBrands, statesWithStations } from "@/data/fuel-stations";
import { getFilteredStations } from "@/utils/data-transformer";
import { stateHasStations, normalizeStateName } from "@/data/state-coverage";
import type { StationType, BrandType } from "@/types/fuel-station";

export function StationSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>();
  const [selectedStationType, setSelectedStationType] = useState<StationType>();
  const [selectedBrand, setSelectedBrand] = useState<BrandType>();

  // Filter stations based on search and filters
  const filteredStations = useMemo(() => {
    return getFilteredStations(
      allFuelStations,
      searchQuery,
      selectedState,
      selectedStationType,
      selectedBrand
    );
  }, [searchQuery, selectedState, selectedStationType, selectedBrand]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search by state, city, station name, or NaviGo ID..."
        />

        <FilterSection
          selectedState={selectedState}
          selectedStationType={selectedStationType}
          selectedBrand={selectedBrand}
          onStateChange={setSelectedState}
          onStationTypeChange={setSelectedStationType}
          onBrandChange={setSelectedBrand}
          states={availableStates}
          stationTypes={availableStationTypes}
          brands={availableBrands}
        />
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {filteredStations.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-900">
                {filteredStations.length} Station{filteredStations.length !== 1 ? "s" : ""}{" "}
                Found
              </h2>
            </div>

            <div className="space-y-3">
              {filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  onClick={() => console.log("Station clicked:", station)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Check if searching for a specific empty state */}
            {(selectedState && !stateHasStations(selectedState)) || 
             (searchQuery.trim() && !stateHasStations(searchQuery)) ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">
                    No stations in {normalizeStateName(selectedState || searchQuery)}
                  </h2>
                  <p className="text-blue-700">
                    This state doesn't have any Covenant fuel stations yet.
                  </p>
                </div>
                <EmptyStateCard 
                  stateName={normalizeStateName(selectedState || searchQuery)}
                  onClick={() => console.log("Empty state clicked:", normalizeStateName(selectedState || searchQuery))}
                />
              </div>
            ) : searchQuery.trim() ? (
              // Search query with no results
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  No stations found for "{searchQuery}"
                </h3>
                <p className="text-blue-700 max-w-md mx-auto mb-4">
                  Try adjusting your search terms or filters to find stations.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">
                    Search by state name, city, station name, or NaviGo ID
                  </span>
                </div>
              </div>
            ) : (
              // No search or filters applied - show all stations
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-10 h-10 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Welcome to Covenant Fuel Station Locator
                </h3>
                <p className="text-blue-700 max-w-md mx-auto">
                  Search for fuel stations by state, city, or station name. Use the filters to narrow down your results.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
