import { describe, it, expect } from "vitest";
import { getRecommendations } from "./upsell";
import type { CartItem, CatalogItem } from "./upsell";

// ── Minimal catalog stub ─────────────────────────────────────────────────────
const STUB_CATALOG: CatalogItem[] = [
  { id: "margarita-machine", name: "Margarita Machine with Basic Bar", sub: "Single or dual flavor",
    color: "#00e64d", icon: "Snowflake", image: "/margarita-machine.jpg", visible: true },
  { id: "canopy-10x20",      name: "10x20 Canopy Tent",               sub: "Fits 20-30 guests",
    color: "#00e64d", icon: "Umbrella", image: "/canopy-10x20.jpg",     visible: true },
  { id: "canopy-13x26",      name: "13x26 Canopy Tent",               sub: "Fits up to 60 guests",
    color: "#e81ccd", icon: "Tent",    image: "/canopy-13x26.png",     visible: true },
];

function cart(...ids: string[]): CartItem[] {
  return ids.map(id => ({ id, name: id, qty: 1 }));
}

function ids(recs: ReturnType<typeof getRecommendations>) {
  return recs.map(r => r.id);
}

// ─────────────────────────────────────────────────────────────────────────────
describe("getRecommendations", () => {

  // ── Rule 1: Canopy → Lights / Walls ─────────────────────────────────────

  it("1. canopy in cart + no lights/walls → both offered", () => {
    const recs = getRecommendations(cart("canopy-10x20"), STUB_CATALOG);
    expect(recs.map(r => r.id)).toContain("lights");
    expect(recs.map(r => r.id)).toContain("walls");
  });

  it("2. canopy combo (bundle) in cart + no lights/walls → both offered", () => {
    const recs = getRecommendations(cart("spring-special"), STUB_CATALOG);
    expect(ids(recs)).toContain("lights");
    expect(ids(recs)).toContain("walls");
  });

  it("3. 13x26 canopy combo bundle + no lights/walls → both offered", () => {
    const recs = getRecommendations(cart("canopy-13x26-bundle"), STUB_CATALOG);
    expect(ids(recs)).toContain("lights");
    expect(ids(recs)).toContain("walls");
  });

  it("4. no canopy → canopy lights/walls NOT offered", () => {
    const recs = getRecommendations(cart("table"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("lights");
    expect(ids(recs)).not.toContain("walls");
  });

  it("5. lights already selected → lights NOT recommended", () => {
    const recs = getRecommendations(cart("canopy-10x20", "lights"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("lights");
    expect(ids(recs)).toContain("walls"); // walls still missing
  });

  it("6. walls already selected → walls NOT recommended", () => {
    const recs = getRecommendations(cart("canopy-13x26", "walls"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("walls");
    expect(ids(recs)).toContain("lights"); // lights still missing
  });

  it("7. both lights and walls selected with canopy → neither offered", () => {
    const recs = getRecommendations(cart("canopy-10x20", "lights", "walls"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("lights");
    expect(ids(recs)).not.toContain("walls");
  });

  // ── Rule 2: Margarita Machine ────────────────────────────────────────────

  it("8. no margarita → margarita machine recommended", () => {
    const recs = getRecommendations(cart("canopy-10x20"), STUB_CATALOG);
    expect(ids(recs)).toContain("margarita-machine");
  });

  it("9. margarita-machine already selected → NOT recommended", () => {
    const recs = getRecommendations(cart("margarita-machine"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("margarita-machine");
  });

  it("10. upgraded-bar (margarita variant) selected → margarita NOT recommended", () => {
    const recs = getRecommendations(cart("upgraded-bar"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("margarita-machine");
  });

  it("11. margarita-special bundle selected → margarita NOT recommended", () => {
    const recs = getRecommendations(cart("margarita-special"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("margarita-machine");
  });

  it("12. margarita recommendation pulls name/image from live catalog", () => {
    const recs = getRecommendations(cart("canopy-10x20"), STUB_CATALOG);
    const margaritaRec = recs.find(r => r.id === "margarita-machine");
    expect(margaritaRec?.name).toBe("Margarita Machine with Basic Bar");
    expect(margaritaRec?.image).toBe("/margarita-machine.jpg");
  });

  // ── Rule 2: Yard Games (each offered independently) ─────────────────────

  it("13. no yard game → both cornhole and giant-connect-four recommended", () => {
    const recs = getRecommendations(cart("canopy-10x20"), STUB_CATALOG);
    expect(ids(recs)).toContain("cornhole");
    expect(ids(recs)).toContain("giant-connect-four");
  });

  it("14. cornhole in cart → cornhole NOT recommended, connect four still recommended", () => {
    const recs = getRecommendations(cart("cornhole"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("cornhole");
    expect(ids(recs)).toContain("giant-connect-four");
  });

  it("15. giant-connect-four in cart → connect four NOT recommended, cornhole still recommended", () => {
    const recs = getRecommendations(cart("giant-connect-four"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("giant-connect-four");
    expect(ids(recs)).toContain("cornhole");
  });

  it("15b. both yard games in cart → neither recommended", () => {
    const recs = getRecommendations(cart("cornhole", "giant-connect-four"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("cornhole");
    expect(ids(recs)).not.toContain("giant-connect-four");
  });

  // ── Empty cart edge case ─────────────────────────────────────────────────

  it("16. empty cart → both yard games + margarita recommended, no canopy add-ons", () => {
    const recs = getRecommendations([], STUB_CATALOG);
    // No canopy → no lights/walls
    expect(ids(recs)).not.toContain("lights");
    expect(ids(recs)).not.toContain("walls");
    // Both yard games and margarita should show
    expect(ids(recs)).toContain("cornhole");
    expect(ids(recs)).toContain("giant-connect-four");
    expect(ids(recs)).toContain("margarita-machine");
  });

  // ── No duplicates ────────────────────────────────────────────────────────

  it("17. each recommendation ID appears at most once", () => {
    const recs = getRecommendations(cart("canopy-10x20"), STUB_CATALOG);
    const allIds = ids(recs);
    const uniqueIds = [...new Set(allIds)];
    expect(allIds.length).toBe(uniqueIds.length);
  });

  // ── Canopy-specific add-ons only trigger for canopy carts ───────────────

  it("18. cart with only chair → no lights/walls, but both yard games still offered", () => {
    const recs = getRecommendations(cart("chair"), STUB_CATALOG);
    expect(ids(recs)).not.toContain("lights");
    expect(ids(recs)).not.toContain("walls");
    expect(ids(recs)).toContain("cornhole");
    expect(ids(recs)).toContain("giant-connect-four");
  });

});
