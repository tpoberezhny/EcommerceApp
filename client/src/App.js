import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:productId' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route exact path='/checkout' element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;