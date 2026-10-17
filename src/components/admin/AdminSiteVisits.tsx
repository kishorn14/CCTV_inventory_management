import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Trash2, 
  Calendar, 
  Image as ImageIcon, 
  X, 
  Eye, 
  MessageSquare,
  ClipboardCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SiteVisit, SiteVisitStatus } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const AdminSiteVisits: React.FC = () => {
  const { siteVisits, updateSiteVisit, deleteSiteVisit, shopInfo } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedTechnicianFilter, setSelectedTechnicianFilter] = useState<string>('all');

  // Photo Lightbox Modal
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [visitToDelete, setVisitToDelete] = useState<SiteVisit | null>(null);

  // Extract unique technicians for filter
  const uniqueTechnicians = Array.from(new Set(siteVisits.map(v => v.technicianName).filter(Boolean)));

  // Filter site visits
  const filteredVisits = siteVisits.filter(visit => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      visit.visitNumber.toLowerCase().includes(q) ||
      visit.customerName.toLowerCase().includes(q) ||
      visit.customerPhone.toLowerCase().includes(q) ||
      visit.customerAddress.toLowerCase().includes(q) ||
      visit.technicianName.toLowerCase().includes(q) ||
      (visit.landmark && visit.landmark.toLowerCase().includes(q)) ||
      (visit.enquiryNotes && visit.enquiryNotes.toLowerCase().includes(q));

    const matchesStatus = selectedStatusFilter === 'all' || visit.status === selectedStatusFilter;
    const matchesTech = selectedTechnicianFilter === 'all' || visit.technicianName === selectedTechnicianFilter;

    return matchesSearch && matchesStatus && matchesTech;
  });

  // KPI counts
  const totalVisits = siteVisits.length;
  const newVisits = siteVisits.filter(v => v.status === 'New').length;
  const quotationSent = siteVisits.filter(v => v.status === 'Quotation Sent').length;
  const completedVisits = siteVisits.filter(v => v.status === 'Completed').length;
  const totalPhotos = siteVisits.reduce((acc, v) => acc + (v.photos?.length || 0), 0);

  const getStatusBadgeStyle = (status: SiteVisitStatus) => {
    switch (status) {
      case 'New':
        return { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' };
      case 'Quotation Sent':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'Follow Up':
        return { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' };
      case 'Completed':
        return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'Cancelled':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    }
  };

  const handleOpenCustomerWhatsApp = (visit: SiteVisit) => {
    const cleanPhone = visit.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const msg = `👋 Hello ${visit.customerName},\n\nThis is regarding the CCTV security site inspection conducted at your premises (${visit.customerAddress}) by our technician *${visit.technicianName}* (Inspection Ref: *${visit.visitNumber}*).\n\nWe have reviewed your requirements for *${visit.enquiredSystem || 'CCTV Cameras'}* and have prepared an official quotation for you from *${shopInfo.shopName}*.\n\nPlease let us know a convenient time to discuss. Thank you!`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div>
      {/* Top Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
            Field Site Visits &amp; Customer Inspections
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Inspect on-site technician logs, captured GPS satellite locations, customer requirements, and property photos.
          </p>
        </div>

        {/* Technician App Direct Link Button */}
        <a
          href="/site-visit"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            padding: '9px 16px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
          }}
          title="Open the Field Site Visit App used by technicians (Password: admin@2026)"
        >
          <ExternalLink size={15} />
          <span>Open Field Site Visit App (/site-visit)</span>
        </a>
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Site Visits
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
            {totalVisits}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>
            New Inspections
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>
            {newVisits}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
            Quotation Sent
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
            {quotationSent}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>
            Completed Orders
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>
            {completedVisits}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Site Photos Logged
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#475569', marginTop: '2px' }}>
            {totalPhotos}
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '14px 16px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search by customer name, phone, address, visit #, or technician..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: '#ffffff'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Technician Filter */}
        {uniqueTechnicians.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Technician:</span>
            <select
              value={selectedTechnicianFilter}
              onChange={e => setSelectedTechnicianFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: '#ffffff'
              }}
            >
              <option value="all">All Technicians</option>
              {uniqueTechnicians.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Site Visits List */}
      {filteredVisits.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '40px 20px',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          color: '#64748b'
        }}>
          <ClipboardCheck size={42} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            {siteVisits.length === 0 ? 'No Site Visits Logged Yet' : 'No Matches Found'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            {siteVisits.length === 0 
              ? 'When your technician visits a customer site and submits an inspection report from /site-visit, it will automatically appear here.'
              : 'Try clearing your search query or status filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredVisits.map(visit => {
            const statusStyle = getStatusBadgeStyle(visit.status);

            return (
              <div
                key={visit.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Row 1: Visit Number, Date, Status & Delete */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#1e3a8a',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em'
                    }}>
                      {visit.visitNumber}
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      color: '#64748b'
                    }}>
                      <Calendar size={13} />
                      <span>{visit.formattedDate}</span>
                    </span>

                    <span style={{
                      fontSize: '0.78rem',
                      color: '#15803d',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      👨‍🔧 Inspector: {visit.technicianName}
                    </span>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      value={visit.status}
                      onChange={e => updateSiteVisit(visit.id, { status: e.target.value as SiteVisitStatus })}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${statusStyle.border}`,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="New">Status: New</option>
                      <option value="Quotation Sent">Status: Quotation Sent</option>
                      <option value="Follow Up">Status: Follow Up</option>
                      <option value="Completed">Status: Completed</option>
                      <option value="Cancelled">Status: Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setVisitToDelete(visit)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        color: '#dc2626',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete site visit record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Row 2: Customer & Site Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '14px'
                }}>
                  {/* Left Column: Customer & Location */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {visit.customerName}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>📞 {visit.customerPhone}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenCustomerWhatsApp(visit)}
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#059669',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <MessageSquare size={11} />
                        <span>Chat WhatsApp</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                      <strong>Site Address:</strong> {visit.customerAddress}
                      {visit.landmark && <span> (Landmark: {visit.landmark})</span>}
                    </div>

                    {/* GPS Map Link */}
                    {(visit.gpsLocation?.mapUrl || visit.manualMapUrl) && (
                      <div style={{ marginTop: '4px' }}>
                        <a
                          href={visit.gpsLocation?.mapUrl || visit.manualMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <MapPin size={13} color="#2563eb" />
                          <span>
                            {visit.gpsLocation?.lat 
                              ? `Open Exact GPS Map (${visit.gpsLocation.lat.toFixed(4)}, ${visit.gpsLocation.lng.toFixed(4)})` 
                              : 'Open Location on Google Maps'}
                          </span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Customer Enquiry & Requirements */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {visit.propertyType && (
                        <span style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          🏢 {visit.propertyType}
                        </span>
                      )}

                      {visit.enquiredSystem && (
                        <span style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1d4ed8',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          📹 {visit.enquiredSystem}
                        </span>
                      )}

                      {visit.cameraCount && (
                        <span style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#15803d',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          Qty: {visit.cameraCount}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#1e293b', marginTop: '2px', lineHeight: 1.45 }}>
                      <strong>Technician Notes:</strong> {visit.enquiryNotes || 'No extra notes recorded.'}
                    </div>
                  </div>
                </div>

                {/* Row 3: Site Inspection Photos Gallery */}
                {visit.photos && visit.photos.length > 0 && (
                  <div style={{ paddingTop: '6px', borderTop: '1px dashed #e2e8f0' }}>
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#64748b',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <ImageIcon size={13} color="#2563eb" />
                      <span>Captured Site Photos ({visit.photos.length}) — Click to view in full size:</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      overflowX: 'auto',
                      paddingBottom: '4px'
                    }}>
                      {visit.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setPreviewPhoto(photo)}
                          style={{
                            width: '74px',
                            height: '74px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                            flexShrink: 0,
                            position: 'relative'
                          }}
                          title="Click to view full photo"
                        >
                          <img
                            src={photo}
                            alt={`Site Photo ${pIdx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.15s ease'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                          >
                            <Eye size={16} color="#ffffff" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- PHOTO LIGHTBOX MODAL --- */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#000000',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>
            <img
              src={previewPhoto}
              alt="Site Inspection Preview"
              style={{
                maxWidth: '85vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {visitToDelete && (
        <ConfirmDeleteModal
          isOpen={!!visitToDelete}
          onClose={() => setVisitToDelete(null)}
          onConfirm={() => {
            deleteSiteVisit(visitToDelete.id);
            setVisitToDelete(null);
          }}
          title="Delete Site Inspection Record"
          subtitle={`Are you sure you want to permanently delete site visit record ${visitToDelete.visitNumber} for customer ${visitToDelete.customerName}?`}
          warningNote="This inspection report, location coordinates, customer enquiry, and site photos will be permanently removed."
          confirmLabel="Yes, Delete Visit"
          item={{
            title: `${visitToDelete.visitNumber} - ${visitToDelete.customerName}`,
            category: visitToDelete.propertyType,
            brand: `By: ${visitToDelete.technicianName}`,
            badge: visitToDelete.status.toUpperCase(),
            price: visitToDelete.enquiredSystem
          }}
        />
      )}
    </div>
  );
};
