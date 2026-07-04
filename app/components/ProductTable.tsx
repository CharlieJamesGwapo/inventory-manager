'use client';

import { Product, storage } from '@/app/lib/storage';
import { BarcodeDisplay } from './BarcodeDisplay';

interface ProductTableProps {
  products: Product[];
  searchQuery: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  selectedProductId?: string;
}

export function ProductTable({
  products,
  searchQuery,
  onEdit,
  onDelete,
  selectedProductId,
}: ProductTableProps) {
  const filteredProducts = searchQuery
    ? storage.searchProducts(searchQuery)
    : products;

  return (
    <div className="space-y-6">
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                SKU
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                Price
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {searchQuery ? 'No products found' : 'No products added yet'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isLowStock = storage.isLowStock(
                  product.stock,
                  product.lowStockThreshold,
                );
                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                      {product.sku}
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-sm font-medium border border-gray-200 dark:border-gray-600 ${
                        isLowStock
                          ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {product.stock}
                        {isLowStock && (
                          <span className="text-red-600 dark:text-red-400 ml-1">
                            ⚠️
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-600">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onEdit(product)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Barcode Display */}
      {selectedProductId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Barcode
          </h3>
          {(() => {
            const product = products.find((p) => p.id === selectedProductId);
            return product ? (
              <BarcodeDisplay sku={product.sku} productName={product.name} />
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
