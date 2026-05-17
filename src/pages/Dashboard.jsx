import React, { useState, useEffect } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    Promise.all([
      fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ]).then(([statsData, ordersData]) => {
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { title: 'Jami buyurtmalar', value: stats.totalOrders, icon: <FiPackage className="w-6 h-6" />, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    { title: 'Mahsulotlar', value: stats.totalProducts, icon: <FiShoppingBag className="w-6 h-6" />, color: 'from-green-500 to-green-600', bg: 'bg-green-500/10', text: 'text-green-400' },
    { title: 'Foydalanuvchilar', value: stats.totalUsers, icon: <FiUsers className="w-6 h-6" />, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    { title: 'Daromad', value: stats.revenue?.toLocaleString() + " so'm", icon: <FiDollarSign className="w-6 h-6" />, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 text-sm">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black italic gradient-text">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Xush kelibsiz, {new Date().toLocaleDateString('uz-UZ')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden bg-[#1B1B30] rounded-2xl p-6 card-hover group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className={`${card.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className={card.text}>{card.icon}</div>
              </div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <FiTrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+12.5%</span>
                <span className="text-gray-600 text-xs ml-2">shu oyda</span>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1B1B30] rounded-2xl overflow-hidden border border-white/5">
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">📦 So'nggi buyurtmalar</h2>
            <p className="text-gray-500 text-xs mt-1">Eng so'nggi 5 ta buyurtma</p>
          </div>
          <button className="text-[#6C5DD3] text-sm hover:underline">Barchasini ko'rish →</button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
              <FiPackage className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500">Hozircha buyurtma yo'q</p>
            <p className="text-gray-600 text-xs mt-1">Yangi buyurtma kelganda shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#6C5DD3]/10 flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-[#6C5DD3]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Buyurtma #{order.id}</p>
                    <p className="text-xs text-gray-500">{order.user_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#6C5DD3]">{order.total?.toLocaleString()} so'm</p>
                  <p className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'delivered' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {order.status === 'pending' ? 'Kutilmoqda' :
                     order.status === 'paid' ? 'To\'langan' :
                     order.status === 'delivered' ? 'Yetkazilgan' : order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;