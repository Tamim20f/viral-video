import { supabase } from '../lib/supabase';

export const revalidate = 30;

export default async function Home() {
  const { data: videos } = await supabase
    .from('videos')
    .select('id,title,thumbnail_url,is_premium')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: 20, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
      {(videos || []).map((v) => (
        <a key={v.id} href={`/watch/${v.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', background: '#1c1c22', borderRadius: 10, overflow: 'hidden' }}>
            {v.thumbnail_url && (
              <img src={v.thumbnail_url} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            {v.is_premium && (
              <span style={{ position: 'absolute', top: 8, right: 8, background: '#f5b301', color: '#000', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                PREMIUM
              </span>
            )}
          </div>
          <p style={{ margin: '8px 0 0' }}>{v.title}</p>
        </a>
      ))}
      {(!videos || videos.length === 0) && <p>এখনো কোনো ভিডিও নেই।</p>}
    </main>
  );
}
