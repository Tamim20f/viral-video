'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Admin() {
  const [state, setState] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [premium, setPremium] = useState(false);
  const [msg, setMsg] = useState('');

  async function check() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setState('login'); return; }
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
    setState(data && data.is_admin ? 'ok' : 'denied');
  }

  useEffect(() => { check(); }, []);

  async function signIn() {
    setMsg('অপেক্ষা করুন...');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setMsg('লগইন হয়নি: ' + error.message); return; }
    setMsg('');
    await check();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setState('login');
  }

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
  const btn = { padding: '12px 18px', borderRadius: 8, border: 0, background: '#f5b301', color: '#000', fontWeight: 700, fontSize: 16 };

  if (state === 'loading') return <main style={{ padding: 20 }}>লোড হচ্ছে...</main>;

  if (state === 'login') {
    return (
      <main style={{ padding: 20, maxWidth: 420 }}>
        <h2>অ্যাডমিন লগইন</h2>
        <input style={box} autoComplete="off" placeholder="ইমেইল" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={box} autoComplete="off" type="password" placeholder="পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={btn} onClick={signIn}>লগইন</button>
        <p>{msg}</p>
      </main>
    );
  }

  if (state === 'denied') {
    return (
      <main style={{ padding: 20 }}>
        <p>এই পেজ শুধু অ্যাডমিনের জন্য।</p>
        <button style={btn} onClick={signOut}>লগআউট</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, maxWidth: 480 }}>
      <h2>অ্যাডমিন প্যানেল</h2>
      <input style={box} placeholder="ভিডিওর টাইটেল" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input style={box} type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
      <label style={{ display: 'block', margin: '10px 0' }}>
        <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> প্রিমিয়াম ভিডিও
      </label>
      <button style={btn} onClick={upload}>আপলোড</button>
      <p>{msg}</p>
      <button style={{ ...btn, background: '#333', color: '#fff', marginTop: 20 }} onClick={signOut}>লগআউট</button>
    </main>
  );
}
