'use client';
import ProductDetails from "@/components/ProductDetails";
import { useState, useEffect } from "react";

const Page = () => {
  const [idInput, setIdInput] = useState('');
  const [productInfoInput, setProductInfoInput] = useState('');
  const [warehouseIdInput, setWarehouseIdInput] = useState('');
  const [productUnitInput, setProductUnitInput] = useState('');
  const [quantityInput, setQuantityInput] = useState(''); // New state for quantity filter
  const [quantityFilter, setQuantityFilter] = useState('greater'); // Default quantity filter
  const [productData, setProductData] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState<{ warehouse_id: string }[]>([]);
  const [productUnitOptions, setProductUnitOptions] = useState<{ product_unit: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestTime, setLatestTime] = useState<string | null>(null);


  // Fetch warehouse IDs for the dropdown
  const fetchWarehouseOptions = async () => {
    try {
      const response = await fetch('/api/warehouse');
      if (!response.ok) throw new Error('Failed to fetch warehouse options');
      const data = await response.json();
      setWarehouseOptions(data.warehouse_ids);
    } catch (error) {
      console.error('Error fetching warehouse options:', error);
      setWarehouseOptions([]);
    }
  };

  const fetchProductUniotOptions = async () => {
    try {
      const response = await fetch('/api/unit');
      if (!response.ok) throw new Error('Failed to fetch product unit options');
      const data = await response.json();
      setProductUnitOptions(data.product_unit);
    } catch (error) {
      console.error('Error fetching product unit options:', error);
      setProductUnitOptions([]);
    }
  }





  // Fetch product data
  const fetchData = async (body: { id?: string; name?: string; warehouse_id?: string; product_unit?: string; quantity?: string; quantity_filter?: string }) => {
    try {
      const response = await fetch('/api/amo-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, page, limit: 30 }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setProductData([]);
          setError('ไม่พบสินค้าตรงกับข้อมูลที่ค้นหา กรุณาลองใหม่อีกครั้ง');
          setTotalPages(1);
          return;
        }
        throw new Error('Failed to fetch product data');
      }


      const data = await response.json();
      setProductData(data.products);
      setTotalPages(Math.ceil(data.total / 30));
      setError('');
    } catch (error) {
      console.error('Error fetching product data:', error);
      if (error instanceof Error) {
        setError(error.message || 'An unknown error occurred');
      } else {
        setError('An unknown error occurred');
      }
      setProductData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseOptions();
  }, []);
  useEffect(() => {
    fetchProductUniotOptions();
  }
    , []);


  useEffect(() => {
    const fetchLatestTime = () => {
      const currentDate = new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Bangkok' }); // Convert UTC to Thailand Time (Asia/Bangkok) and only show date
      setLatestTime(currentDate);
    };

    fetchLatestTime(); // Fetch the date immediately after the component mounts
    const intervalId = setInterval(fetchLatestTime, 86400000); // Update date every day

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, []);



  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Log the form data to the console before submitting
    console.log({
      id: idInput,
      name: productInfoInput,
      warehouse_id: warehouseIdInput,
      product_unit: productUnitInput,
      quantity: quantityInput, // Log quantity input as well
      quantity_filter: quantityFilter, // Log quantity filter
    });

    if (idInput || productInfoInput || warehouseIdInput || productUnitInput || quantityInput) {
      fetchData({
        id: idInput,
        name: productInfoInput,
        warehouse_id: warehouseIdInput,
        product_unit: productUnitInput,
        quantity: quantityInput, // Pass quantity input to the API
        quantity_filter: quantityFilter, // Pass quantity filter to the API
      });
    } else {
      setError('กรุณากรอกข้อมูลในช่องค้นหา');
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    setLoading(true);
    fetchData({
      id: idInput,
      name: productInfoInput,
      warehouse_id: warehouseIdInput,
      product_unit: productUnitInput,
      quantity: quantityInput, // Pass quantity filter on page change
      quantity_filter: quantityFilter, // Pass quantity filter
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="px-10 py-10">

      <div className="font-light text-blue-500 text-xs  mb-1.5 flex justify-end">
        {latestTime ? `อัปเดตล่าสุดวันที่: ${latestTime}` : 'Loading time...'}
      </div>
      <form className="form" onSubmit={handleSearch}>

        {/* Product ID Section */}
        <div className="form-section">
          <h5>รหัสสินค้า</h5>
          <input
            type="text"
            value={idInput}
            placeholder="กรุณากรอกรหัสสินค้า"
            onChange={(e) => setIdInput(e.target.value)}
          />
        </div>

        {/* Product Info Section */}
        <div className="form-section">
          <h5>รายละเอียดสินค้า</h5>
          <input
            type="text"
            value={productInfoInput}
            placeholder="กรุณากรอกรายละเอียดสินค้า"
            onChange={(e) => setProductInfoInput(e.target.value)}
          />
        </div>

        {/* Quantity Filter Section */}
        <div className="form-section">
          <h5>กรองจำนวนสินค้า</h5>





          <div className="quantity-filter-container">
            {/* Button */}
            <button
              onClick={(e) => {
                e.preventDefault();  // Prevent page reload
                setQuantityFilter((prev) => (prev === "greater" ? "less" : "greater"));
              }}
              className={`quantity-filter-button ${quantityFilter === "greater" ? "greater" : "less"}`}
            >
              {quantityFilter === "greater" ? "มากกว่า" : "น้อยกว่า"}
            </button>


            {/* Input */}
            <input
              type="number"
              value={quantityInput}
              placeholder="กรุณากรอกจำนวนสินค้า"
              onChange={(e) => setQuantityInput(e.target.value)}
              className="quantity-input"
            />
          </div>

        </div>

        {/* Product Unit Section */}
        <div className="form-section">
          <h5>หน่วยสินค้า</h5>
          <select
            value={productUnitInput}
            onChange={(e) => setProductUnitInput(e.target.value)}
          >
            <option value="">หน่วย(Unit)</option>
            {productUnitOptions.map((product_unit) => (
              <option
                key={product_unit.product_unit}
                value={product_unit.product_unit}
              >
                {product_unit.product_unit}
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse Section */}
        <div className="form-section mb-3">
          <h5 className="mt-2">รหัสคลัง</h5>
          <select
            value={warehouseIdInput}
            onChange={(e) => setWarehouseIdInput(e.target.value)}
          >
            <option value="">รหัสคลัง</option>
            {warehouseOptions.map((warehouse) => (
              <option
                key={warehouse.warehouse_id}
                value={warehouse.warehouse_id}
              >
                {warehouse.warehouse_id}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn">ค้นหา</button>
      </form>

      <div className="flex justify-center">
        <div className="pagenumber">
          หน้า {page}
        </div>
      </div>




      {loading && <div className="loading">Loading...</div>}
      {error && <p className="error-message">{error}</p>}
      {productData.map((product, index) => (
        <ProductDetails
          key={index}
          productData={product}
          productIndex={index + 1 + (page - 1) * 30}
        />
      ))}

      <div className="pagination-container" style={{ marginBottom: '30px' }}>
        <button
          className="pagination-button"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span className="page-indicator">Page {page} of {totalPages}</span>
        <button
          className="pagination-button"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
