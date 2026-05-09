import React, { useState } from 'react';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login xatosi');
      }
      
      // Admin tekshiruvi
      if (data.user.role !== 'admin') {
        throw new Error('Admin huquqi kerak!');
      }

      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0A0A0F] to-[#1A1A2E]">
      <div className="bg-[#1B1B30] p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#6C5DD3] to-[#A093F1] rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
            K
          </div>
          <h1 className="text-2xl font-bold">KEYSTORE Admin</h1>
          <p className="text-gray-400 text-sm">Faqat adminlar uchun</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10 focus:border-[#6C5DD3] outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10 focus:border-[#6C5DD3] outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C5DD3] text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            {loading ? 'Kutilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;