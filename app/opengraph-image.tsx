import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Our Coding Kiddos - Learn to Code';
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
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '40px',
            padding: '60px 80px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              CK
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1e293b',
              }}
            >
              Coding Kiddos
            </div>
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            Turn Your Child Into a
          </div>
          <div
            style={{
              fontSize: '84px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            Future Coder
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            Fun coding courses for ages 7-18 • HTML • CSS • JavaScript • Python • Roblox
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
