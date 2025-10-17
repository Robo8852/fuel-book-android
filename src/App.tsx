import { StationLocatorLayout } from "@/polymet/layouts/station-locator-layout";
import { StationSearchPage } from "@/polymet/pages/station-search";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function FuelStationLocator() {
  return (
    <ErrorBoundary>
      <StationLocatorLayout>
        <StationSearchPage />
      </StationLocatorLayout>
    </ErrorBoundary>
  );
}
