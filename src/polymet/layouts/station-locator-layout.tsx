import { AppHeader } from "@/polymet/components/app-header";

interface StationLocatorLayoutProps {
  children: React.ReactNode;
}

export function StationLocatorLayout({ children }: StationLocatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
