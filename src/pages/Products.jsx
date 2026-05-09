import React, { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '', image: '', description: '' });

  const fetchProducts = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editing 
      ? `http://localhost:5000/api/products/${editing.id}`
      : 'http://localhost:5000/api/products';
    const method = editing ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) })
    });
    setShowModal(false);
    setEditing(null);
    setFormData({ name: '', price: '', stock: '', category: '', image: '', description: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  const categories = ['Klaviatura', 'Mishka', 'Quloqchin', 'Gaming stul', 'Monitor', 'Kompyuter'];

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛍️ Mahsulotlar</h1>
        <button onClick={() => setShowModal(true)} className="bg-[#6C5DD3] text-white px-5 py-2 rounded-xl">
          + Yangi mahsulot
        </button>
      </div>

      <div className="bg-[#1B1B30] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left">Rasm</th>
                <th className="p-4 text-left">Nomi</th>
                <th className="p-4 text-left">Kategoriya</th>
                <th className="p-4 text-left">Narxi</th>
                <th className="p-4 text-left">Soni</th>
                <th className="p-4 text-left">Harakat</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-white/5">
                  <td className="p-4">
                    <img src={product.image} className="w-12 h-12 object-cover rounded-lg" alt={product.name} />
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">{product.price?.toLocaleString()} so'm</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <button onClick={() => { setEditing(product); setFormData(product); setShowModal(true); }} className="text-blue-400 mr-3">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1B1B30] p-6 rounded-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nomi" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10" required />
              <textarea placeholder="Tavsifi" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10" rows="3" />
              <input type="number" placeholder="Narxi" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10" required />
              <input type="number" placeholder="Soni" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10" required />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10" required>
                <option value="">Kategoriya tanlang</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" placeholder="Rasm URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full p-3 rounded-xl bg-[#0A0A0F] border border-white/10" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#6C5DD3] text-white py-2 rounded-xl">Saqlash</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 bg-gray-600 text-white py-2 rounded-xl">Bekor qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;