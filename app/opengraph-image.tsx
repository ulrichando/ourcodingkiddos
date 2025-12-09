import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Coding Kiddos - Online Coding Classes for Kids Ages 7-18';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Logo and brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {/* Logo placeholder - gradient square */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
            }}
          >
            CK
          </div>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            Coding Kiddos
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: '42px',
            fontWeight: '600',
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            maxWidth: '900px',
            lineHeight: 1.2,
          }}
        >
          Online Coding Classes for Kids Ages 7-18
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Learn JavaScript, Python, HTML & Game Development with Live Instructors
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          {['Live Classes', 'Game Dev', 'Web Dev', 'Beginner Friendly'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '18px',
                color: 'white',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          ourcodingkiddos.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
