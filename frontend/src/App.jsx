import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminEditProvider, useAdminEdit } from './context/AdminEditContext';
import AdminControlBar from './components/admin/AdminControlBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/admin/ProtectedRoute';

// ─── Public Pages ───────────────────────────────────────────────────────────
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import StartupStudio from './pages/StartupStudio';
import Portfolio from './pages/Portfolio';
import Careers from './pages/Careers';
import Internships from './pages/Internships';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// ─── Admin Pages ─────────────────────────────────────────────────────────────
import AdminLogin from './pages/admin/AdminLogin';
import Portal from './pages/Portal';
import UserManagement from './pages/admin/UserManagement';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Public site layout: Navbar + main content + Footer */
function PublicLayout() {
  const { isAdmin } = useAdminEdit();
  return (
    <ThemeProvider>
      <div className={`min-h-screen flex flex-col bg-lightBg text-slate-800 dark:bg-darkBg dark:text-slate-100 transition-colors duration-300 ${isAdmin ? 'pt-12' : ''}`}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/about"          element={<About />} />
            <Route path="/services"       element={<Services />} />
            <Route path="/products"       element={<Products />} />
            <Route path="/products/:id"   element={<ProductDetail />} />
            <Route path="/startup-studio" element={<StartupStudio />} />
            <Route path="/portfolio"      element={<Portfolio />} />
            <Route path="/careers"        element={<Careers />} />
            <Route path="/internships"    element={<Internships />} />
            <Route path="/blog"           element={<Blog />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/portal"         element={<Portal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminEditProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AdminControlBar />
          <Routes>
            {/* ── Admin routes ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/admin" element={<Navigate to="/" replace />} />

            {/* ── Public site routes (with Navbar/Footer) ── */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </AdminEditProvider>
    </AdminAuthProvider>
  );
}