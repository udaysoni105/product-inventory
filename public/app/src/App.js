import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
// import * as Constants from "./constants/Constants";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
    <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/create" element={<ProductCreate />} />
        <Route path={`/edit/:id`} element={<ProductEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
