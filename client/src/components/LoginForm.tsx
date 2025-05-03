import { useState, FormEvent, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

/**
 * LoginForm - Controlled react component that captures username and master password.
 * Authentication not yet implemented.
 */
export default function LoginForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [master, setMaster] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [criteria, setCriteria] = useState({
      length: false,
      uppercase: false,
      symbol: false,
      number: false
    });
  
    // Update password criteria as user types
    useEffect(() => {
      setCriteria({
        length: master.length >= 8,
        uppercase: /[A-Z]/.test(master),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(master),
        number: /[0-9]/.test(master)
      });
    }, [master]);
  
    const allCriteriaMet = Object.values(criteria).every(Boolean);
  
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (!user) {
        setError("Username is required");
        return;
      }
      if (!allCriteriaMet) {
        setError("Please meet all password requirements");
        return;
      }
      setError(null);
      console.log({ user, master });
      navigate("/vault", {state: {user}});
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl p-8 shadow-xl bg-sunset-100/30 backdrop-blur"
      >
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-semibold text-sunset-400 tracking-wide">
            Vault Login
          </h1>
          <p className="text-sunset-300 text-sm">
            Enter your credentials to unlock your vault
          </p>
        </header>
  
        <div className="space-y-4">
          <label className="block">
            <span className="text-sunset-300 text-sm font-medium">Username</span>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border-none p-3 outline-none bg-sunset-100/65 text-white placeholder:text-sunset-200 focus:ring-2 focus:ring-sunset-400"
              placeholder="e.g. evanli1"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </label>
  
          <label className="block">
            <span className="text-sunset-300 text-sm font-medium">Master Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full rounded-xl border-none p-3 outline-none bg-sunset-100/65 text-white placeholder:text-sunset-200 focus:ring-2 focus:ring-sunset-400"
                placeholder="Your master password- keep it safe!"
                value={master}
                onChange={(e) => setMaster(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sunset-300 hover:text-sunset-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <ul className="mt-2 space-y-1 text-xs">
              <li className={`flex items-center ${criteria.length ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className="mr-1">{criteria.length ? '✓' : '•'}</span>
                Password must be at least 8 characters
              </li>
              <li className={`flex items-center ${criteria.uppercase ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className="mr-1">{criteria.uppercase ? '✓' : '•'}</span>
                Password must have at least one uppercase letter
              </li>
              <li className={`flex items-center ${criteria.symbol ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className="mr-1">{criteria.symbol ? '✓' : '•'}</span>
                Password must have at least one symbol
              </li>
              <li className={`flex items-center ${criteria.number ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className="mr-1">{criteria.number ? '✓' : '•'}</span>
                Password must have at least one number
              </li>
            </ul>
          </label>
        </div>
  
        {error && <p className="text-sm text-rose-400">{error}</p>}
  
        <button
          type="submit"
          className={`w-full rounded-xl py-3 font-semibold transition ${
            user && allCriteriaMet 
              ? 'bg-sunset-400 text-sunset-900 hover:bg-sunset-300' 
              : 'bg-sunset-400/50 text-sunset-900/50 cursor-not-allowed'
          }`}
        >
          Unlock Vault
        </button>
      </form>
    );
  }