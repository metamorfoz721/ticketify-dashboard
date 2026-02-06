import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { login } from "../api";

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password, token);
            navigate("/reader");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Giriş başarısız");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4">
            <div className="w-full max-w-md md3-card p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-primary">
                        Ticketify
                    </h1>
                    <p className="text-on-surface/60">Giriş yaparak devam edin</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium px-1">E-posta</label>
                        <input
                            type="email"
                            className="md3-textfield"
                            placeholder="admin@ticketify.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium px-1">Şifre</label>
                        <input
                            type="password"
                            className="md3-textfield"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mt-2 flex justify-center">
                        <Turnstile
                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                            onSuccess={setToken}
                            options={{ theme: "light" }}
                        />
                    </div>

                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-error/10 text-error text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="md3-button w-full mt-2"
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
};
