import { useState, FormEvent, useEffect } from "react";
import { useLocation } from 'react-router-dom';

export default function Vault() {
    const location = useLocation() as {state: {user: string} | null};
    const username = location.state?.user;

    return (
        // Welcome message
        <div className="w-full max-w-md rounded-2xl bg-sunset-200/40 p-8 items-center justify-center text-center">
            <h2 className="text-4xl font-semibold text-sunset-400">
                Welcome, {username}
            </h2>
            <p className="text-sunset-200">
                Your secure vault is ready.
            </p>
        </div>
    )
};