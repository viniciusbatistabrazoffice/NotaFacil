import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createProduct,
  deleteProduct as apiDeleteProduct,
  fetchProducts,
  updateProduct,
} from '../services/products';
import { translateError } from '../utils/errors';

export function useProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchProducts(token)
      .then(setProducts)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveProduct = useCallback(
    async (id, payload) => {
      if (id) {
        await updateProduct(id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      await reload();
    },
    [reload, token],
  );

  const deleteProduct = useCallback(
    async (id) => {
      await apiDeleteProduct(id, token);
      await reload();
    },
    [reload, token],
  );

  return { products, loading, error, saveProduct, deleteProduct };
}
