import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setServerError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const key = "accounts";
            const raw = localStorage.getItem(key);
            const accounts = raw ? JSON.parse(raw) : [];
            const account = accounts.find((a) => a.email === form.email && a.password === form.password);
            if (!account) throw new Error("Invalid email or password");
            sessionStorage.setItem("currentUser", form.email);
            navigate("/home", { replace: true });
        } catch (err) {
            setServerError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.card} noValidate>
                <h2 style={styles.title}>Login</h2>

                {serverError ? <div style={styles.serverError}>{serverError}</div> : null}


                <label style={styles.label}>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={styles.input}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        autoComplete="email"
                        required
                    />
                </label>
                {errors.email && <div id="email-error" style={styles.fieldError}>{errors.email}</div>}

                <label style={styles.label}>
                    Password
                    <div style={styles.passwordRow}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            style={{ ...styles.input, marginRight: 8 }}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            style={styles.toggleBtn}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </label>
                {errors.password && <div id="password-error" style={styles.fieldError}>{errors.password}</div>}

                <label style={{ ...styles.label, ...styles.row }}>
                    <input
                        type="checkbox"
                        name="remember"
                        checked={form.remember}
                        onChange={handleChange}
                    />
                    <span style={{ marginLeft: 8 }}>Remember me</span>
                </label>

                <button type="submit" style={styles.submit} disabled={loading}>
                    {loading ? "Signing in..." : "Log in"}
                </button>

                <div style={styles.footer}>
                        <Link to="/register" style={styles.link}>
                            Create account
                        </Link>
                </div>
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        background: "#fff",
    },
    title: { margin: 0, marginBottom: 16, fontSize: 20 },
    label: { display: "block", marginBottom: 12, fontSize: 14 },
    input: {
        width: "100%",
        padding: "10px 12px",
        marginTop: 6,
        borderRadius: 6,
        border: "1px solid #dfe6ef",
        fontSize: 14,
        boxSizing: "border-box",
    },
    passwordRow: { display: "flex", alignItems: "center" },
    toggleBtn: {
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #dfe6ef",
        background: "#fff",
        cursor: "pointer",
    },
    submit: {
        width: "100%",
        padding: "10px 12px",
        marginTop: 8,
        border: "none",
        borderRadius: 6,
        background: "#0366d6",
        color: "#fff",
        fontSize: 15,
        cursor: "pointer",
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 12,
        fontSize: 13,
    },
    link: { color: "#0366d6", textDecoration: "none", cursor: "pointer" },
    fieldError: { color: "#b00020", fontSize: 13, marginTop: 6 },
    serverError: {
        background: "#ffeef0",
        color: "#b00020",
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
    },
    row: { display: "flex", alignItems: "center" },
};

/*
  Simple registration page exported from this file so your router can render it at "/register".
  Add a Route like: <Route path="/register" element={<Register />} />
*/
export function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = "Name is required";
        if (!email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Password must be at least 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setServerError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const key = "accounts";
            const raw = localStorage.getItem(key);
            const accounts = raw ? JSON.parse(raw) : [];
            if (accounts.some((a) => a.email === email)) {
                throw new Error("An account with this email already exists");
            }
            accounts.push({ name, email, password });
            localStorage.setItem(key, JSON.stringify(accounts));
            // optionally sign in immediately
            sessionStorage.setItem("currentUser", email);
            navigate("/home", { replace: true });
        } catch (err) {
            setServerError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };
    <div style={styles.footer}>
        <Link to="/register" style={styles.link}>
            Create account
        </Link>
    </div>
    return (
        <div style={{ ...styles.page, background: "linear-gradient(180deg, #e6f7ff 0%, #0366d6 100%)" }}>
            <form onSubmit={handleSubmit} style={styles.card} noValidate>
                <h2 style={styles.title}>Create account</h2>

                {serverError ? <div style={styles.serverError}>{serverError}</div> : null}

                <label style={styles.label}>
                    Full name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        required
                    />
                </label>
                {errors.name && <div id="name-error" style={styles.fieldError}>{errors.name}</div>}

                <label style={styles.label}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        required
                    />
                </label>
                {errors.email && <div id="email-error" style={styles.fieldError}>{errors.email}</div>}

                <label style={styles.label}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        required
                    />
                </label>
                {errors.password && <div id="password-error" style={styles.fieldError}>{errors.password}</div>}

                <button type="submit" style={styles.submit} disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                </button>

                <div style={styles.footer}>
                    <span>Already have an account?</span>
                    <Link to="/login" style={styles.link}>Login</Link>
                </div>
            </form>
        </div>
    );
}