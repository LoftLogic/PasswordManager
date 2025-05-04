import { useState, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

/**
 * LoginForm - Controlled react component that captures username and master password.
 * Simple credential validation with no password requirements display.
 */
export default function LoginForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [master, setMaster] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      
      // Basic validation
      if (!user.trim()) {
        setError("Username is required");
        return;
      }
      
      if (!master.trim()) {
        setError("Password is required");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would verify credentials with API
        // const success = await verifyCredentials(user, master);
        
        // For demo purposes, we're just going to simulate success
        // and navigate to the vault
        console.log({ user, master });
        setTimeout(() => {
          setIsLoading(false);
          navigate("/vault", {state: {user}});
        }, 1000); // Simulate network delay
      } catch (err) {
        setIsLoading(false);
        setError("Invalid username or password");
      }
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
                placeholder="Your master password"
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
          </label>
        </div>
  
        {error && <p className="text-sm text-rose-400">{error}</p>}
  
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-xl py-3 font-semibold transition ${
            isLoading 
              ? 'bg-sunset-400/50 text-sunset-900/50 cursor-not-allowed' 
              : 'bg-sunset-400 text-sunset-900 hover:bg-sunset-300'
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sunset-200/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-xs text-sunset-300 flex items-center backdrop-blur-none bg-transparent">
              <span className="w-16 h-[2px] bg-sunset-300/50 mr-3"></span>
              OR
              <span className="w-16 h-[2px] bg-sunset-300/50 ml-3"></span>
            </span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full text-center text-sunset-300 hover:text-sunset-400 text-sm transition-colors"
        >
          Create a new account
        </button>
      </form>
    );
  }