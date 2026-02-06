import React, { useEffect, useState } from "react";
import { bulkRegister, getUsers, register } from "../api";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: number;
}

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCsvModal, setShowCsvModal] = useState(false);
    const [csvText, setCsvText] = useState("");
    const [csvSubmitting, setCsvSubmitting] = useState(false);
    const [csvResult, setCsvResult] = useState<{
        created: { name: string; email: string; role: string; tempPassword: string }[];
        skipped: { name: string; email: string; reason: string }[];
        failed: { name?: string; email?: string; reason: string }[];
    } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "reader",
    });

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.users);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kullanıcılar yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData);
            setShowAddModal(false);
            setFormData({ name: "", email: "", password: "", role: "reader" });
            fetchUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Kullanıcı oluşturulamadı");
        }
    };

    const parseCsvLines = (text: string) => {
        const lines = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        const entries: { name: string; email: string; role?: string }[] = [];
        const errors: string[] = [];

        lines.forEach((line, index) => {
            const parts = line.split(",").map((part) => part.trim());
            if (parts.length !== 3) {
                errors.push(`Satır ${index + 1}: 3 alan olmalı (adsoyad,mail,rol)`);
                return;
            }
            const [name, email, role] = parts;
            if (!name || !email || !email.includes("@")) {
                errors.push(`Satır ${index + 1}: ad veya e-posta hatalı`);
                return;
            }
            if (role.toLowerCase() !== "admin" && role.toLowerCase() !== "reader") {
                errors.push(`Satır ${index + 1}: rol admin ya da reader olmalı`);
                return;
            }
            entries.push({ name, email, role: role.toLowerCase() });
        });

        return { entries, errors };
    };

    const handleCsvImport = async (e: React.FormEvent) => {
        e.preventDefault();
        const { entries, errors } = parseCsvLines(csvText);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }
        if (entries.length === 0) {
            alert("CSV boş görünüyor");
            return;
        }

        setCsvSubmitting(true);
        try {
            const res = await bulkRegister(entries);
            setCsvResult(res);
            fetchUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : "CSV içe aktarılamadı");
        } finally {
            setCsvSubmitting(false);
        }
    };

    const handleCopyPasswords = async () => {
        if (!csvResult || csvResult.created.length === 0) return;
        const text = csvResult.created
            .map((u) => `${u.name},${u.email},${u.role},${u.tempPassword}`)
            .join("\n");
        await navigator.clipboard.writeText(text);
        alert("Şifreler kopyalandı");
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <header className="px-4 pt-6 pb-3 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
                    <p className="text-on-surface/60 text-sm">Sistemdeki tüm görevliler</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setCsvText("");
                            setCsvResult(null);
                            setShowCsvModal(true);
                        }}
                        className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
                    >
                        CSV İçe Aktar
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-transform"
                    >
                        + Yeni
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 pb-24">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {users.map((u) => (
                            <div key={u.id} className="md3-card p-4 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="font-bold">{u.name}</span>
                                    <span className="text-xs text-on-surface/60">{u.email}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${u.role === 'admin' ? 'border-primary/30 text-primary bg-primary/5' : 'border-outline/30 text-outline'
                                    }`}>
                                    {u.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="md3-card w-full max-w-md p-6 bg-surface shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-6">Yeni Kullanıcı Oluştur</h2>
                        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-outline px-1">AD SOYAD</label>
                                <input
                                    type="text"
                                    required
                                    className="md3-input"
                                    placeholder="Ahmet Yılmaz"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-outline px-1">E-POSTA</label>
                                <input
                                    type="email"
                                    required
                                    className="md3-input"
                                    placeholder="ahmet@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-outline px-1">ŞİFRE</label>
                                <input
                                    type="password"
                                    required
                                    className="md3-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-outline px-1">ROL</label>
                                <select
                                    className="md3-input"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="reader">Reader</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 p-3 rounded-2xl text-on-surface font-bold hover:bg-surface-variant transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 p-3 rounded-2xl bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-transform"
                                >
                                    Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCsvModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="md3-card w-full max-w-lg p-6 bg-surface shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-2">CSV ile Kullanıcı Ekle</h2>
                        <p className="text-xs text-on-surface/60 mb-4">
                            Format: adsoyad,mail,rol (rol: admin veya reader)
                        </p>
                        <form onSubmit={handleCsvImport} className="flex flex-col gap-4">
                            <textarea
                                className="md3-input min-h-[180px] font-mono text-xs"
                                placeholder="Ahmet Yılmaz,ahmet@example.com,reader\nAyşe Demir,ayse@example.com,admin"
                                value={csvText}
                                onChange={(e) => setCsvText(e.target.value)}
                            />
                            {csvResult && (
                                <div className="text-xs bg-surface-container-highest rounded-2xl p-3">
                                    <div className="font-bold mb-2">Sonuç</div>
                                    <div>Oluşan: {csvResult.created.length}</div>
                                    <div>Atlanan: {csvResult.skipped.length}</div>
                                    <div>Hatalı: {csvResult.failed.length}</div>
                                    {csvResult.created.length > 0 && (
                                        <div className="mt-3">
                                            <div className="font-bold mb-1">Geçici Şifreler</div>
                                            <pre className="whitespace-pre-wrap text-[10px] bg-black/10 rounded-xl p-2">
                                                {csvResult.created
                                                    .map((u) => `${u.name},${u.email},${u.role},${u.tempPassword}`)
                                                    .join("\n")}
                                            </pre>
                                            <button
                                                type="button"
                                                onClick={handleCopyPasswords}
                                                className="mt-2 text-[10px] uppercase tracking-widest text-primary font-bold"
                                            >
                                                Kopyala
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCsvModal(false)}
                                    className="flex-1 p-3 rounded-2xl text-on-surface font-bold hover:bg-surface-variant transition-colors"
                                >
                                    Kapat
                                </button>
                                <button
                                    type="submit"
                                    disabled={csvSubmitting}
                                    className="flex-1 p-3 rounded-2xl bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-60"
                                >
                                    {csvSubmitting ? "İçe Aktarılıyor..." : "İçe Aktar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
