export function filterSuppliers(suppliers, search) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return suppliers;
  return suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(normalized) ||
      supplier.category.toLowerCase().includes(normalized) ||
      supplier.document.includes(normalized),
  );
}
