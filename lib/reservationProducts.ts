export type ReservationProduct = {
  id: string;
  priceKey: string;
  name: string;
  description?: string;
  category: "core" | "addons" | "presets";
};

export const RESERVATION_PRODUCTS: ReservationProduct[] = [
  { id: "chair", priceKey: "chair", name: "Chair", description: "Individual chair rental", category: "core" },
  { id: "table", priceKey: "table", name: "Table", description: "6ft rectangular table", category: "core" },
  { id: "extra-table-chair-set", priceKey: "extra-table-chair-set", name: "Extra Table & Chair Set", description: "Add-on table/chair set", category: "core" },
  { id: "standalone-table-chair", priceKey: "standalone-table-chair", name: "Standalone Table and Chair", description: "Standalone single set", category: "core" },
  { id: "canopy-10x20", priceKey: "canopy-10x20", name: "10x20 Canopy Tent", description: "Pop-up style canopy", category: "core" },
  { id: "canopy-13x26", priceKey: "canopy-13x26", name: "13x26 Canopy Tent", description: "Large event canopy", category: "core" },
  { id: "margarita-machine", priceKey: "margarita-machine", name: "Margarita Machine", description: "Frozen drink machine", category: "core" },
  { id: "cornhole", priceKey: "cornhole", name: "Cornhole", description: "Yard game set", category: "addons" },
  { id: "giant-connect-four", priceKey: "giant-connect-four", name: "Giant Connect Four", description: "Oversized party game", category: "addons" },
  { id: "walls", priceKey: "walls", name: "Walls", description: "Canopy side wall panel", category: "addons" },
  { id: "round-table-8-chairs", priceKey: "round-table-8-chairs", name: "Round Tables 8 Chairs", description: "Round table setup bundle", category: "addons" },
  { id: "round-table", priceKey: "round-table", name: "Round Table", description: "Individual round table", category: "addons" },
  { id: "lights", priceKey: "lights", name: "Lights", description: "Event lighting add-on", category: "addons" },
  { id: "fan-1", priceKey: "fan-1", name: "1 Fan", description: "Single cooling fan", category: "addons" },
  { id: "fan-2", priceKey: "fan-2", name: "2 Fans", description: "Two-fan cooling package", category: "addons" },
  { id: "cocktail-tables", priceKey: "cocktail-tables", name: "Cocktail Tables", description: "High-top cocktail table", category: "addons" },
  { id: "linens", priceKey: "linens", name: "Linens", description: "Table linens", category: "addons" },
  { id: "canopy-10x20-4sets", priceKey: "canopy-10x20-4sets", name: "10x20 Canopy Tent with 4 T&C Sets", description: "Optional preset package", category: "presets" },
  { id: "canopy-13x26-8sets", priceKey: "canopy-13x26-8sets", name: "13x26 Canopy Tent with 8 T&C Sets", description: "Optional preset package", category: "presets" },
];
