export interface Product {
  id: string;
  iconName: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  image?: string;
  images?: string[];
  imageLabels?: string[];
  video?: string;
  color: string;
}

export const products: Product[] = [
  {
    id: "margarita",
    iconName: "Snowflake",
    name: "Margarita Machines",
    tagline: "Frozen drinks for the whole crew.",
    description:
      "Dual-barrel frozen margarita machine with everything included — cups, straws, salt rimmer, and Lime mix. Runs on standard 110V power, holds multiple gallons per tank. We deliver, set it up, show you how it works, and come back for pickup.",
    features: [
      "Double barrel frozen margarita machine",
      "Holds multiple gallons per tank",
      "110 servings of classic margarita (Lime) included",
      "50 cups, straws, salt rimmer & bar setup (table) included",
      "Setup and delivery included",
      "Easy to operate — we show you how",
      "Great for margaritas, daiquiris, slushies & more",
      "Available in single or dual-flavor options",
      "Same day drop off & pick up — extra charge applies",
    ],
    image: "/margarita-machine.jpg",
    color: "#00e64d",
  },
  {
    id: "upgraded-bar",
    iconName: "Sparkles",
    name: "Upgraded Margarita Bar",
    tagline: "Premium bar setup — lights included!",
    description:
      "Add this custom bar cabinet to your margarita machine rental. Wood countertop, built-in string lights, and a \"Margarita Bar\" sign — it looks like an actual bar instead of a folding table. Just $20 added to your margarita rental.",
    features: [
      "Custom bar cabinet with premium white finish & wood countertop",
      "Decorative \"Margarita Bar\" neon-style signage",
      "Perfect for photos & social media content",
      "Just $20 add-on to any margarita machine rental",
      "Sets up right next to the margarita machine",
    ],
    image: "/upgraded-bar.jpg",
    video: "/upgraded-bar.mp4",
    color: "#e81ccd",
  },
  {
    id: "coolers",
    iconName: "Wind",
    name: "Evaporative Cooler Fans",
    tagline: "Stay cool under the Texas sun!",
    description:
      "Our most-rented item. 5,300 CFM, 3 speeds, 21-gallon tank, oscillating louvers. Keeps guests cool under a canopy or any open-air setup — way more effective than you'd expect for an evaporative fan.",
    features: [
      "5,300 CFM cooling power",
      "3-speed settings for flexible comfort control",
      "21 gallon water tank",
      "Oscillating louvers for wide coverage",
      "Portable with easy-roll casters",
      "Pairs perfectly with our canopy tents",
    ],
    image: "/Fan.jpg",
    color: "#e81ccd",
  },
  {
    id: "canopy-10x20",
    iconName: "Umbrella",
    name: "10×20 Canopy Tent",
    tagline: "Beat the San Antonio heat!",
    description:
      "10×20 ft of solid shade. Commercial grade frame handles wind well. We set it up and come back to break it down — you just show up to your event.",
    features: [
      "Sturdy 10×20 ft frame with durable canopy top",
      "Heavy-duty construction for wind resistance",
      "Professional setup and breakdown included",
      "Perfect for 20–30 guests underneath",
    ],
    image: "/canopy-10x20.jpg",
    color: "#00e64d",
  },
  {
    id: "canopy-13x26",
    iconName: "Tent",
    name: "13×26 Canopy Tent",
    tagline: "Our biggest shade solution!",
    description:
      "Our biggest tent. Fits up to 60 people — quinceañeras, block parties, weddings. Heavy-duty frame, professional setup and breakdown included.",
    features: [
      "Spacious 13×26 ft heavy-duty frame",
      "Fits up to 60 people comfortably",
      "Heavy-duty construction for wind resistance",
      "Professional setup and breakdown included",
      "Pairs great with tables, chairs & lights",
    ],
    image: "/canopy-13x26.png",
    color: "#e81ccd",
  },
  {
    id: "tables",
    iconName: "RectangleHorizontal",
    name: "Tables",
    tagline: "Three styles for every setup",
    description:
      "We carry three table styles to fit any event.\n6 ft rectangular folding tables that seat 6.\n5 ft round tables that seat 8.\nCocktail tables that 4 can comfortably stand around.\nAll are clean, well-maintained, and delivered to your door.",
    features: [],
    image: "/6ft-round-table.jpg",
    images: ["/cocktail-table.jpg", "/table.jpg"],
    color: "#00e64d",
  },
  {
    id: "chairs",
    iconName: "Armchair",
    name: "Chairs",
    tagline: "Two styles — elegant seating for any event",
    description:
      "Choose from two chair styles: our premium white resin folding chairs for a clean, modern look, or classic white folding chairs with a timeless feel. Both are sturdy, clean, and perfect for any outdoor or indoor event in San Antonio.",
    features: [
      "Premium white resin folding chairs",
      "Classic white folding chairs",
      "Both styles are clean & sturdy",
      "Comfortable for long events",
      "Quantity packages available",
      "Delivery and pickup included",
    ],
    image: "/white-chair.jpg",
    images: ["/premium-white-padded-chair.jpg"],
    imageLabels: ["White Folding Chair", "Premium White Padded Garden Chair"],
    color: "#00e64d",
  },
  {
    id: "table-chair-set",
    iconName: "LayoutGrid",
    name: "Table & Chair Set",
    tagline: "Tables and chairs together",
    description:
      "Tables and chairs rented together at a bundled rate. Cheaper than renting separately, delivered and set up at your event.",
    features: [
      "6ft folding tables + premium white resin chairs",
      "Bundle pricing — save vs. renting separately",
      "Perfect for banquets, quinceañeras, birthdays",
      "Delivery, setup & breakdown included",
    ],
    color: "#00e64d",
  },
  {
    id: "tablecloths",
    iconName: "UtensilsCrossed",
    name: "Tablecloths & Linens",
    tagline: "Black linens — elegant & sleek",
    description:
      "Black tablecloths for rectangular, round, and cocktail tables. Clean and pressed for every rental — just tell us which table sizes you need.",
    features: [
      "Black only — clean and pressed for every event",
      "Fits 6ft rectangular folding tables",
      "Fits 6ft round tables",
      "Cocktail table linens available",
      "Polyester blend — wrinkle-resistant",
      "Pairs perfectly with white resin or wood chairs",
    ],
    color: "#e81ccd",
  },
  {
    id: "lights",
    iconName: "Lightbulb",
    name: "Canopy Lights",
    tagline: "Brighten up your night!",
    description:
      "String lights and LED options for inside your canopy frame. Makes a big difference for evening events — turns a plain canopy into a lit-up setup your guests will notice.",
    features: [
      "Warm white and multicolor string lights",
      "LED options for energy efficiency",
      "Designed to hang inside canopy frames",
      "Extension cords and connectors included",
      "Makes a big difference after dark",
      "Pairs perfectly with our 10×20 and 13×26 canopy tents",
    ],
    color: "#ffffff",
  },
  {
    id: "yard-games",
    iconName: "Trophy",
    name: "Yard Games",
    tagline: "Level up the fun!",
    description:
      "Keep guests entertained all event long with our premium yard games. From giant connect 4 to cornhole and beer pong — perfect for adults and kids at any outdoor event.",
    features: [
      "Giant Connect 4 — oversized outdoor version",
      "Cornhole boards with bean bags",
      "Beer Pong Table — regulation size",
      "Great for all ages and events",
      "Perfect add-on to any event package",
    ],
    color: "#e81ccd",
  },
];
