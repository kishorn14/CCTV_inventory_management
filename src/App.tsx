import { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedBrands } from './components/TrustedBrands';
import { GoogleReviews } from './components/GoogleReviews';
import { ProductCatalog } from './components/ProductCatalog';
import { EstimatorCalculator } from './components/EstimatorCalculator';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CctvEstimatorModal } from './components/CctvEstimatorModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { CategoryType, Product } from './types';

function MainApp() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.includes('admin') || hash.includes('admin') || search.includes('admin');
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<CategoryType>('cctv');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [isCatalogVisible, setIsCatalogVisible] = useState<boolean>(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsAdminRoute(path.includes('admin') || hash.includes('admin') || search.includes('admin'));

      if (hash.includes('products')) {
        setIsCatalogVisible(true);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo(0, 0);
  };

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo(0, 0);
  };

  const handleOpenBooking = (category: CategoryType = 'cctv') => {
    setBookingCategory(category);
    setIsBookingOpen(true);
  };

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsCatalogVisible(true);
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  if (isAdminRoute) {
    return <AdminPortal onGoToStore={navigateToStore} />;
  }

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <Navbar 
        onOpenBooking={() => handleOpenBooking('cctv')} 
        onOpenProducts={() => handleSelectCategory('all')}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
      />

      {/* Hero Showcase */}
      <Hero
        onOpenBooking={(cat) => handleOpenBooking(cat || 'cctv')}
        onSelectCategory={handleSelectCategory}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
      />

      {/* Authorized Dealer & Trusted CCTV Brand Partners (Hikvision, CP PLUS, Dahua, Uniview, Imou) */}
      <TrustedBrands />

      {/* Product Catalog & Category Filters - Only shown when user clicks Explore / Category */}
      {isCatalogVisible && (
        <ProductCatalog
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onViewProduct={(prod) => setViewProduct(prod)}
          onClose={() => setIsCatalogVisible(false)}
        />
      )}

      {/* Interactive CCTV Security Cost Estimator Teaser Section */}
      <EstimatorCalculator onOpenEstimator={() => setIsEstimatorOpen(true)} />

      {/* Google Reviews & Customer Testimonials (Connected to Google Maps Share Link) */}
      <GoogleReviews />

      {/* FAQs */}
      <FaqSection />

      {/* Shop Location & Contact Form */}
      <ContactSection />

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenBooking={() => handleOpenBooking('cctv')}
        onGoToAdmin={navigateToAdmin}
      />

      {/* Floating Sticky Actions (WhatsApp + Call) */}
      <FloatingActions onOpenBooking={() => handleOpenBooking('cctv')} />

      {/* Modals */}
      <ServiceBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCategory={bookingCategory}
      />

      <ProductDetailModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />

      {/* CCTV Cost Estimator Modal (Opens ONLY when user clicks Estimate Cost) */}
      <CctvEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
