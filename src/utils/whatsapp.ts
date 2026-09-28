import { BookingFormData, Product } from '../types';

export const SHOP_INFO = {
  shopName: "Meksha CCTV Solutions & Services",
  tagline: "Authorized CCTV Surveillance & Smart Security Cameras",
  phone: "+91 63664 06305",
  whatsappNumber: "916366406305", // Phone without + or symbols for WhatsApp API
  address: "#536/10, No. 4B Cross, Dollars Colony, Shamanur",
  city: "Davangere, Karnataka 577004",
  email: "support@mekshasolutions.com",
  instagramUrl: "https://www.instagram.com/mekhasolutions?stkn=MWFlcnhkbzlpZmEybg==",
  googleMapsUrl: "https://share.google/Qdy82hkQa2UO5Axtj",
  workingHours: "8:00 AM – 8:00 PM",
  workingDays: "All 7 Days Open (Doorstep Service Available)"
};

/**
 * Creates a clean wa.me URL with pre-filled encoded text
 */
export function createWhatsAppLink(message: string, phoneNumber: string = SHOP_INFO.whatsappNumber): string {
  let cleanPhone = (phoneNumber || SHOP_INFO.whatsappNumber).replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Formats a CCTV Service Booking into a WhatsApp message
 */
export function formatBookingMessage(booking: BookingFormData): string {
  const categoryLabels: Record<string, string> = {
    cctv: '📹 CCTV Camera System',
    kits: '📦 HD CCTV Camera Kit',
    wifi: '📶 Smart Wi-Fi / PTZ Camera',
    ip_nvr: '🌐 4K IP & Commercial NVR',
    solar_4g: '☀️ 4G SIM / Solar Camera',
    all: '🛠️ General CCTV Inquiry'
  };

  const categoryName = categoryLabels[booking.category] || '📹 CCTV Security Service';
  const mapsLink = booking.locationMapUrl || (booking.gpsCoordinates ? `https://maps.google.com/?q=${booking.gpsCoordinates.lat},${booking.gpsCoordinates.lng}` : null);

  return `🛠️ *NEW CCTV SERVICE / INSTALLATION BOOKING*
*Shop:* ${SHOP_INFO.shopName}
---------------------------------
👤 *Customer Name:* ${booking.customerName}
📞 *Phone Number:* ${booking.phoneNumber}
📍 *Service Address:* ${booking.address}
${mapsLink ? `🗺️ *Live GPS Map Location:* ${mapsLink}` : `📌 _(Tip: Tap 📎 > 'Location' in WhatsApp to send exact live pin)_`}
🏷️ *Requirement:* ${categoryName}
🔧 *Service Requested:* ${booking.serviceType}
⏰ *Preferred Date / Time:* ${booking.preferredTime || 'As soon as possible'}
${booking.notes ? `📝 *Special Notes:* ${booking.notes}` : ''}
---------------------------------
_Sent via ${SHOP_INFO.shopName} Doorstep Portal_`;
}

/**
 * Formats a Product Inquiry message for WhatsApp
 */
export function formatProductInquiry(product: Product): string {
  return `📹 *CCTV CAMERA INQUIRY & PRICING*
*Shop:* ${SHOP_INFO.shopName}
---------------------------------
📦 *Camera / Kit:* ${product.name}
🏷️ *Brand:* ${product.brand}
🛡️ *Warranty:* ${product.warranty}
💰 *Est. Price:* ${product.priceRange}

Hello, I am interested in purchasing/inquiring about this CCTV system. Please share availability, best price, and installation details.`;
}

/**
 * Formats an Estimate / Calculator message for WhatsApp
 */
export function formatEstimateMessage(title: string, details: string[]): string {
  return `📊 *CCTV ESTIMATE / QUOTE REQUEST*
*Shop:* ${SHOP_INFO.shopName}
---------------------------------
📌 *Requirement:* ${title}
${details.map(d => `• ${d}`).join('\n')}
---------------------------------
Please share a detailed price quotation, warranty terms, and installation timeline for this CCTV setup. Thank you!`;
}
