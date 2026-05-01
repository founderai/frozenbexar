export interface Product {
  id: string;
  iconName: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  image?: string;
  color: string;
}

export const products: Product[] = [
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
      "Easy to operate — we show you how",
      "Great for margaritas, daiquiris, slushies & more",
      "Available in single or dual-flavor options",
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
      "Available in white and assorted colors",
    ],
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
      "Available in white and assorted colors",
      "Pairs great with tables, chairs & lights",
    ],
    color: "#e81ccd",
  },
  {
    id: "tables",
    iconName: "Armchair",
    name: "Tables & Chairs",
    tagline: "Seating for every celebration",
    description:
      "Complete your event setup with our clean, well-maintained tables and chairs. Available in multiple styles to match your event's vibe.",
    features: [
      "6ft and 8ft rectangular folding tables",
      "48in round tables for banquet-style seating",
      "Padded and standard folding chairs",
      "Quantity packages available",
      "Delivery and pickup included",
    ],
    color: "#00e64d",
  },
  {
    id: "tablecloths",
    iconName: "UtensilsCrossed",
    name: "Tablecloths",
    tagline: "The finishing touch",
    description:
      "Elevate your table presentation with our premium tablecloths. Available in a wide range of colors to match any party theme or color scheme.",
    features: [
      "Fits 6ft and 8ft rectangular tables",
      "Round tablecloth options available",
      "Wide variety of solid colors",
      "Pressed and clean for every event",
      "Polyester blend — wrinkle-resistant",
    ],
    color: "#e81ccd",
  },
  {
    id: "lights",
    iconName: "Lightbulb",
    name: "Canopy Lights",
    tagline: "Set the perfect mood",
    description:
      "Transform your canopy into a magical space with our string lights and LED lighting options. Perfect for evening events, weddings, quinceañeras, and more.",
    features: [
      "Warm white and multicolor string lights",
      "LED options for energy efficiency",
      "Designed to hang inside canopy frames",
      "Extension cords and connectors included",
      "Creates a magical ambiance at night",
    ],
    color: "#00e64d",
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
  {
    id: "packages",
    iconName: "PackageOpen",
    name: "Event Packages",
    tagline: "Bundle & save big!",
    description:
      "Get everything you need in one convenient package. Our bundles combine canopies, tables, chairs, tablecloths, and lights at a discounted rate. Contact us to build a custom package.",
    features: [
      "Mix and match any rental items",
      "Custom quotes for any event size",
      "Discounts for multi-item bundles",
      "Delivery, setup & breakdown included",
      "Same-day quotes available",
    ],
    color: "#00e64d",
  },
];
