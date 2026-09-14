export function filterProducts(products, search) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return products;
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.code.toLowerCase().includes(normalized) ||
      product.category.toLowerCase().includes(normalized),
  );
}
