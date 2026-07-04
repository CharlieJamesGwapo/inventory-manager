export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  lowStockThreshold?: number;
}

const STORAGE_KEY = 'inventory-products';
const LOW_STOCK_THRESHOLD = 10;

export const storage = {
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to retrieve products:', error);
      return [];
    }
  },

  addProduct: (product: Omit<Product, 'id'>): Product => {
    const products = storage.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lowStockThreshold: product.lowStockThreshold || LOW_STOCK_THRESHOLD,
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>): Product | null => {
    const products = storage.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  },

  deleteProduct: (id: string): boolean => {
    const products = storage.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  searchProducts: (query: string): Product[] => {
    const products = storage.getProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery)
    );
  },

  isLowStock: (stock: number, threshold: number = LOW_STOCK_THRESHOLD): boolean => {
    return stock <= threshold;
  },
};
