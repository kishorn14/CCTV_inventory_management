import { BookingFormData, Product } from '../types';

export const SHOP_INFO = {
  shopName: "Meksha Solutions",
  tagline: "CCTV, Vehicle Batteries & Inverters",
  phone: "+91 96066 78763",
  whatsappNumber: "919606678763", // Phone without + or symbols for WhatsApp API
  address: "Main Road, Opp. Bus Stand / City Center",
  city: "Bangalore & Surrounding Areas",
  email: "support@mekshasolutions.com",
  instagramUrl: "https://www.instagram.com/mekhasolutions?stkn=MWFlcnhkbzlpZmEybg==",
  googleMapsUrl: "https://share.google/Qdy82hkQa2UO5Axtj",
  workingHours: "8:00 AM – 9:00 PM",
  workingDays: "All 7 Days Open (Emergency Support Available)"
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
 * Formats a Service Booking into a WhatsApp message
 */
export function formatBookingMessage(booking: BookingFormData): string {
  const categoryLabels: Record<string, string> = {
    cctv: '📹 CCTV Surveillance System',
    battery: '🔋 Vehicle / Automotive Battery',
    inverter: '⚡ UPS & Inverter Power System',
    all: '🛠️ General Inquiry / Multi-Service'
  };

  const categoryName = categoryLabels[booking.category] || booking.category;
  const mapsLink = booking.locationMapUrl || (booking.gpsCoordinates ? `https://maps.google.com/?q=${booking.gpsCoordinates.lat},${booking.gpsCoordinates.lng}` : null);

  return `🛠️ *NEW SERVICE / INSTALLATION BOOKING*
*Shop:* ${SHOP_INFO.shopName}
---------------------------------
👤 *Customer Name:* ${booking.customerName}
📞 *Phone Number:* ${booking.phoneNumber}
📍 *Service Address:* ${booking.address}
${mapsLink ? `🗺️ *Live GPS Map Location:* ${mapsLink}` : `📌 _(Tip: Tap 📎 > 'Location' in WhatsApp to send exact live pin)_`}
🏷️ *Service Category:* ${categoryName}
🔧 *Service Type:* ${booking.serviceType}
⏰ *Preferred Date / Time:* ${booking.preferredTime || 'As soon as possible'}
${booking.notes ? `📝 *Special Notes:* ${booking.notes}` : ''}
---------------------------------
_Sent via ${SHOP_INFO.shopName} Doorstep Portal_`;
}

/**
 * Formats a Product Inquiry message for WhatsApp
 */
export function formatProductInquiry(product: Product): string {
  return `🛍️ *PRODUCT INQUIRY & PRICING*
*Shop:* ${SHOP_INFO.shopName}
---------------------------------
📦 *Product:* ${product.name}
🏷️ *Brand:* ${product.brand}
🛡️ *Warranty:* ${product.warranty}
💰 *Est. Price:* ${product.priceRange}

Hello, I am interested in purchasing/inquiring about this product. Please share availability, best price, and installation details.`;
}

/**
 * Formats an Estimate / Calculator message for WhatsApp
 */
export function formatEstimateMessage(title: string, details: string[]): string {
  return `📊 *ESTIMATE / QUOTE REQUEST*
*Shop:* ${SHOP_INFO.shopName}
---------------------------------
📌 *Requirement:* ${title}
${details.map(d => `• ${d}`).join('\n')}
---------------------------------
Please share a detailed price quotation, warranty terms, and installation timeline for this requirement. Thank you!`;
}
