import { useState, useEffect } from 'react';
import { queueService, socket } from '../services/api';

function CustomerView() {
  // --- 1. CORE STATE ---
  const [inQueue, setInQueue] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState('Haircut');

  // --- 2. NETWORK STATE (The Google Standard) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [queueData, setQueueData] = useState({ waitTime: '', position: 0 });

  // --- 3. REAL-TIME LISTENER (WebSockets) ---
  useEffect(() => {
    // Listen for the custom event broadcasted by the backend
    socket.on('queueUpdated', (updatedQueueData) => {
      // When the server says the queue changed, update our React state!
      setQueueData({
        waitTime: updatedQueueData.estimatedWaitTime,
        position: updatedQueueData.queuePosition
      });
    });

    // Safety cleanup: Stop listening when the customer leaves the page
    return () => {
      socket.off('queueUpdated');
    };
  }, []);

  // --- 4. LOGIC ---
  const handleJoinQueue = async (e) => {
    e.preventDefault(); 
    if (customerName.trim() === '') return; 

    // Start the loading sequence and clear old errors
    setIsSubmitting(true);
    setErrorMessage(''); 

    try {
      // Send the actual POST request to Darshni's backend
      const response = await queueService.joinQueue({
        name: customerName,
        service: serviceType
      });

      // Save the real data the server sends back
      setQueueData({
        waitTime: response.estimatedWaitTime || "Calculating...",
        position: response.queuePosition || 0
      });

      // Swap to the waiting screen
      setInQueue(true);
    } catch (error) {
      // If the server is off or crashes, show a friendly error
      setErrorMessage("Unable to connect to the queue server. Please try again.");
    } finally {
      // Turn off the loading spinner whether it succeeded or failed
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Mavericks Queue 🚀</h1>
          <p className="text-blue-100 text-sm mt-1">Digital Waiting-Time Prediction</p>
        </div>

        <div className="p-6">
          {!inQueue ? (
            <form onSubmit={handleJoinQueue} className="space-y-4">
              
              {/* Error Message UI */}
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 text-sm">
                  <p>{errorMessage}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting} // Lock input while loading
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                <select 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={isSubmitting}
                >
                  <option value="Haircut">Haircut</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Repair">Repair Service</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} // Prevent double-clicking
                className={`w-full font-bold py-3 rounded-lg transition duration-200 mt-4 text-white flex justify-center items-center ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  // Simple SVG Loading Spinner
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Join the Queue"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Hello, {customerName}!</h2>
              <p className="text-gray-500 mb-6">You are successfully in line for a {serviceType}.</p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Estimated Wait</p>
                {/* Dynamically rendering the real server data or WebSocket updates */}
                <p className="text-4xl font-extrabold text-blue-700">{queueData.waitTime}</p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Queue Position</p>
                  <p className="text-xl font-bold text-gray-800">#{queueData.position}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="flex h-3 w-3 relative mb-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="text-xs text-green-600 font-medium">Live Sync</p>
                </div>
              </div>

              <button 
                onClick={() => setInQueue(false)}
                className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition duration-200 mt-6"
              >
                Leave Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerView;