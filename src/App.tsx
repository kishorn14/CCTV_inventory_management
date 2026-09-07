import { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProductCatalog } from './components/ProductCatalog';
import { EstimatorCalculator } from './components/EstimatorCalculator';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
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
  const [bookingCategory, setBookingCategory] = useState<CategoryType>('cctv');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsAdminRoute(path.includes('admin') || hash.includes('admin') || search.includes('admin'));
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
  };

  if (isAdminRoute) {
    return <AdminPortal onGoToStore={navigateToStore} />;
  }

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking('cctv')} />

      {/* Hero Showcase */}
      <Hero
        onOpenBooking={(cat) => handleOpenBooking(cat || 'cctv')}
        onSelectCategory={handleSelectCategory}
      />

      {/* Services Section */}
      <ServicesSection onOpenBooking={handleOpenBooking} />

      {/* Product Catalog & Category Filters */}
      <ProductCatalog
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onViewProduct={(prod) => setViewProduct(prod)}
      />

      {/* Interactive CCTV & Inverter Cost / Load Estimator */}
      <EstimatorCalculator />

      {/* Trust Badges & Authorized Brands */}
      <WhyChooseUs />

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
