export interface Product {
  id: string;
  iconName: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  image?: string;
  images?: string[];
  video?: string;
  color: string;
}

export const products: Product[] = [
  {
    id: "upgraded-bar",
    iconName: "Sparkles",
    name: "Upgraded Margarita Bar",
    tagline: "Premium bar setup — lights included!",
    description:
      "Elevate your margarita machine rental with our premium Upgraded Bar setup. This custom bar cabinet features a gorgeous wood-top counter, decorative \"Margarita Bar\" signage, and built-in warm string lights for an atmosphere your guests will be talking about all night. A $20 add-on to any margarita machine rental.",
    features: [
      "Custom bar cabinet with premium white finish & wood countertop",
      "Built-in warm string lights included",
      "Decorative \"Margarita Bar\" neon-style signage",
      "Perfect for photos & social media content",
      "Just $20 add-on to any margarita machine rental",
      "Sets up around the margarita machine seamlessly",
      "Makes your setup look like a real bar",
    ],
    image: "/upgraded-bar.jpg",
    video: "/upgraded-bar.mp4",
    color: "#e81ccd",
  },
  {
    id: "margarita",
    iconName: "Snowflake",
    name: "Margarita Machines",
    tagline: "The life of the party!",
    description:
      "Our commercial-grade frozen margarita machines keep the drinks flowing all night long. Perfect for any size event — from intimate backyard gatherings to large outdoor celebrations.",
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
    id: "coolers",
    iconName: "Wind",
    name: "Evaporative Cooler Fans",
    tagline: "Stay cool under the Texas sun!",
    description:
      "Our most popular rental! These powerful evaporative cooler fans push 5,300 CFM of cool air with 3 speeds, a 21 gallon tank, and oscillating directions — perfect for keeping guests comfortable under canopies or in open-air spaces without the cost of AC.",
    features: [
      "5,300 CFM cooling power",
      "3-speed settings for flexible comfort control",
      "21 gallon water tank",
      "Oscillating louvers for wide coverage",
      "Portable with easy-roll casters",
      "Pairs perfectly with our canopy tents",
    ],
    image: "/cooler-unit.jpg",
    color: "#e81ccd",
  },
  {
    id: "canopy-10x20",
    iconName: "Umbrella",
    name: "10×20 Canopy Tent",
    tagline: "Beat the San Antonio heat!",
    description:
      "Our heavy duty, commercial grade 10×20 canopy tents provide generous shade and coverage for your outdoor events. Essential for San Antonio summers — keep your guests comfortable no matter the weather.",
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
      "Need more room? Our large 13×26 canopy tent is perfect for bigger crowds and large outdoor events in San Antonio. Fits up to 48 people comfortably — ideal for quinceañeras, weddings, and block parties.",
    features: [
      "Spacious 13×26 ft heavy-duty frame",
      "Fits up to 48 people comfortably",
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
      "We carry three table styles to fit any event layout — 6ft rectangular folding tables, 6ft round tables that seat 8–10 guests, and sleek cocktail / high-top tables perfect for mingling. All are clean, well-maintained, and delivered to your door.",
    features: [
      "6ft rectangular folding tables",
      "6ft round tables — seats 8–10 guests",
      "Cocktail / high-top tables — great for standing receptions",
      "Black tablecloths & linens available for all styles",
      "Quantity packages available",
      "Delivery and pickup included",
    ],
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
      "Choose from two chair styles: our premium white resin folding chairs for a clean, modern look, or classic white wood folding chairs with a timeless feel. Both are sturdy, clean, and perfect for any outdoor or indoor event in San Antonio.",
    features: [
      "Premium white resin folding chairs",
      "Classic white wood folding chairs",
      "Both styles are clean & sturdy",
      "Comfortable for long events",
      "Quantity packages available",
      "Delivery and pickup included",
    ],
    image: "/chair-resin.jpg",
    images: ["/chair-wood.jpg"],
    color: "#00e64d",
  },
  {
    id: "table-chair-set",
    iconName: "LayoutGrid",
    name: "Table & Chair Set",
    tagline: "Everything you need, bundled",
    description:
      "Get tables and chairs together in one convenient set. Bundle pricing saves you money — perfect for guests who need full seating setups delivered and arranged.",
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
      "Elevate your table presentation with our premium black tablecloths and linens. A sleek, professional look that complements any event theme — available for rectangular, round, and cocktail tables.",
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
      "Add magical canopy lights to brighten up your party at night. Our premium string lights and LED options transform any canopy into a glowing, unforgettable atmosphere — perfect for evening events, weddings, quinceañeras, and more.",
    features: [
      "Warm white and multicolor string lights",
      "LED options for energy efficiency",
      "Designed to hang inside canopy frames",
      "Extension cords and connectors included",
      "Creates a magical ambiance at night",
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
