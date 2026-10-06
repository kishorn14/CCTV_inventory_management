import { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { GoogleReviews } from './components/GoogleReviews';
import { ProductCatalog } from './components/ProductCatalog';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CameraFootageModal } from './components/CameraFootageModal';
import { CctvCostEstimator } from './components/CctvCostEstimator';
import { AdminPortal } from './components/admin/AdminPortal';
import { CategoryType, Product } from './types';
import { Phone, MessageCircle, ShieldCheck, MapPin, CheckCircle2, Calculator } from 'lucide-react';

function MainApp() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.includes('admin') || hash.includes('admin') || search.includes('admin');
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<CategoryType>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [footageProduct, setFootageProduct] = useState<Product | null>(null);

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

  const handleOpenBooking = (category: CategoryType = 'all') => {
    setBookingCategory(category);
    setIsBookingOpen(true);
  };

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isAdminRoute) {
    return <AdminPortal onGoToStore={navigateToStore} />;
  }

  return (
    <div className="app-wrapper">
      {/* 1. Top Contact Bar & Main Navigation Header */}
      <Navbar 
        onOpenBooking={() => handleOpenBooking('all')} 
        onOpenProducts={() => handleSelectCategory('all')}
      />

      {/* 2. Compact, Direct Store Hero Strip (No long text or quotes, straight to the point) */}
      <div style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 0 16px 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            <ShieldCheck size={15} /> Authorized Dealer · Wholesale &amp; Retail Store
          </div>

          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            CCTV Security Cameras &amp; Accessories in <span style={{ color: '#2563eb' }}>Davanagere</span>
          </h1>

          <p style={{
            color: '#475569',
            fontSize: '0.94rem',
            maxWidth: '650px',
            margin: '0 auto 16px auto',
            lineHeight: 1.5
          }}>
            Direct shop prices on CP PLUS IP cameras, Trueview 360° Wi-Fi cameras, 4G solar setups, DVR/NVR units, Seagate hard disks, PoE switches, and cabling accessories.
          </p>

          {/* Quick Trust Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '6px' }}>
              <CheckCircle2 size={14} /> Genuine Brand Warranty
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '6px' }}>
              <CheckCircle2 size={14} /> GST Invoicing Included
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '6px' }}>
              <MapPin size={14} /> Same-Day Fitting in Davanagere
            </span>
          </div>

          {/* Direct CTA Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <a
              href="#cctv-cost-estimator"
              className="btn btn-primary"
              style={{
                fontSize: '0.9rem',
                padding: '8px 18px',
                borderRadius: '8px',
                gap: '6px'
              }}
            >
              <Calculator size={16} />
              Instant Cost Estimator
            </a>

            <a
              href="tel:6366406305"
              className="btn btn-call"
              style={{
                fontSize: '0.9rem',
                padding: '8px 18px',
                borderRadius: '8px',
                gap: '6px'
              }}
            >
              <Phone size={16} />
              Call: +91 63664 06305
            </a>

            <a
              href="https://wa.me/916366406305?text=Hello%20Meksha%20CCTV%20Solutions%2C%20I%20would%20like%20to%20get%20a%20quotation%20for%20cameras."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{
                fontSize: '0.9rem',
                padding: '8px 18px',
                borderRadius: '8px',
                gap: '6px'
              }}
            >
              <MessageCircle size={16} />
              Request Quote on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* 3. Live CCTV Package Cost Estimator (Interactive Component Configurator) */}
      <CctvCostEstimator />

      {/* 4. Product Catalog Grid (All 50 Products from MyBillBook - Always Visible & Interactive) */}
      <ProductCatalog
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onViewProduct={(prod) => setViewProduct(prod)}
        onOpenFootageModal={(prod) => setFootageProduct(prod)}
      />

      {/* 4. Google Reviews (From Davanagere Customers - Identical to reference site carousel) */}
      <GoogleReviews />

      {/* 5. Shop Location & Direct Contact Section */}
      <ContactSection />

      {/* 6. Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenBooking={() => handleOpenBooking('all')}
        onGoToAdmin={navigateToAdmin}
      />

      {/* 7. Floating Sticky Bottom Bar for Mobile */}
      <FloatingActions onOpenBooking={() => handleOpenBooking('all')} />

      {/* 8. Modals */}
      <ServiceBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCategory={bookingCategory}
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
