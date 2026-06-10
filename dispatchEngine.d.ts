export interface DispatchItem { name: string; qty: number }
export interface DispatchRental {
  id: string
  customer: string
  address: string
  dropoff: string
  pickup: string
  items: DispatchItem[]
  status?: string
}
export interface InventoryRow { id: string; name: string; total: number }
export interface Stop { rentalId: string; type: 'drop' | 'pick' }
export interface AvailabilityItem {
  name: string; total: number; committed: number; free: number; over: boolean
}
export interface NetRow { name: string; drops: number; picks: number; net: number }
export interface LoadRow {
  name: string; load: number; best: number; back: number; extra: number
}

export function toYMD(d: Date): string
export function parseYMD(s: string): Date
export function addDays(s: string, n: number): string
export function isOut(rental: DispatchRental, ymd: string): boolean
export function dropoffsOn(rentals: DispatchRental[], ymd: string): DispatchRental[]
export function pickupsOn(rentals: DispatchRental[], ymd: string): DispatchRental[]
export function manifest(rentals: DispatchRental[]): Record<string, number>
export function committedOn(rentals: DispatchRental[], ymd: string): Record<string, number>
export function availabilityOn(
  inventory: InventoryRow[],
  rentals: DispatchRental[],
  ymd: string
): AvailabilityItem[]
export function availabilityRange(
  inventory: InventoryRow[],
  rentals: DispatchRental[],
  startYmd: string,
  days: number
): { date: string; items: AvailabilityItem[] }[]
export function netToPull(rentals: DispatchRental[], ymd: string): NetRow[]
export function routeLoad(orderedStops: Stop[], rentals: DispatchRental[]): LoadRow[]
export function defaultStops(rentals: DispatchRental[], ymd: string): Stop[]
