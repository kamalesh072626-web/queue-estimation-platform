import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';
import { socket } from './services/api'; // Import the pager we built!

function App() {
  
  // --- REAL-TIME CONNECTION ---
  useEffect(() => {
    // 1. Turn on the socket connection when the app first loads
    socket.connect();

    // 2. Listen for a successful connection (crucial for debugging)
    socket.on('connect', () => {
      console.log('✅ Connected to Mavericks Real-Time Server:', socket.id);
    });

    // 3. Safety Cleanup: Disconnect if the user closes the browser tab
    return () => {
      socket.disconnect();
    };
  }, []); // The empty array [] means "only run this exact process ONCE"

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;