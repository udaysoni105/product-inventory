import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { categoryService, EditProduct, getProduct } from '../services/Service';
import * as Constants from "../constants/Constants";
import '../styles/ProductCreateEdit.css';

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProduct(id);
        setProduct(res.data.product);
      } catch (err) {
        console.log(err)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoryService();
        setCategories(data.data.data);
      } catch (err) {
        setError(err.message);
        toast.error(Constants.FETCH_CATEGORIES_FAILED);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [id]);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(Constants.NAME_REQUIRED)
      .max(255, Constants.PRODUCT_NAME_MAX_LENGTH),
    description: Yup.string()
      .nullable()
      .max(1000, Constants.DESCRIPTION_MAX),
    quantity: Yup.number()
      .typeError(Constants.QUANTITY_TYPE)
      .required(Constants.QUANTITY_REQUIRED)
      .min(0, Constants.QUANTITY_MIN)
      .integer(Constants.QUANTITY_INTEGER),
    categories: Yup.array()
      .min(1, Constants.CATEGORIES_MIN)
      .of(Yup.number().required(Constants.CATEGORY_REQUIRED)),
  });

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: id,
      name: product?.name || '',
      description: product?.description || '',
      quantity: product?.quantity ?? '',
      categories: product?.categories?.map(cat => cat.id) || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await EditProduct(values, id);
        toast.success(Constants.PRODUCT_EDIT_SUCCESS);
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || Constants.EDIT_PRODUCT_FAILED);
      }
    },
  });

  // Memoize formatted categories
  const formattedCategories = useMemo(
    () => categories.map(cat => ({ label: cat.name, value: cat.id })),
    [categories]
  );

  const selectedCategoryOptions = useMemo(() =>
    formattedCategories.filter(option => formik.values.categories.includes(option.value)),
    [formattedCategories, formik.values.categories]
  );

  // Custom dropdown arrow
  const CustomDropdownIndicator = (props) => {
    const { menuIsOpen } = props.selectProps;
    return (
      <components.DropdownIndicator {...props}>
        {menuIsOpen ? <FiChevronUp /> : <FiChevronDown />}
      </components.DropdownIndicator>
    );
  };

  return (
    <div className="product-form-wrapper">
      <div className="product-form-card">
        <form onSubmit={formik.handleSubmit} className="product-form">
          <div className="header-row">
            <div className="left-block">
              <h2 className="form-title">Edit Product</h2>
              <p className="form-subtitle">Fill in the details below to Edit product</p>
            </div>
            <div className="right-block">
              <div className="form-actions">
                <button type="button" onClick={() => navigate('/')} className="secondary-button">
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={loading || formik.isSubmitting}>
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="name" className="input-label">
              Product Name <span className="required-asterisk">*</span>
            </label>
            <input
              name="name"
              type="text"
              className={`text-input ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
              placeholder="Enter name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="validation-error">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="input-group">
            <label htmlFor="description" className="input-label">
              Description
            </label>
            <textarea
              name="description"
              className="text-area"
              placeholder="Enter description"
              rows="4"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="validation-error">{formik.errors.description}</div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="quantity" className="input-label">
              Quantity <span className="required-asterisk">*</span>
            </label>
            <input
              name="quantity"
              type="number"
              className={`number-input ${formik.touched.quantity && formik.errors.quantity ? 'input-error' : ''}`}
              placeholder="Enter quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
            />
            {formik.touched.quantity && formik.errors.quantity ? (
              <div className="validation-error">{formik.errors.quantity}</div>
            ) : null}
          </div>

          <div className="input-group">
              <label htmlFor="categories" className="input-label">
                Product Categories <span className="required-asterisk">*</span>
              </label>
              <div className="select-new">
                <Select
                  inputId="categories"
                  name="categories"
                  isMulti
                  isSearchable
                  options={formattedCategories}
                  placeholder="Filter by categories..."
                  classNamePrefix="select"
                  closeMenuOnSelect={false} 
                  value={selectedCategoryOptions}
                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions.map(option => option.value);
                    formik.setFieldValue('categories', selectedIds);
                  }}
                  menuPortalTarget={document.body}
                  menuPlacement="top"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (provided) => ({
                      ...provided,
                      marginBottom: '8px',
                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: '44px',
                    }),
                  }}
                  components={{
                    DropdownIndicator: CustomDropdownIndicator,
                    IndicatorSeparator: () => null,
                  }}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue ? "No categories found" : "No categories available"
                  }
                />
                {formik.touched.categories && formik.errors.categories && (
                  <div className="validation-error">{formik.errors.categories}</div>
                )}
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;