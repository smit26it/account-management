import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        avatarUrl: ""
    });

    useEffect(() => {
        const styleId = "home-bg-style";
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = styleId;
            styleEl.innerHTML = `
                body {
                    background: linear-gradient(135deg, #ffb6c1 0%, #add8e6 100%) !important;
                    margin: 0 !important;
                    min-height: 100vh !important;
                }
            `;
            document.head.appendChild(styleEl);
        }
        return () => {
            const el = document.getElementById(styleId);
            if (el) el.parentNode.removeChild(el);
        };
    }, []);

    useEffect(() => {
        // make page background a gradient and keep the profile "body" white
        const prevBodyBg = document.body.style.background;
        const prevBodyMargin = document.body.style.margin;
        const prevBodyMinH = document.body.style.minHeight;

        document.body.style.background = "linear-gradient(135deg,#f6d365 0%,#fda085 100%)";
        document.body.style.margin = "0";
        document.body.style.minHeight = "100vh";

        // target the main container rendered by this component (inline style contains max-width: 720px)
        const container = document.querySelector('div[style*="max-width: 720px"]');
        const prevContainerBg = container?.style?.background || "";
        if (container) container.style.background = "#ffffff";

        return () => {
            document.body.style.background = prevBodyBg;
            document.body.style.margin = prevBodyMargin;
            document.body.style.minHeight = prevBodyMinH;
            if (container) container.style.background = prevContainerBg;
        };
    }, []);
    const [avatarFile, setAvatarFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ saving: false, success: "", error: "" });

    useEffect(() => {
        // Check if user is logged in
        const currentUser = sessionStorage.getItem("currentUser");
        if (!currentUser) {
            navigate("/login", { replace: true });
            return;
        }

        // Load user's registered profile from localStorage accounts
        let mounted = true;
        (async () => {
            try {
                const key = "accounts";
                const raw = localStorage.getItem(key);
                const accounts = raw ? JSON.parse(raw) : [];
                const userAccount = accounts.find((a) => a.email === currentUser);
                
                if (mounted && userAccount) {
                    setForm(prev => ({
                        ...prev,
                        email: userAccount.email || "",
                        name: userAccount.name || "",
                        phone: userAccount.phone || "",
                        address: userAccount.address || "",
                        avatarUrl: userAccount.avatarUrl || ""
                    }));
                }
            } catch (err) {
                console.error("Failed to load user profile", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [navigate]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
        setStatus({ saving: false, success: "", error: "" });
    }

    function handleFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = () => setForm(prev => ({ ...prev, avatarUrl: reader.result }));
        reader.readAsDataURL(file);
    }

    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email is invalid";
        if (form.password && form.password.length < 6) errs.password = "Password must be 6+ chars";
        return errs;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus({ saving: false, success: "", error: "" });
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setStatus({ saving: true, success: "", error: "" });

        try {
            // Update user account in localStorage accounts
            const currentUser = sessionStorage.getItem("currentUser");
            if (!currentUser) throw new Error("No logged-in user");

            const key = "accounts";
            const raw = localStorage.getItem(key);
            const accounts = raw ? JSON.parse(raw) : [];
            const userIdx = accounts.findIndex((a) => a.email === currentUser);
            
            if (userIdx === -1) throw new Error("User account not found");

            // Update account with new profile data
            accounts[userIdx] = {
                ...accounts[userIdx],
                name: form.name,
                phone: form.phone,
                address: form.address,
                avatarUrl: form.avatarUrl || ""
            };
            
            // Update password if provided
            if (form.password) {
                accounts[userIdx].password = form.password;
            }

            localStorage.setItem(key, JSON.stringify(accounts));
            setStatus({ saving: false, success: "Profile saved successfully.", error: "" });
            setForm(prev => ({ ...prev, password: "" }));
            setAvatarFile(null);
        } catch (err) {
            setStatus({ saving: false, success: "", error: err.message || "Failed to save profile" });
        }
    }

    function removeAvatar() {
        setAvatarFile(null);
        setForm(prev => ({ ...prev, avatarUrl: "" }));
    }

    const handleLogout = () => {
        sessionStorage.removeItem("currentUser");
        navigate("/login", { replace: true });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Edit Profile</h2>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form} noValidate>
                <div style={styles.row}>
                    <label style={styles.label}>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
                    {errors.name && <div style={styles.err}>{errors.name}</div>}
                </div>

                <div style={styles.row}>
                    <label style={styles.label}>Email</label>
                    <input name="email" value={form.email} onChange={handleChange} style={styles.input} />
                    {errors.email && <div style={styles.err}>{errors.email}</div>}
                </div>

                <div style={styles.row}>
                    <label style={styles.label}>Password (leave blank to keep)</label>
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        style={styles.input}
                    />
                    {errors.password && <div style={styles.err}>{errors.password}</div>}
                </div>

                <div style={styles.row}>
                    <label style={styles.label}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.row}>
                    <label style={styles.label}>Address</label>
                    <input name="address" value={form.address} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.row}>
                    <label style={styles.label}>Avatar</label>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <input type="file" accept="image/*" onChange={handleFile} />
                        {form.avatarUrl ? (
                            <div style={styles.avatarWrap}>
                                <img src={form.avatarUrl} alt="avatar" style={styles.avatar} />
                                <button type="button" onClick={removeAvatar} style={styles.removeBtn}>
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div style={styles.placeholder}>No avatar</div>
                        )}
                    </div>
                </div>

                <div style={styles.row}>
                    <button type="submit" disabled={status.saving} style={styles.saveBtn}>
                        {status.saving ? "Saving..." : "Save"}
                    </button>
                    {status.success && <div style={styles.success}>{status.success}</div>}
                    {status.error && <div style={styles.err}>{status.error}</div>}
                </div>
            </form>
        </div>
    );
}

const baseFont = "Segoe UI, Roboto, Arial, sans-serif";
const baseRadius = 6;
const baseBtn = {
    padding: "8px 12px",
    borderRadius: baseRadius,
    border: "1px solid #dfe6ef",
    background: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: 13
};
const smallBtn = { ...baseBtn, padding: "6px 10px", border: "1px solid #ccc" };

const styles = {
    container: {
        maxWidth: 720,
        margin: "32px auto",
        padding: 20,
        border: "1px solid #eee",
        borderRadius: 8,
        fontFamily: baseFont
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    title: { margin: 0, fontSize: 20 },
    logoutBtn: baseBtn,
    form: { display: "flex", flexDirection: "column", gap: 12 },
    row: { display: "flex", flexDirection: "column" },
    label: { fontSize: 13, marginBottom: 6, color: "#333" },
    input: {
        padding: "8px 10px",
        borderRadius: baseRadius,
        border: "1px solid #ccc",
        fontSize: 14
    },
    err: { color: "#b00020", marginTop: 6, fontSize: 13 },
    success: { color: "#0b8043", marginTop: 6, fontSize: 13 },
    avatarWrap: { display: "flex", alignItems: "center", gap: 8 },
    avatar: { width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" },
    removeBtn: smallBtn,
    placeholder: { color: "#666", fontSize: 13 },
    saveBtn: {
        padding: "10px 14px",
        borderRadius: baseRadius,
        border: "none",
        background: "#0366d6",
        color: "#fff",
        cursor: "pointer",
        fontSize: 14,
        width: 120
    }
};
