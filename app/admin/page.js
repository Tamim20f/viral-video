'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Admin() {
  const [state, setState] = useState('loading');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [premium, setPremium] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return setState('login');
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
      setState(data && data.is_admin ? 'ok' : 'denied');
    })();
  }, []);

  async function upload() {
    if (!title || !file) return setMsg('টাইটেল ও ভিডিও দিন');
    setMsg('আপলোড হচ্ছে, অপেক্ষা করুন...');
    const ext = file.name.split('.').pop();
    const path = Date.now() + '.' + ext;
    const up = await supabase.storage.from('videos').upload(path, file);
    if (up.error) return setMsg('ত্রুটি: ' + up.error.message);
    const ins = await supabase.from('videos').insert({ title, is_premium: premium, video_id: path, published: true });
    if (ins.error) return setMsg('ত্রুটি: ' + ins.error.message);
    setMsg('আপলোড সম্পন্ন! হোমপেজে এক মিনিটের মধ্যে দেখা যাবে।');
    setTitle('');
    setFile(null);
  }

  const box = { display: 'block', width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: '1px solid #333', background: '#1c1c22', color: '#fff', fontSize: 16, boxSizing: 'border-box' };

  if (state === 'loading') return <main style={{ padding: 20 }}>লোড হচ্ছে...</main>;
  if (state === 'login') return <main style={{ padding: 20 }}>আগে <a href="/login" style={{ color: '#f5b301' }}>লগইন করুন</a></main>;
  if (state === 'denied') return <main style={{ padding: 20 }}>আপনি অ্যাডমিন নন।</main>;

  return (
    <main style={{ padding: 20, maxWidth: 480 }}>
      <h2>অ্যাডমিন প্যানেল</h2>
      <input style={box} placeholder="ভিডিওর টাইটেল" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input style={box} type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
      <label style={{ display: 'block', margin: '10px 0' }}>
        <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> প্রিমিয়াম ভিডিও
      </label>
      <button onClick={upload} style={{ padding: '12px 18px', borderRadius: 8, border: 0, background: '#f5b301', fontWeight: 700, fontSize: 16 }}>আপলোড</button>
      <p>{msg}</p>
    </main>
  );
}
