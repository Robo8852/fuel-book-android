import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import type { StationType, BrandType } from "@/types/fuel-station";
import { stateHasStations } from "@/data/state-coverage";
import { FILTER_CONFIG } from "@/config/constants";

interface FilterSectionProps {
  selectedState?: string;
  selectedStationType?: StationType;
  selectedBrand?: BrandType;
  onStateChange?: (state: string) => void;
  onStationTypeChange?: (stationType: StationType) => void;
  onBrandChange?: (brand: BrandType) => void;
  states?: string[];
  stationTypes?: StationType[];
  brands?: BrandType[];
}

export function FilterSection({
  selectedState,
  selectedStationType,
  selectedBrand,
  onStateChange,
  onStationTypeChange,
  onBrandChange,
  states = [],
  stationTypes = [],
  brands = [],
}: FilterSectionProps) {
  return (
    <div className="bg-white border border-blue-300 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <FilterIcon className="w-4 h-4 text-blue-700" />
        <h3 className="font-semibold text-blue-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* State Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800">
            State
          </label>
          <Select value={selectedState} onValueChange={onStateChange}>
            <SelectTrigger className="bg-white border-blue-300 text-blue-900">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_CONFIG.allFilterValue}>{FILTER_CONFIG.allStatesLabel}</SelectItem>
              {states.map((state) => {
                const hasStations = stateHasStations(state);
                return (
                  <SelectItem key={state} value={state}>
                    <span className={hasStations ? "text-blue-900" : "text-orange-600"}>
                      {state} {hasStations ? "✓" : "❌"}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800">
            Brand
          </label>
          <Select value={selectedBrand} onValueChange={onBrandChange}>
            <SelectTrigger className="bg-white border-blue-300 text-blue-900">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_CONFIG.allFilterValue}>{FILTER_CONFIG.allBrandsLabel}</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Station Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800">
            Station Type
          </label>
          <Select value={selectedStationType} onValueChange={onStationTypeChange}>
            <SelectTrigger className="bg-white border-blue-300 text-blue-900">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_CONFIG.allFilterValue}>{FILTER_CONFIG.allTypesLabel}</SelectItem>
              {stationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'Exclusive' && '★ '}
                  {type === 'Primary' && '● '}
                  {type === 'Limited' && '● '}
                  {type === 'Covenant Terminal' && '✓ '}
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
