import { useState, FormEvent } from "react";

/**
 * LoginForm - Controlled react component that captures username and master password.
 * Authentication not yet implemented.
 */
export default function LoginForm() {
    const [user, setUser] = useState("");
    const [master, setMaster] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
  
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (!user || !master) {
        setError("Both fields are required");
        return;
      }
      setError(null);
      console.log({ user, master });
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
          </label>
        </div>
  
        {error && <p className="text-sm text-red-400">{error}</p>}
  
        <button
          type="submit"
          className="w-full rounded-xl bg-sunset-400 py-3 font-semibold text-sunset-900 hover:bg-sunset-300 transition"
        >
          Unlock Vault
        </button>
      </form>
    );
  }