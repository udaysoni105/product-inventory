import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { categoryService, createProduct } from '../services/Service';
import '../styles/ProductCreateEdit.css';

const ProductCreate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatCategories = (cats) => {
    return cats.map(cat => ({
      label: cat.name,
      value: cat.id,
    }));
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.')
      .max(255, 'Name must be at most 255 characters.'),
    description: Yup.string()
      .nullable()
      .max(1000, 'Description must be at most 1000 characters.'),
    quantity: Yup.number()
      .typeError('Quantity must be a number.')
      .required('Quantity is required.')
      .min(0, 'Quantity cannot be negative.')
      .test(
        'is-valid-format',
        'Quantity format is invalid.',
        (value) => /^[\d\s\-()+]+$/.test(String(value))
      ),
    categories: Yup.array()
      .of(Yup.number().required('Category is required.'))
      .min(1, 'At least one category is required.'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      quantity: '',
      categories: [],
    },
    validationSchema,
    onSubmit: values => {
      handleSubmit(values);
    }
  });
  const handleSubmit = async (values) => {
    try {
      const response = await createProduct(values);
      navigate('/');
      formik.resetForm();
      toast.success('Product created successfully!');

    } catch (error) {
      // toast.error('Failed to create product. Please try again.');
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="product-form-wrapper">
      <div className="product-form-card">
        <form onSubmit={formik.handleSubmit} className="product-form">
          <div className="header-row">
            <div className="left-block">
              <h2 className="form-title">Create Product</h2>
              <p className="form-subtitle">Fill in the details below to add a new product</p>
            </div>
            <div className="right-block">
              <div className="form-actions">
                <button type="button" onClick={() => navigate('/')} className="secondary-button">
                  Cancel
                </button>
                <button type="submit" className="primary-button">
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
              min="1"
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
                isMulti
                isSearchable
                options={formatCategories(categories)}
                placeholder="Filter by categories..."
                classNamePrefix="select"
                value={formatCategories(categories).filter(option =>
                  formik.values.categories.includes(option.value)
                )}
                onChange={(selectedOptions) => {
                  const selectedIds = selectedOptions.map(option => option.value);
                  setSelectedCategories(selectedOptions);
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
                  DropdownIndicator: () => null,
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

export default ProductCreate;