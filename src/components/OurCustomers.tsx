import React from 'react';

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  height: number;
}

const CLIENT_LOGOS: ClientLogo[] = [
  {
    id: 'jockey-davangere',
    name: 'Jockey Showroom Davangere',
    logo: '/customers/jockey_clean_logo.svg',
    height: 36
  },
  {
    id: 'balaji-tractors',
    name: 'Balaji Tractors',
    logo: '/customers/balaji_tractors_clean_logo.png',
    height: 38
  },
  {
    id: 'oben-electric',
    name: 'Oben Electric (Balaji Motors)',
    logo: '/customers/oben_electric_clean_logo.png',
    height: 40
  },
  {
    id: 'balaji-kinetics',
    name: 'Balaji Kinetics',
    logo: '/customers/balaji_kinetics_clean_logo.png',
    height: 34
  }
];

export const OurCustomers: React.FC = () => {
  // Repeat to ensure seamless continuous horizontal scrolling
  const scrollList = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section 
      id="our-customers"
      style={{
        padding: '38px 0 34px',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Centered Heading exactly matching reference image */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <h3 style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#1e3a8a',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.3
          }}>
            TRUSTED CLIENTS
          </h3>

          {/* Reference Image Decorative Divider with Red Diamond */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px'
          }}>
            <div style={{ width: '48px', height: '1.5px', background: '#94a3b8' }} />
            <div style={{
              width: '7px',
              height: '7px',
              border: '1.5px solid #dc2626',
              transform: 'rotate(45deg)',
              background: '#ffffff'
            }} />
            <div style={{ width: '48px', height: '1.5px', background: '#94a3b8' }} />
          </div>
        </div>

      </div>

      {/* Horizontally Scrollable Marquee Strip */}
      <div 
        className="trusted-clients-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Left & Right subtle edge fade */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50px',
          height: '100%',
          background: 'linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0))',
          zIndex: 2,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50px',
          height: '100%',
          background: 'linear-gradient(to left, #ffffff, rgba(255, 255, 255, 0))',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        <div className="trusted-clients-track">
          {scrollList.map((client, idx) => (
            <div 
              key={`${client.id}-${idx}`}
              className="trusted-client-item"
              title={client.name}
            >
              <img 
                src={client.logo} 
                alt={client.name}
                style={{
                  height: `${client.height}px`,
                  maxHeight: '44px',
                  maxWidth: '220px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trusted-clients-wrapper {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .trusted-clients-wrapper::-webkit-scrollbar {
          display: none;
        }
        .trusted-clients-track {
          display: flex;
          align-items: center;
          gap: 70px;
          padding: 8px 30px;
          white-space: nowrap;
          animation: marqueeScroll 24s linear infinite;
          width: max-content;
        }
        .trusted-clients-track:hover {
          animation-play-state: paused;
        }
        .trusted-client-item {
          display: flex;
          align-items: center;
          justifyContent: center;
          flex-shrink: 0;
          height: 52px;
          padding: 0 10px;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (max-width: 768px) {
          .trusted-clients-track {
            gap: 40px;
            animation-duration: 18s;
          }
        }
      `}</style>
    </section>
  );
};
