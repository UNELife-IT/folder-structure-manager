const SHAREPOINT_URL =
  'https://myune.sharepoint.com/:f:/r/sites/UNELife2/New%20Sharepoint/Forms/AllItems.aspx';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', background: 'var(--bg-primary)'
    }}>
      <div style={{
        maxWidth: 560, width: '100%', textAlign: 'center',
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '40px 32px'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🗂️</div>
        <h1 style={{
          fontSize: '1.5rem', fontWeight: 700, marginBottom: 16,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Folder Structure Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
          Please refer to the SharePoint for any further changes.
        </p>
        <a
          href={SHAREPOINT_URL}
          style={{
            display: 'inline-block', padding: '12px 24px',
            background: 'var(--gradient-primary)', color: '#0a1410',
            fontWeight: 600, borderRadius: 'var(--radius-sm)', textDecoration: 'none'
          }}
        >
          Open the SharePoint
        </a>
        <p style={{
          marginTop: 20, fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all'
        }}>
          {SHAREPOINT_URL}
        </p>
      </div>
    </main>
  );
}
