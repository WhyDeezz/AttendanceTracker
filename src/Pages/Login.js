import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useActionState } from "react";
import { Sun, Moon, PawPrint as Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom';
export default function App() {
    const navigate = useNavigate();
    const { signInUser } = useAuth();
    const [theme, setTheme] = useState("dark");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };
    const isDark = theme === "dark";
    const [error, onSubmit, isPending] = useActionState(async (_prevState, formData) => {
        const email = formData.get("email");
        const password = formData.get("password");
        if (!email || !password) {
            return "Email and password are required.";
        }
        try {
            const { success, data, error: signInError } = await signInUser(email, password);
            console.log("Attempting login with:", { email, password });
            if (signInError) {
                return signInError;
            }
            if (success && data?.session) {
                navigate('/dashboard');
            }
            return "Login failed. Invalid credentials.";
        }
        catch (err) {
            return "Login failed. Please try again.";
        }
    }, null);
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .input-field {
          outline: none;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          outline: none;
        }

        .btn {
          cursor: pointer;
          outline: none;
          border: none;
          transition: all 0.3s ease;
        }

        .btn:active {
          transform: scale(0.98);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      ` }), _jsxs("div", { style: {
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDark ? "#000000" : "#ffffff",
                    transition: "background-color 0.5s ease",
                    position: "relative",
                    overflow: "hidden",
                }, children: [_jsx(motion.div, { style: {
                            position: "absolute",
                            top: "80px",
                            left: "80px",
                            width: "256px",
                            height: "256px",
                            background: isDark ? "#581c87" : "#e9d5ff",
                            borderRadius: "50%",
                            filter: "blur(80px)",
                            opacity: 0.3,
                        }, animate: {
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                        }, transition: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        } }), _jsx(motion.div, { style: {
                            position: "absolute",
                            bottom: "80px",
                            right: "80px",
                            width: "384px",
                            height: "384px",
                            background: isDark ? "#1e3a8a" : "#bfdbfe",
                            borderRadius: "50%",
                            filter: "blur(80px)",
                            opacity: 0.3,
                        }, animate: {
                            scale: [1, 1.3, 1],
                            x: [0, -30, 0],
                            y: [0, -50, 0],
                        }, transition: {
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        } }), _jsx(motion.button, { onClick: toggleTheme, className: "btn", style: {
                            position: "fixed",
                            top: "32px",
                            right: "32px",
                            padding: "16px",
                            borderRadius: "50%",
                            backgroundColor: isDark ? "#000000ff" : "#ffffffff",
                            border: "none",
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }, whileHover: { scale: 1.1, rotate: 180 }, whileTap: { scale: 0.9 }, transition: { type: "spring", stiffness: 300 }, children: theme === "light" ? (_jsx(Moon, { style: { width: "20px", height: "20px", color: "#1f2937" } })) : (_jsx(Sun, { style: { width: "20px", height: "20px", color: "#e5e7eb" } })) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, style: {
                            position: "relative",
                            zIndex: 10,
                            width: "100%",
                            maxWidth: "448px",
                            margin: "0 16px",
                        }, children: [_jsxs(motion.div, { style: { textAlign: "center", marginBottom: "48px" }, initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.6 }, children: [_jsxs(motion.div, { style: {
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            marginBottom: "16px",
                                        }, animate: isFocused ? { scale: 1.05 } : { scale: 1 }, transition: { type: "spring", stiffness: 300 }, children: [_jsx(Sparkles, { style: {
                                                    width: "24px",
                                                    height: "24px",
                                                    color: isDark ? "#c084fc" : "#a855f7",
                                                } }), _jsx("h1", { style: {
                                                    fontSize: "36px",
                                                    letterSpacing: "-0.025em",
                                                    color: isDark ? "#f3f4f6" : "#111827",
                                                    fontWeight: "600",
                                                }, children: "hello again" }), _jsx(Sparkles, { style: {
                                                    width: "24px",
                                                    height: "24px",
                                                    color: isDark ? "#60a5fa" : "#3b82f6",
                                                } })] }), _jsx("p", { style: { color: isDark ? "#9ca3af" : "#6b7280" }, children: "ready to level up ur cgpa ?\u2728" })] }), _jsxs("form", { action: onSubmit, style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3, duration: 0.5 }, children: _jsx("input", { type: "email", name: "email", placeholder: "your@email.com", value: email, onChange: (e) => setEmail(e.target.value), onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), required: true, className: "input-field", style: {
                                                width: "100%",
                                                height: "56px",
                                                backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                                                border: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                                                borderRadius: "16px",
                                                padding: "0 24px",
                                                fontSize: "16px",
                                                color: isDark ? "#f3f4f6" : "#111827",
                                            } }) }), _jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4, duration: 0.5 }, children: _jsx("input", { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, name: "password", onChange: (e) => setPassword(e.target.value), onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), required: true, className: "input-field", style: {
                                                width: "100%",
                                                height: "56px",
                                                backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                                                border: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                                                borderRadius: "16px",
                                                padding: "0 24px",
                                                fontSize: "16px",
                                                color: isDark ? "#f3f4f6" : "#111827",
                                            } }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5, duration: 0.5 }, children: _jsxs(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [!isPending && _jsx("button", { type: "submit", className: "btn", style: {
                                                        width: "100%",
                                                        height: "56px",
                                                        borderRadius: "16px",
                                                        background: isDark
                                                            ? "linear-gradient(to right, #7c3aed, #2563eb)"
                                                            : "linear-gradient(to right, #a855f7, #3b82f6)",
                                                        color: "#ffffff",
                                                        fontSize: "16px",
                                                        fontWeight: "500",
                                                        boxShadow: isDark
                                                            ? "0 10px 30px rgba(124, 58, 237, 0.3)"
                                                            : "0 10px 30px rgba(168, 85, 247, 0.3)",
                                                    }, children: "let's go \u2192" }), isPending && (_jsx("button", { type: "submit", className: "btn", disabled: true, style: {
                                                        width: "100%",
                                                        height: "56px",
                                                        borderRadius: "16px",
                                                        background: isDark
                                                            ? "linear-gradient(to right, #7c3aed, #2563eb)"
                                                            : "linear-gradient(to right, #a855f7, #3b82f6)",
                                                        color: "#ffffff",
                                                        fontSize: "16px",
                                                        fontWeight: "500",
                                                        boxShadow: isDark
                                                            ? "0 10px 30px rgba(124, 58, 237, 0.3)"
                                                            : "0 10px 30px rgba(168, 85, 247, 0.3)",
                                                        opacity: 0.8,
                                                        cursor: "not-allowed",
                                                    }, children: "Checking..." }))] }) }), _jsx(motion.div, { style: { textAlign: "center", paddingTop: "16px" }, initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6, duration: 0.5 } })] }), error && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 }, style: {
                                    color: "#ef4444",
                                    fontSize: "14px",
                                    marginTop: "12px",
                                    textAlign: "center",
                                }, children: error === "Email and password are required."
                                    ? error
                                    : "Invalid username / password, try again" })), _jsx(motion.div, { style: { textAlign: "center", marginTop: "48px" }, initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.7, duration: 0.5 }, children: _jsxs("p", { style: { fontSize: "14px", color: "#6b7280" }, children: ["new here?", " ", _jsx(motion.a, { href: "/signup", style: {
                                                color: isDark ? "#c084fc" : "#a855f7",
                                                textDecoration: "none",
                                            }, whileHover: { scale: 1.05 }, children: "create account" })] }) })] }), [...Array(5)].map((_, i) => (_jsx(motion.div, { style: {
                            position: "absolute",
                            width: "8px",
                            height: "8px",
                            backgroundColor: isDark ? "#7c3aed" : "#c084fc",
                            borderRadius: "50%",
                            opacity: 0.4,
                        }, initial: {
                            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
                        }, animate: {
                            y: [
                                null,
                                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
                            ],
                            x: [
                                null,
                                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                            ],
                        }, transition: {
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        } }, i)))] })] }));
}
