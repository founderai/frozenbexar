/**
 * Upsell recommendation engine — pure functions only, no side effects.
 * All product IDs, names, and prices come from live data; nothing is hard-coded.
 */

export type CartItem    = { id: string; name: string; qty: number; priceKey?: string };
export type CatalogItem = { id: string; name: string; sub: string; priceKey?: string; color: string; icon: string; image?: string; visible: boolean };

// ── Stable product-ID sets ─────────────────────────────────────────────────
// Bundles that CONTAIN a canopy count as "has canopy" for upsell purposes.
export const CANOPY_IDS    = new Set(["canopy-10x20", "canopy-13x26", "spring-special", "canopy-13x26-bundle"]);
export const MARGARITA_IDS = new Set(["margarita-machine", "upgraded-bar", "margarita-special"]);
export const YARD_GAME_IDS = new Set(["cornhole", "giant-connect-four"]);

export type Recommendation = {
  /** Stable product ID — matches cart IDs, never a display-name string */
  id:        string;
  name:      string;
  sub:       string;
  image?:    string;
  color:     string;
  /** Icon name string consumed by the existing getIcon() helper */
  icon:      string;
  /** Price key used for price lookup — falls back to id if absent */
  priceKey?: string;
  /** Modal headline shown above the product */
  headline:  string;
  /** Short persuasion copy */
  copy:      string;
};

/**
 * Returns ordered add-on recommendations for the current cart.
 *
 * Rules
 * ─────
 * 1. Canopy (or canopy combo) in cart → offer Lights and/or Walls if missing.
 * 2. No yard game → offer Cornhole (first YARD_GAME_OPTIONS entry).
 * 3. No margarita machine → offer the Margarita Machine from live catalog data.
 *
 * Nothing already in the cart is ever recommended.
 * No price is ever embedded here — callers resolve prices from live prices state.
 */
export function getRecommendations(
  cart:    CartItem[],
  catalog: CatalogItem[],
): Recommendation[] {
  const cartIds = new Set(cart.map(c => c.id));
  const recs: Recommendation[] = [];

  const hasCanopy      = [...CANOPY_IDS].some(id    => cartIds.has(id));
  const hasLights      = cartIds.has("lights");
  const hasWalls       = cartIds.has("walls");
  const hasMargarita   = [...MARGARITA_IDS].some(id => cartIds.has(id));
  const hasCornhole    = cartIds.has("cornhole");
  const hasConnectFour = cartIds.has("giant-connect-four");

  // ── Rule 1: Canopy → Lights and / or Walls ──────────────────────────────
  if (hasCanopy) {
    if (!hasLights) {
      recs.push({
        id:       "lights",
        name:     "Lights",
        sub:      "Event string/LED lighting",
        color:    "#ffe066",
        icon:     "Lightbulb",
        headline: "Add lights to your canopy?",
        copy:     "Keep the party going after the sun goes down.",
      });
    }
    if (!hasWalls) {
      recs.push({
        id:       "walls",
        name:     "Walls",
        sub:      "Canopy side wall panel",
        color:    "#00e64d",
        icon:     "PanelLeft",
        headline: "Need canopy walls?",
        copy:     "Add extra shade, privacy, or protection from the weather.",
      });
    }
  }

  // ── Rule 2: Yard Games — each offered independently ─────────────────────
  if (!hasCornhole) {
    recs.push({
      id:       "cornhole",
      name:     "Cornhole",
      sub:      "Classic toss game — great for all ages",
      color:    "#e81ccd",
      icon:     "Trophy",
      priceKey: "cornhole",
      headline: "Add a Yard Game?",
      copy:     "Keep guests entertained between bites and sips.",
    });
  }
  if (!hasConnectFour) {
    recs.push({
      id:       "giant-connect-four",
      name:     "Giant Connect Four",
      sub:      "Jumbo outdoor board game",
      color:    "#f5e642",
      icon:     "Trophy",
      priceKey: "giant-connect-four",
      headline: "How about Giant Connect 4?",
      copy:     "The crowd favorite — kids and adults love it.",
    });
  }

  // ── Rule 3: No Margarita → offer Margarita Machine ──────────────────────
  if (!hasMargarita) {
    const cat = catalog.find(c => c.id === "margarita-machine");
    recs.push({
      id:       "margarita-machine",
      name:     cat?.name  ?? "Margarita Machine with Basic Bar",
      sub:      cat?.sub   ?? "Single or dual flavor",
      image:    cat?.image,
      color:    "#00e64d",
      icon:     "Snowflake",
      headline: "Make it a frozen party 🍹",
      copy:     "Add a Frozen Bexar Margarita Machine to your rental.",
    });
  }

  return recs;
}
