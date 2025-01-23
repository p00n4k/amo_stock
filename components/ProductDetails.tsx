import React from 'react';

interface ProductData {
  product_stock_id: string;
  product_detail: string;
  product_quantity: number;
  product_unit: string;
  warehouse_id: string;
  warehouse_name: string;
  location: string;
}

interface ProductDetailsProps {
  productData: ProductData;
  productIndex: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productData, productIndex }) => {
  return (
    <>
      {productData && (
        <div>
          <p className="product-sequence">
            <span className="circle-number">{productIndex}</span>
          </p>

          <p className="productid">
            <span className="productid-head">Code:</span>{' '}
            {productData.product_stock_id}
          </p>
          <p className="productname">
            <span className="productname-head">Info:</span>
            <span className="productname-value">
              {' '}
              {productData.product_detail}
            </span>
          </p>
          <p className="producttotal">
            <span className="producttotal-head">Stock:</span>{' '}
            <span className="product_quantity">
              {productData.product_quantity}
            </span>{' '}
            {productData.product_unit}
          </p>
          <p className="warehouse_id">
            <span className="warehouse_id-head">คลัง:</span>{' '}
            {productData.warehouse_id} {productData.warehouse_name}
          </p>
          <p className="location">
            <span className="location-head">Location:</span>{' '}
            {productData.location}
          </p>

          <hr />
        </div>
      )}
    </>
  );
};


export default ProductDetails