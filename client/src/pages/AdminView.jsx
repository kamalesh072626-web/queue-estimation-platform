import { useState } from 'react';
import StatCard from '../components/StatCard';

function AdminView() {
  // --- 1. STATE MANAGEMENT (The Database Simulation) ---
  const [queue, setQueue] = useState([
    { id: 1, name: "Rahul", service: "Haircut", waitTime: "5 mins", status: "Next" },
    { id: 2, name: "Priya", service: "Consultation", waitTime: "20 mins", status: "Waiting" },
    { id: 3, name: "Vikram", service: "Repair", waitTime: "45 mins", status: "Waiting" }
  ]);
  
  const [totalServed, setTotalServed] = useState(12);

  // --- 2. LOGIC ---
  const handleCompleteService = (customerId) => {
    const updatedQueue = queue.filter(customer => customer.id !== customerId);
    setQueue(updatedQueue);
    setTotalServed(prevTotal => prevTotal + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mavericks Admin ⚙️</h1>
          <p className="text-gray-500">Live Queue Management</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          System Online
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT SIDE: Analytics & Controls (Now using Components!) --- */}
        <div className="lg:col-span-1 space-y-6">
          <StatCard title="Currently Waiting" value={queue.length} valueColor="text-blue-600" />
          <StatCard title="Total Served Today" value={totalServed} />
        </div>

        {/* --- RIGHT SIDE: The Live Queue Table --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Active Queue</h2>
          </div>
          
          {queue.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-medium">
              No customers currently in the queue. Time for a break! ☕
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {queue.map((customer, index) => (
                <div key={customer.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-6">
                    <div className="text-2xl font-black text-gray-300">#{index + 1}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                      <p className="text-sm text-gray-500">{customer.service}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-500">{customer.waitTime}</p>
                      <p className="text-xs text-gray-400">Est. Wait</p>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteService(customer.id)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminView;