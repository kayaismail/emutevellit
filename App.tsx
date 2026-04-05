import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        {/* Simple 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;