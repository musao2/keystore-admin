import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiClock, FiGrid, FiTrendingUp
} from 'react-icons/fi';

const Layout = ({ children, admin, setToken }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome className="w-5 h-5" />, color: 'text-blue-400' },
    { name: 'Mahsulotlar', path: '/products', icon: <FiShoppingBag className="w-5 h-5" />, color: 'text-green-400' },
    { name: 'Buyurtmalar', path: '/orders', icon: <FiPackage className="w-5 h-5" />, color: 'text-purple-400' },
    { name: 'Foydalanuvchilar', path: '/users', icon: <FiUsers className="w-5 h-5" />, color: 'text-yellow-400' },
    { name: 'Admin loglar', path: '/logs', icon: <FiClock className="w-5 h-5" />, color: 'text-orange-400' },
  ];

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A0A0F] to-[#0F0F1A]">
      {/* Sidebar */}
      <div className="w-72 bg-[#0F0F1A] min-h-screen p-6 fixed left-0 top-0 bottom-0 border-r border-white/5">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3] to-[#A093F1] rounded-xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-r from-[#6C5DD3] to-[#A093F1] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                K
              </div>
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight gradient-text">KEYSTORE</h1>
              <p className="text-[10px] text-gray-500">Admin panel v2.0</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-[#6C5DD3]/20 to-[#A093F1]/10 border-l-4 border-[#6C5DD3] text-white'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? item.color : ''}`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.name}</span>
              {location.pathname === item.path && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#6C5DD3] rounded-full animate-pulse"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#A093F1] flex items-center justify-center text-white text-sm font-bold">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group"
            >
              <FiLogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-sm font-medium">Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;