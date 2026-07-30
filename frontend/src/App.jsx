import { Routes, Route } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateEscrow from './pages/CreateEscrow';
import Escrows from './pages/Escrows';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <>
      <Navbar />

      <div className="body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-escrow" element={<CreateEscrow />} />
          <Route path="/escrows" element={<Escrows />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </div>
    </>
  );
}

export default App;