'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    window.location.href = '/';
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : 'অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল চেক করে নিশ্চিত করুন, তারপর লগইন করুন।');
  }

  const box = { display: 'block', width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: '1px solid #333', background: '#1c1c22', color: '#fff', fontSize: 16, boxSizing: 'border-box' };
  const btn = { padding: '12px 18px', margin: '6px 8px 0 0', borderRadius: 8, border: 0, background: '#f5b301', fontWeight: 700, fontSize: 16 };

  return (
    <main style={{ padding: 20, maxWidth: 420 }}>
      <h2>লগইন / রেজিস্ট্রেশন</h2>
      <input style={box} placeholder="ইমেইল" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input style={box} type="password" placeholder="পাসওয়ার্ড (৬+ অক্ষর)" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button style={btn} onClick={signIn}>লগইন</button>
      <button style={btn} onClick={signUp}>অ্যাকাউন্ট খুলুন</button>
      <p>{msg}</p>
    </main>
  );
}
