import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OnBoarding() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [master, setMaster] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1); // Step 1: Username, Step 2: Password
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        symbol: false,
        number: false
    });
    const [usernameCriteria, setUsernameCriteria] = useState({
        length: false,
        legalChars: true
    });
    
    useEffect(() => {
        setPasswordCriteria({
          length: master.length >= 8,
          uppercase: /[A-Z]/.test(master),
          symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(master),
          number: /[0-9]/.test(master)
        });
      }, [master]);

    useEffect(() => {
        setUsernameCriteria({
            length: username.length >= 4,
            legalChars: /^[a-zA-Z0-9]+$/.test(username)
        });
    }, [username]);

    const usernameValid = Object.values(usernameCriteria).every(Boolean);
    const passwordValid = Object.values(passwordCriteria).every(Boolean);

    const handleNextStep = () => {
        if (!username) {
            setError("Username is required");
            return;
        }
        if (!usernameValid) {
            setError("Please meet all username requirements");
            return;
        }
        setError(null);
        setStep(2);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            handleNextStep();
            return;
        }

        if (!passwordValid) {
            setError("Please meet all password requirements");
            return;
        }
        
        setError(null);
        console.log({ username, master });
        navigate("/vault", {state: {user: username}});
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-6 rounded-xl p-8 shadow-xl bg-sunset-100/30 backdrop-blur">
                <header className="text-center space-y-1">
                    <h1 className="text-3xl font-semibold text-sunset-400 tracking-wide">
                        Welcome to Vault!
                    </h1>
                    <p className="text-sunset-300 text-sm">
                        Create your account to get started
                    </p>    
                </header>

                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sunset-300 text-sm font-medium">Username</span>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-xl border-none p-3 outline-none bg-sunset-100/65 text-white placeholder:text-sunset-200 focus:ring-2 focus:ring-sunset-400"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        
                        <ul className="mt-2 space-y-1 text-xs">
                            <li className={`flex items-center ${usernameCriteria.length ? 'text-emerald-400' : 'text-rose-400'}`}>
                                <span className="mr-1">{usernameCriteria.length ? '✓' : '•'}</span>
                                Username must be at least 4 characters
                            </li>
                            <li className={`flex items-center ${usernameCriteria.legalChars ? 'text-emerald-400' : 'text-rose-400'}`}>
                                <span className="mr-1">{usernameCriteria.legalChars ? '✓' : '•'}</span>
                                Username must only contain letters and numbers
                            </li>
                        </ul>
                    </label>

                    {step === 2 && (
                        <label className="block">
                            <span className="text-sunset-300 text-sm font-medium">Master Password</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="mt-1 w-full rounded-xl border-none p-3 outline-none bg-sunset-100/65 text-white placeholder:text-sunset-200 focus:ring-2 focus:ring-sunset-400"
                                    placeholder="Create your master password"
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
                                <li className={`flex items-center ${passwordCriteria.length ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span className="mr-1">{passwordCriteria.length ? '✓' : '•'}</span>
                                    Password must be at least 8 characters
                                </li>
                                <li className={`flex items-center ${passwordCriteria.uppercase ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span className="mr-1">{passwordCriteria.uppercase ? '✓' : '•'}</span>
                                    Password must have at least one uppercase letter
                                </li>
                                <li className={`flex items-center ${passwordCriteria.symbol ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span className="mr-1">{passwordCriteria.symbol ? '✓' : '•'}</span>
                                    Password must have at least one symbol
                                </li>
                                <li className={`flex items-center ${passwordCriteria.number ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span className="mr-1">{passwordCriteria.number ? '✓' : '•'}</span>
                                    Password must have at least one number
                                </li>
                            </ul>
                        </label>
                    )}
                </div>

                {error && <p className="text-sm text-rose-400">{error}</p>}

                <button
                    type="submit"
                    className={`w-full rounded-xl py-3 font-semibold transition ${
                        step === 1 
                            ? (usernameValid ? 'bg-sunset-400 text-sunset-900 hover:bg-sunset-300' : 'bg-sunset-400/50 text-sunset-900/50 cursor-not-allowed')
                            : (passwordValid ? 'bg-sunset-400 text-sunset-900 hover:bg-sunset-300' : 'bg-sunset-400/50 text-sunset-900/50 cursor-not-allowed')
                    }`}
                >
                    {step === 1 ? "Continue" : "Create Account"}
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
                    onClick={() => navigate("/login")}
                    className="w-full text-center text-sunset-300 hover:text-sunset-400 text-sm transition-colors"
                >
                    I already have an account
                </button>
            </form>
    );
};