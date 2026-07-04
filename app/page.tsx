'use client';

import { useEffect, useState } from 'react';
import { Product, storage } from '@/app/lib/storage';
import { ProductForm } from '@/app/components/ProductForm';
import { ProductTable } from '@/app/components/ProductTable';
import { DarkModeToggle } from '@/app/components/DarkModeToggle';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProducts();
  }, []);

  const loadProducts = () => {
    const loadedProducts = storage.getProducts();
    setProducts(loadedProducts);
  };

  const handleAddProduct = (data: Omit<Product, 'id'>) => {
    storage.addProduct(data);
    loadProducts();
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpdateProduct = (data: Omit<Product, 'id'>) => {
    if (editingProduct) {
      storage.updateProduct(editingProduct.id, data);
      loadProducts();
      setEditingProduct(undefined);
      setShowForm(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      storage.deleteProduct(id);
      loadProducts();
      if (selectedProductId === id) {
        setSelectedProductId(undefined);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Inventory Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your products and inventory with ease
              </p>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            {showForm && (
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={handleCancel}
              />
            )}

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                + Add New Product
              </button>
            )}
          </div>

          {/* Right Column - Products List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Stats */}
            {products.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">
                    {products.length}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Total Stock
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-1">
                    {products.filter((p) =>
                      storage.isLowStock(p.stock, p.lowStockThreshold),
                    ).length}
                  </p>
                </div>
              </div>
            )}

            {/* Products Table */}
            <ProductTable
              products={products}
              searchQuery={searchQuery}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              selectedProductId={selectedProductId}
            />
          </div>
        </div>

        {/* Product Selection for Barcode */}
        {products.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
              Select a product to view its barcode:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors border ${
                    selectedProductId === product.id
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-500'
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>Inventory Manager 2024. Data stored locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
}
