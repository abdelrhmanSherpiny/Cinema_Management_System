import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import SupervisorLogin from './components/SupervisorLogin/SupervisorLogin';
import Movies from './pages/Movies/Movies';
import Tickets from './pages/Tickets/Tickets';
import Customers from './pages/Customers/Customers';
import Supervisors from './pages/Supervisors/Supervisors';

function App() {
  const [supervisor, setSupervisor] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (selectedSupervisor) => {
    setSupervisor(selectedSupervisor);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setSupervisor(null);
  };

  return (
    <>
      <Routes>
        <Route
          element={
            <Layout
              supervisor={supervisor}
              onLoginClick={() => setShowLoginModal(true)}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/" element={<Movies isSupervisor={!!supervisor} />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/supervisors" element={<Supervisors />} />
        </Route>
      </Routes>

      {showLoginModal && (
        <SupervisorLogin
          onClose={() => setShowLoginModal(false)}
          onSelect={handleLogin}
        />
      )}
    </>
  );
}

export default App;