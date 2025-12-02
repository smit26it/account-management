import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

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

  const saveAccount = (email, password, name, phone, address) => {
    // store in localStorage for demo purposes (not secure)
    try {
      const key = "accounts";
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      // avoid duplicate email
      if (list.find((a) => a.email === email)) return { ok: false, message: "Account already exists" };
      list.push({ email, password, name, phone, address, avatarUrl: "" });
      localStorage.setItem(key, JSON.stringify(list));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerMsg("");
    if (!validate()) return;
    setLoading(true);
    // Simulate async action
    setTimeout(() => {
      const res = saveAccount(email.trim(), password, name.trim(), phone.trim(), address.trim());
      setLoading(false);
      if (!res.ok) {
        setServerMsg(res.message || "Failed to create account");
        return;
      }
      // On success, navigate to login
      navigate("/login", { replace: true });
    }, 500);
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card} noValidate>
        <h2 style={styles.title}>Create account</h2>
        {serverMsg ? <div style={styles.serverError}>{serverMsg}</div> : null}

        <label style={styles.label}>
          Full Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Enter your full name"
            required
          />
        </label>
        {errors.name && (
          <div id="name-error" style={styles.fieldError}>
            {errors.name}
          </div>
        )}

        <label style={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
            required
          />
        </label>
        {errors.email && (
          <div id="email-error" style={styles.fieldError}>
            {errors.email}
          </div>
        )}

        <label style={styles.label}>
          Phone
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
            placeholder="(optional)"
          />
        </label>

        <label style={styles.label}>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
            placeholder="(optional)"
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="new-password"
            required
          />
        </label>
        {errors.password && (
          <div id="password-error" style={styles.fieldError}>
            {errors.password}
          </div>
        )}

        <button type="submit" style={styles.submit} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <div style={styles.footer}>
          <Link to="/login" style={styles.link}>
            Back to login
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
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    padding: 28,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    background: "#ffffff",
    border: "1px solid rgba(15,23,42,0.04)",
  },
  title: { margin: 0, marginBottom: 18, fontSize: 22, fontWeight: 600 },
  label: { display: "block", marginBottom: 12, fontSize: 14, color: "#334155" },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginTop: 8,
    borderRadius: 8,
    border: "1px solid #e6edf3",
    fontSize: 14,
    boxSizing: "border-box",
    background: "#fbfdff"
  },
  submit: {
    width: "100%",
    padding: "12px 14px",
    marginTop: 12,
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
    fontWeight: 600,
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    fontSize: 13,
    color: "#475569"
  },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: 600 },
  fieldError: { color: "#b00020", fontSize: 13, marginTop: 6 },
  serverError: {
    background: "#fff1f2",
    color: "#b00020",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    border: "1px solid rgba(176,0,32,0.06)"
  },
};
