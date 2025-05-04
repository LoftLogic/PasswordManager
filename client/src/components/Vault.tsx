import { useState, FormEvent, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { evaluatePassword, StrengthLabel } from "../util/strength";

interface PasswordItem {
    id: number;
    service: string;
    password: string;
    visible: boolean;
}

// Helper function to get color based on strength
const getStrengthColor = (strength: StrengthLabel): string => {
    switch(strength) {
        case "very-weak": return "text-rose-800";
        case "weak": return "text-rose-600";
        case "fair": return "text-amber-400";
        case "good": return "text-emerald-400";
        case "strong": return "text-emerald-600 font-bold";
        default: return "text-gray-400";
    }
}

export default function Vault() {
    const location = useLocation() as {state: {user: string} | null};
    const username = location.state?.user;

    const [passwords, setPasswords] = useState<PasswordItem[]>([
        { id: 1, service: "Example", password: "MyPassword!3", visible: false }
    ])

    const [nextId, setNextId] = useState(2)
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const toggleVisibility = (id: number) => {
        setPasswords(passwords.map(item => 
            item.id === id ? { ...item, visible: !item.visible } : item
        ));
    }

    const addPassword = () => {
        setPasswords([...passwords, { id: nextId, service: "",
            password: "", visible: false }]);
        setNextId(nextId + 1);
    };

    const confirmDelete = (id: number) => {
        setDeletingId(id);
    };

    const removePassword = () => {
        if (deletingId !== null) {
            setPasswords(passwords.filter(item => item.id !== deletingId));
            setDeletingId(null);
        }
    }

    const cancelDelete = () => {
        setDeletingId(null);
    };

    const updatePassword = (id: number, field: keyof PasswordItem, value: string) => {
        setPasswords(passwords.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    }

    return (
        <div className="w-full max-w-md space-y-6">
            {/** Welcome message */}
            <div className="rounded-2xl bg-sunset-200/40 p-8 items-center justify-center text-center">
                <h2 className="text-4xl font-semibold text-sunset-400">
                    Welcome, {username}
                </h2>
                <p className="text-sunset-200">
                    Your secure vault is ready.
                </p>
            </div>
            {/** Password list */}
            <div className="space-y-4">
                {passwords.map(item => (
                    <div key={item.id} className="bg-sunset-100/65 p-4 rounded-xl relative">
                        <button
                            onClick={() => confirmDelete(item.id)}
                            className="absolute top-2 right-2 px-2 py-1 text-xs text-rose-400 hover:text-rose-500"
                        >
                            - Remove Password
                        </button>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sunset-300 text-xs mb-1 block">Service</label>
                                <input 
                                    type="text"
                                    value={item.service}
                                    onChange={(e) => updatePassword(item.id, 'service', e.target.value)}
                                    className="w-full p-2 rounded bg-sunset-900/50 text-white border-none"
                                    placeholder="Service name"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sunset-300 text-xs mb-1 block">Password</label>
                                <input 
                                    type={item.visible ? "text" : "password"}
                                    value={item.password}
                                    onChange={(e) => updatePassword(item.id, 'password', e.target.value)}
                                    className="w-full p-2 rounded bg-sunset-900/50 text-white border-none"
                                    placeholder="Password"
                                />
                                <div className="mt-1 flex items-center justify-between">
                                    {item.password && (
                                        <div className={`text-xs capitalize ${getStrengthColor(evaluatePassword(item.password).label)}`}>
                                            {evaluatePassword(item.password).label.replace('-', ' ')}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleVisibility(item.id)}
                                        className="px-3 py-1 text-xs text-sunset-300 hover:text-sunset-400"
                                    >
                                        {item.visible ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add button */}
                <button 
                    onClick={addPassword}
                    className="w-full bg-sunset-300/20 hover:bg-sunset-300/30 text-sunset-300 rounded-xl p-3 flex items-center justify-center"
                >
                    <span className="text-xl mr-1">+</span> Add Password
                </button>
            </div>

            {/* Confirmation Modal */}
            {deletingId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-sunset-100 rounded-xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium text-white mb-4">Confirm Deletion</h3>
                        <p className="text-sunset-400 mb-6">Are you sure you want to remove this password?</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={removePassword}
                                className="px-4 py-2 bg-sunset-400 text-sunset-900 rounded-lg hover:bg-sunset-300"
                            >
                                Yes
                            </button>
                            <button 
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-sunset-900 text-sunset-300 rounded-lg hover:bg-sunset-900/50"
                            >
                                No
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};