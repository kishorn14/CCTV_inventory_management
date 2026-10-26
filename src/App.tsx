import { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { GoogleReviews } from './components/GoogleReviews';
import { OurCustomers } from './components/OurCustomers';
import { ProductCatalog } from './components/ProductCatalog';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CameraFootageModal } from './components/CameraFootageModal';
import { CctvCostEstimator } from './components/CctvCostEstimator';
import { AdminPortal } from './components/admin/AdminPortal';
import { SiteVisitApp } from './components/site-visit/SiteVisitApp';
import { CategoryType, Product } from './types';
import { Calculator, Wrench } from 'lucide-react';

type AppRoute = 'store' | 'admin' | 'site-visit';

function MainApp() {
  const getInitialRoute = (): AppRoute => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('site-visit') || hash.includes('site-visit') || search.includes('site-visit')) {
      return 'site-visit';
    }
    if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
      return 'admin';
    }
    return 'store';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [footageProduct, setFootageProduct] = useState<Product | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);

  const handleOpenEstimator = () => {
    setIsEstimatorOpen(true);
  };

  const handleCloseEstimator = () => {
    setIsEstimatorOpen(false);
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('site-visit') || hash.includes('site-visit') || search.includes('site-visit')) {
        setCurrentRoute('site-visit');
      } else if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('store');
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
    setCurrentRoute('admin');
    window.scrollTo(0, 0);
  };

  const navigateToSiteVisit = () => {
    window.history.pushState({}, '', '/site-visit');
    setCurrentRoute('site-visit');
    window.scrollTo(0, 0);
  };

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('store');
    window.scrollTo(0, 0);
  };

  const handleOpenBooking = (serviceId?: string) => {
    setBookingServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (currentRoute === 'site-visit') {
    return <SiteVisitApp onGoToStore={navigateToStore} onGoToAdmin={navigateToAdmin} />;
  }

  if (currentRoute === 'admin') {
    return <AdminPortal onGoToStore={navigateToStore} onGoToSiteVisit={navigateToSiteVisit} />;
  }

  return (
    <div className="app-wrapper">
      {/* 1. Top Contact Bar & Main Navigation Header */}
      <Navbar 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenProducts={() => handleSelectCategory('all')}
        onOpenEstimator={handleOpenEstimator}
      />

      {/* 2. Compact, Direct Store Hero Strip (No long text or quotes, straight to the point) */}
      <div style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 0 10px 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 3.8vw, 2rem)',
            fontWeight: 900,
            color: '#000000',
            lineHeight: 1.2,
            marginBottom: '10px',
            letterSpacing: '-0.02em'
          }}>
            CCTV Security Cameras &amp; Accessories in Davanagere
          </h1>

          {/* Direct CTA Buttons (Strictly Side-by-side on all screens) */}
          <div className="hero-cta-group">
            <button
              onClick={handleOpenEstimator}
              className="hero-cta-btn primary"
            >
              <Calculator size={16} />
              <span>Instant Cost Estimator</span>
            </button>

            <button
              onClick={() => handleOpenBooking()}
              className="hero-cta-btn outline"
            >
              <Wrench size={16} />
              <span>Request Service</span>
            </button>
          </div>
        </div>
      </div>



      {/* 4. Product Catalog Grid (All 50 Products from MyBillBook - Always Visible & Interactive) */}
      <ProductCatalog
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onViewProduct={(prod) => setViewProduct(prod)}
        onOpenFootageModal={(prod) => setFootageProduct(prod)}
        onOpenEstimator={handleOpenEstimator}
      />

      {/* 5. Our Valued Customers & Commercial Security Installations */}
      <OurCustomers />

      {/* 4. Google Reviews (From Davanagere Customers - Identical to reference site carousel) */}
      <GoogleReviews />

      {/* 5. Shop Location & Direct Contact Section */}
      <ContactSection />

      {/* 6. Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenBooking={(srvId) => handleOpenBooking(srvId)}
        onGoToAdmin={navigateToAdmin}
      />

      {/* 7. Floating Sticky Bottom Bar for Mobile */}
      <FloatingActions onOpenBooking={() => handleOpenBooking()} />

      {/* 8. Modals & Overlays */}
      {isEstimatorOpen && (
        <CctvCostEstimator onClose={handleCloseEstimator} />
      )}

      <ServiceBookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingServiceId(undefined);
        }}
        initialServiceId={bookingServiceId}
      />

      <ProductDetailModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onWatchFootage={(prod) => setFootageProduct(prod)}
      />

      <CameraFootageModal
        product={footageProduct}
        onClose={() => setFootageProduct(null)}
      />
    </div>
  );
}

export function App() {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}

export default App;
