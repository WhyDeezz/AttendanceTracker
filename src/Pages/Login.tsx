import { useState, useActionState } from "react";
import { Sun, Moon, PawPrint as Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from 'react-router-dom';



interface SignInResult {
  success: boolean;
  data?: {
    session?: unknown; 
  };
  error?: string;
}

export default function App() {
  const navigate = useNavigate();
  const { signInUser } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const isDark = theme === "dark";

  const [error, onSubmit, isPending] = useActionState<
    string | null,
    FormData
  >(
    async (_prevState: string | null, formData: FormData): Promise<string | null> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        return "Email and password are required.";
      }

      try {
        const { success, data, error: signInError }: SignInResult = await signInUser(email, password);
        console.log("Attempting login with:", { email, password });

        if (signInError) {
     
          return signInError;
          
        }

        if (success && data?.session) {
          navigate('/dashboard')
        }

        return "Login failed. Invalid credentials.";
      } catch (err) {
        return "Login failed. Please try again.";
      }
    },
    null
  );






  return (
    <>
      <style>{`
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
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#000000" : "#ffffff",
          transition: "background-color 0.5s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Circles */}
        <motion.div
          style={{
            position: "absolute",
            top: "80px",
            left: "80px",
            width: "256px",
            height: "256px",
            background: isDark ? "#581c87" : "#e9d5ff",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.3,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            width: "384px",
            height: "384px",
            background: isDark ? "#1e3a8a" : "#bfdbfe",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.3,
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="btn"
          style={{
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
          }}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {theme === "light" ? (
            <Moon style={{ width: "20px", height: "20px", color: "#1f2937" }} />
          ) : (
            <Sun style={{ width: "20px", height: "20px", color: "#e5e7eb" }} />
          )}
        </motion.button>

        {/* Login Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "448px",
            margin: "0 16px",
          }}
        >
          {/* Quirky Header */}
          <motion.div
            style={{ textAlign: "center", marginBottom: "48px" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
              animate={isFocused ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles
                style={{
                  width: "24px",
                  height: "24px",
                  color: isDark ? "#c084fc" : "#a855f7",
                }}
              />
              <h1
                style={{
                  fontSize: "36px",
                  letterSpacing: "-0.025em",
                  color: isDark ? "#f3f4f6" : "#111827",
                  fontWeight: "600",
                }}
              >
                hello again
              </h1>
              <Sparkles
                style={{
                  width: "24px",
                  height: "24px",
                  color: isDark ? "#60a5fa" : "#3b82f6",
                }}
              />
            </motion.div>
            <p style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
              ready to level up ur cgpa ?✨
            </p>
          </motion.div>

          {/* Form */}
          <form action={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <input
                type="email"
                name = "email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                className="input-field"
                style={{
                  width: "100%",
                  height: "56px",
                  backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                  border: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "16px",
                  padding: "0 24px",
                  fontSize: "16px",
                  color: isDark ? "#f3f4f6" : "#111827",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                name= "password"
               onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                className="input-field"
                style={{
                  width: "100%",
                  height: "56px",
                  backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                  border: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "16px",
                  padding: "0 24px",
                  fontSize: "16px",
                  color: isDark ? "#f3f4f6" : "#111827",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                 {!isPending&&<button
                  type="submit"
                  className="btn"
                  style={{
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
                  }}
                >
                  let's go →
                </button>}
 {isPending && (
  <button
    type="submit"
    className="btn"
    disabled
    style={{
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
    }}
  >
    Checking...
  </button>
)}
              </motion.div>
  
            </motion.div>

            <motion.div
              style={{ textAlign: "center", paddingTop: "16px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
    
            </motion.div>
          </form>
     {error && (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    style={{
      color: "#ef4444", 
      fontSize: "14px",
      marginTop: "12px",
      textAlign: "center",
    }}
  >
    {error === "Email and password are required."
      ? error
      : "Invalid username / password, try again"}
  </motion.p>
)}

          {/* Footer */}
          <motion.div
            style={{ textAlign: "center", marginTop: "48px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              new here?{" "}
              <motion.a
                href="/signup"
                style={{
                  color: isDark ? "#c084fc" : "#a855f7",
                  textDecoration: "none",
                }}
                whileHover={{ scale: 1.05 }}
              >
                create account
              </motion.a>
            </p>
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              backgroundColor: isDark ? "#7c3aed" : "#c084fc",
              borderRadius: "50%",
              opacity: 0.4,
            }}
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            }}
            animate={{
              y: [
                null,
                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              ],
              x: [
                null,
                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              ],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
 
    </>

  );
}
