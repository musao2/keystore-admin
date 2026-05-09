import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Token topilmadi');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (!confirm(`${userName} foydalanuvchini o'chirmoqchimisiz?`)) return;
    
    setDeletingId(userId);
    const token = localStorage.getItem('adminToken');
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      
      setUsers(users.filter(u => u.id !== userId));
      alert('Foydalanuvchi o\'chirildi');
    } catch (err) {
      alert('Xatolik: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Yuklanmoqda...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Xatolik: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">👥 Foydalanuvchilar</h1>
      
      <div className="bg-[#1B1B30] rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left text-gray-400">ID</th>
                <th className="p-4 text-left text-gray-400">Ism</th>
                <th className="p-4 text-left text-gray-400">Email</th>
                <th className="p-4 text-left text-gray-400">Rol</th>
                <th className="p-4 text-left text-gray-400">Ro'yxatdan</th>
                <th className="p-4 text-left text-gray-400">Harakat</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">#{user.id}</td>
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deletingId === user.id}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                      >
                        {deletingId === user.id ? (
                          <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiTrash2 className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <span className="text-gray-500 text-xs">O'chirib bo'lmaydi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;