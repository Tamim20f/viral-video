export const metadata = {
  title: 'Viral Video',
  description: 'Viral Video - video sharing website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#0f0f12', color: '#fff' }}>
        <header style={{ padding: '16px 20px', borderBottom: '1px solid #26262c' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 22, fontWeight: 700 }}>
            Viral Video
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
