export function filterSupplies(supplies, search) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return supplies;
  return supplies.filter(
    (supply) =>
      supply.name.toLowerCase().includes(normalized) ||
      supply.category.toLowerCase().includes(normalized),
  );
}

export function isLowStock(supply) {
  return supply.stock <= supply.minStock;
}
