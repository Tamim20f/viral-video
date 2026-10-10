'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [ready, setReady] = useState(false);
  const [premiumUser, setPremiumUser] = useState(false);
  const [adLeft, setAdLeft] = useState(5);

  useEffect(() => {
    (async () => {
      const { data: v } = await supabase.from('videos').select('*').eq('id', id).single();
      setVideo(v);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: p } = await supabase.from('profiles').select('premium_until').eq('id', session.user.id).single();
        if (p && p.premium_until && new Date(p.premium_until) > new Date()) setPremiumUser(true);
      }
      setReady(true);
    })();
  }, [id]);

  useEffect(() => {
    if (!ready || premiumUser || adLeft <= 0) return;
    const t = setTimeout(() => setAdLeft(adLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [ready, premiumUser, adLeft]);

  if (!ready) return <main style={{ padding: 20 }}>লোড হচ্ছে...</main>;
  if (!video) return <main style={{ padding: 20 }}>ভিডিও পাওয়া যায়নি।</main>;

  if (video.is_premium && !premiumUser) {
    return (
      <main style={{ padding: 20 }}>
        <h2>{video.title}</h2>
        <p>এটি প্রিমিয়াম ভিডিও। দেখতে প্রিমিয়াম নিতে হবে।</p>
        <a href="/login" style={{ color: '#f5b301' }}>লগইন করুন</a>
      </main>
    );
  }

  const url = supabase.storage.from('videos').getPublicUrl(video.video_id).data.publicUrl;

  return (
    <main style={{ padding: 20 }}>
      <h2>{video.title}</h2>
      {!premiumUser && adLeft > 0 ? (
        <div style={{ aspectRatio: '16/9', background: '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
          বিজ্ঞাপন... {adLeft}
        </div>
      ) : (
        <video src={url} controls autoPlay playsInline style={{ width: '100%', borderRadius: 10 }} />
      )}
    </main>
  );
}
