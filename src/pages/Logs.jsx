import React, { useState, useEffect } from 'react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/admin/logs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📋 Admin harakatlari</h1>
      
      <div className="bg-[#1B1B30] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left">Admin</th>
                <th className="p-4 text-left">Harakat</th>
                <th className="p-4 text-left">Tafsilot</th>
                <th className="p-4 text-left">IP</th>
                <th className="p-4 text-left">Vaqt</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-white/5">
                  <td className="p-4 font-medium">{log.admin_name}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4 text-sm text-gray-400">{log.details || '-'}</td>
                  <td className="p-4 text-sm text-gray-400">{log.ip_address || '-'}</td>
                  <td className="p-4 text-sm text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;