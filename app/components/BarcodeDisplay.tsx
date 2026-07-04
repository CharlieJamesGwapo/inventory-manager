'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeDisplayProps {
  sku: string;
  productName: string;
}

export function BarcodeDisplay({ sku, productName }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && sku) {
      try {
        JsBarcode(svgRef.current, sku, {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 12,
        });
      } catch (error) {
        console.error('Failed to generate barcode:', error);
      }
    }
  }, [sku]);

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{productName}</p>
      <svg ref={svgRef} className="w-full max-w-sm h-auto"></svg>
    </div>
  );
}
