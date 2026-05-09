import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      paid: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 Buyurtmalar</h1>
      
      <div className="bg-[#1B1B30] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Mijoz</th>
                <th className="p-4 text-left">Telefon</th>
                <th className="p-4 text-left">Manzil</th>
                <th className="p-4 text-left">Jami</th>
                <th className="p-4 text-left">Holat</th>
                <th className="p-4 text-left">Harakat</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/5">
                  <td className="p-4">#{order.id}</td>
                  <td className="p-4">{order.user_name}</td>
                  <td className="p-4">{order.phone || '-'}</td>
                  <td className="p-4 max-w-[200px] truncate">{order.address || '-'}</td>
                  <td className="p-4 font-bold text-[#6C5DD3]">{order.total?.toLocaleString()} so'm</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
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

export default Orders;