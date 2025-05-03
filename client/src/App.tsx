import LoginForm from "./components/LoginForm";
import Vault from "./components/Vault";

import { Routes, Route } from 'react-router-dom';
// import './App.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sunset-900">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/vault" element={<Vault/>} />
      </Routes>
    </div>
  );
}

export default App;
