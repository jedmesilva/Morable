import React, { createContext, useContext, useState } from "react";

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  match: number;
  available: boolean;
  type: string;
  rating: number;
  reviews: number;
  floor: string;
  parking: boolean;
  pets: boolean;
  gym: boolean;
  wifi: boolean;
  security: boolean;
  furnished: boolean;
}

interface AppContextType {
  savedProperties: string[];
  toggleSave: (id: string) => void;
  activeProperty: Property | null;
  setActiveProperty: (p: Property | null) => void;
}

const AppContext = createContext<AppContextType>({
  savedProperties: [],
  toggleSave: () => {},
  activeProperty: null,
  setActiveProperty: () => {},
});

export const properties: Property[] = [
  {
    id: "1",
    name: "Vítor Meireles 42",
    location: "Leblon, Rio de Janeiro",
    price: "R$ 4.800",
    beds: 2,
    baths: 1,
    area: "68m²",
    match: 94,
    available: true,
    type: "Apartamento",
    rating: 4.9,
    reviews: 24,
    floor: "8º andar",
    parking: true,
    pets: true,
    gym: true,
    wifi: true,
    security: true,
    furnished: true,
  },
  {
    id: "2",
    name: "Alameda Santos 1200",
    location: "Jardins, São Paulo",
    price: "R$ 6.200",
    beds: 3,
    baths: 2,
    area: "92m²",
    match: 87,
    available: true,
    type: "Apartamento",
    rating: 4.7,
    reviews: 18,
    floor: "12º andar",
    parking: true,
    pets: false,
    gym: true,
    wifi: true,
    security: true,
    furnished: true,
  },
  {
    id: "3",
    name: "Rua Oscar Freire 88",
    location: "Pinheiros, São Paulo",
    price: "R$ 3.900",
    beds: 1,
    baths: 1,
    area: "42m²",
    match: 81,
    available: false,
    type: "Studio",
    rating: 4.6,
    reviews: 31,
    floor: "4º andar",
    parking: false,
    pets: true,
    gym: false,
    wifi: true,
    security: true,
    furnished: true,
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  const toggleSave = (id: string) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider
      value={{ savedProperties, toggleSave, activeProperty, setActiveProperty }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export type { Property };
