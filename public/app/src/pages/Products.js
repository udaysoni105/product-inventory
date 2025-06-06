import { useEffect, useRef, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { RiDeleteBin5Fill, RiPencilFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { commonDateFormate } from "../helpers/utils";
import { categoryService, DeleteProduct, ProductList } from '../services/Service';
import * as Constants from "../constants/Constants";
import '../styles/Product.css';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sortRef = useRef([{ field: 'created_at', sort: 'desc' }]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoryService();
        setCategories(data.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [paginationModel.page, paginationModel.pageSize, sortModel, searchQuery, selectedCategories]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [searchQuery, selectedCategories]);

  const formatCategories = (cats) => {
    return cats.map(cat => ({
      label: cat.name,
      value: cat.id,
    }));
  };

  const fetchProducts = async () => {
    try {
      const data = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        order: sortModel.length > 0 ? sortModel[0].field : sortRef.current[0].field,
        order_type: sortModel.length > 0 ? sortModel[0].sort : sortRef.current[0].sort,
        filter: searchQuery,
        category_ids: selectedCategories.map(cat => cat.value),
      };
      const res = await ProductList(data);
      setProducts(res.data.data.products);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      toast.error(Constants.LOAD_PRODUCTS_FAILED);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteProduct(id);
      toast.success(Constants.PRODUCT_DELETED_SUCCESS);
      fetchProducts();
    } catch (error) {
      toast.error(Constants.DELETE_PRODUCT_FAILED);
      console.error(error);
    }
  };

  const changePage = (num) => {
    if (num < 1 || num > totalPages) return;
    setPaginationModel((prev) => ({ ...prev, page: num - 1 }));
  };

  return (
    <div className="products-container ">
      <div className="products-header">
        <div className="header-text">
          <h1>Products</h1>
          <p>Optimize your latest operations with a powerful product catalogue system.</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => navigate('/create')}
            className="btn btn-primary"
          >
            Create Product
          </button>
        </div>
      </div>

      <div className="products-controls">
        <div className="search-filter">
          <div className="search-box">
            <span className="search-icon"><FiSearch size={18} /></span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
              autoFocus
            />
          </div>
          <div className="select-wrapper">
            <Select
              isMulti
              options={formatCategories(categories)}
              placeholder="Filter by categories..."
              className="react-select"
              value={selectedCategories}
              onChange={setSelectedCategories}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }}
            />
          </div>
        </div>
        <div className="active-tab">
          <span className="active">Active</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-data-message">No products Data found.</div>
      ) : (
        <>
          <div className="products-table-container">

            <table className="products-table">
              <thead>
                <tr>
                  {/* <th>Id</th> */}
                  <th>Product Name</th>
                  <th>Categories</th>
                  <th>Created On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    {/* <td>{product.id}</td> */}
                    <td>{product.name}</td>
                    {/* <td>{product.categories?.map((cat) => cat.name).join(', ')}</td> */}
                    <td>
                      <div className="tag-wrapper">
                        {product.categories?.map((cat, idx) => (
                          <span key={idx} className="tag">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{commonDateFormate(product.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" title="Edit">
                          <RiPencilFill style={{ color: 'blue' }} onClick={() => navigate(`/edit/${product.id}`)} size={25} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          <RiDeleteBin5Fill size={25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="products-footer">
            <div className="pagination-info">
              <span>Items per page:</span> {products.length}
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={paginationModel.page === 0}
                onClick={() => changePage(paginationModel.page)}
              >
                Previous
              </button>
              {(() => {
                const maxButtons = 5;
                let currentPage = paginationModel.page + 1;
                let startPage = currentPage;
                if (startPage + maxButtons - 1 > totalPages) {
                  startPage = Math.max(totalPages - maxButtons + 1, 1);
                }
                startPage = Math.max(startPage, 1);
                const pageNumbers = [];
                for (let i = 0; i < maxButtons && startPage + i <= totalPages; i++) {
                  pageNumbers.push(startPage + i);
                }
                return pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => changePage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
              <button
                className="pagination-btn"
                disabled={paginationModel.page === totalPages - 1}
                onClick={() => changePage(paginationModel.page + 2)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
