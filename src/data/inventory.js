export const VENDORS = [
  { id: 'V001', name: 'Brembo India Pvt Ltd', leadTimeDays: 7, rating: 4.8 },
  { id: 'V002', name: 'Akebono Brake Corp', leadTimeDays: 10, rating: 4.5 },
  { id: 'V003', name: 'TVS Apache Brakes', leadTimeDays: 5, rating: 4.2 },
  { id: 'V004', name: 'Bosch Automotive', leadTimeDays: 8, rating: 4.7 },
  { id: 'V005', name: 'Rane Brake Lining', leadTimeDays: 6, rating: 4.3 },
];

export const INITIAL_INVENTORY = [
  {
    id: 'PAD-X200',
    description: 'Brake Pad 200mm — Front disc, ceramic compound',
    category: 'Front Disc',
    rop: 500,
    currentQty: 380,
    unitPrice: 245.00,
    plant: 'PLT-100',
    storageLocation: 'WH-A01',
    lastReceived: '2026-07-15',
    vendorId: 'V001',
  },
  {
    id: 'PAD-X250',
    description: 'Brake Pad 250mm — Rear disc, semi-metallic',
    category: 'Rear Disc',
    rop: 400,
    currentQty: 420,
    unitPrice: 310.00,
    plant: 'PLT-100',
    storageLocation: 'WH-A02',
    lastReceived: '2026-08-01',
    vendorId: 'V002',
  },
  {
    id: 'PAD-X180',
    description: 'Brake Pad 180mm — Drum brake, organic',
    category: 'Drum',
    rop: 350,
    currentQty: 190,
    unitPrice: 185.00,
    plant: 'PLT-100',
    storageLocation: 'WH-B01',
    lastReceived: '2026-06-20',
    vendorId: 'V003',
  },
  {
    id: 'PAD-X300',
    description: 'Brake Pad 300mm — Heavy-duty disc, sintered metal',
    category: 'Heavy Duty',
    rop: 200,
    currentQty: 85,
    unitPrice: 520.00,
    plant: 'PLT-200',
    storageLocation: 'WH-C01',
    lastReceived: '2026-05-10',
    vendorId: 'V004',
  },
  {
    id: 'PAD-X150',
    description: 'Brake Pad 150mm — Scooter rear, NAO compound',
    category: 'Scooter',
    rop: 600,
    currentQty: 620,
    unitPrice: 150.00,
    plant: 'PLT-100',
    storageLocation: 'WH-D01',
    lastReceived: '2026-08-10',
    vendorId: 'V005',
  },
  {
    id: 'PAD-X220',
    description: 'Brake Pad 220mm — Commercial vehicle disc',
    category: 'Commercial',
    rop: 300,
    currentQty: 140,
    unitPrice: 380.00,
    plant: 'PLT-200',
    storageLocation: 'WH-C02',
    lastReceived: '2026-07-28',
    vendorId: 'V001',
  },
];

export function calculateReorderQty(rop, currentQty) {
  return Math.ceil(rop * 1.2 - currentQty);
}

export function isBelowRop(item) {
  return item.currentQty < item.rop;
}

export function getVendorById(id) {
  return VENDORS.find(v => v.id === id) || null;
}

export function generatePrNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `PR-${y}${m}${d}-${seq}`;
}
