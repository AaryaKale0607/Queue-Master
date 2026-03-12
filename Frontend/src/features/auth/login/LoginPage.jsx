
// import { useState, useActionState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoginPage.scss";

// function LoginPage({ onLogin }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [step, setStep] = useState(1);

//   // 🔥 LOGIN WITH BACKEND
//   const loginAction = async (prevState, formData) => {
//     const email = formData.get("username"); // username field used as email
//     const password = formData.get("password");
//     const role = formData.get("role");
//     let errors = {};
//     if (!email || email.length < 3) {
//       errors.username = "Email must be at least 3 characters";
//     }
//     if (!password || password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//     }
//     if (!role) {
//       errors.role = "Please select a role";
//     }
//     if (Object.keys(errors).length > 0) {
//       return { success: false, errors };
//     }
//     try {
//       const response = await fetch("http://localhost:8080/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//         }),
//       });
//       const user = await response.json();
//       if (!user || !user.role) {
//         return {
//           success: false,
//           errors: { password: "Invalid email or password" },
//         };
//       }
//       // ✅ Role match check
//       if (user.role.toLowerCase() !== role.toLowerCase()) {
//         return {
//           success: false,
//           errors: { role: "Selected role does not match your account" },
//         };
//       }
//       // Save logged user
//       localStorage.setItem("user", JSON.stringify(user));
//       if (onLogin) onLogin(user.role);
//       // 🔥 Redirect by role
//       if (user.role === "ADMIN") {
//         navigate("/admin/dashboard");
//       } else if (user.role === "STAFF") {
//         navigate("/staff/dashboard");
//       } else {
//         navigate("/Userdashboard");
//       }
//       return { success: true, errors: {} };
//     } catch (error) {
//       return {
//         success: false,
//         errors: { password: "Server error. Make sure backend is running." },
//       };
//     }
//   };

//   const [state, formAction] = useActionState(loginAction, {
//     success: false,
//     errors: {},
//   });

//   // OTP (UI Only)
//   const handleSendOtp = (email) => {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedOtp(otp);
//     alert("OTP sent to email: " + otp);
//     setStep(2);
//   };

//   const handleVerifyOtp = (otpInput) => {
//     if (otpInput === generatedOtp) {
//       alert("Password reset successful!");
//       setShowModal(false);
//       setStep(1);
//     } else {
//       alert("Invalid OTP");
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2>Login</h2>
//         <form action={formAction}>
//           <div className="role-selector top-role-selector">
//             <label>
//               <input type="radio" name="role" value="USER" defaultChecked />
//               User
//             </label>
//             <label>
//               <input type="radio" name="role" value="STAFF" />
//               Staff
//             </label>
//             <label>
//               <input type="radio" name="role" value="ADMIN" />
//               Admin
//             </label>
//           </div>
//           {state.errors.role && (
//             <div style={{ color: "red" }}>{state.errors.role}</div>
//           )}
//           <input
//             className="email-field"
//             name="username"
//             type="email"
//             placeholder="Enter Email"
//           />
//           {state.errors.username && (
//             <div style={{ color: "red" }}>{state.errors.username}</div>
//           )}
//           <div className="password-field">
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//             />
//             <span
//               className="toggle-password"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </span>
//           </div>
//           {state.errors.password && (
//             <div style={{ color: "red" }}>{state.errors.password}</div>
//           )}
//           <p
//             className="forgot-password"
//             onClick={() => setShowModal(true)}
//           >
//             Forgot Password?
//           </p>
//           <button type="submit">Login</button>
//           <p className="switch-text">
//             Don't have an account?{" "}
//             <span className="link-text" onClick={() => navigate("/signup")}>
//               Sign Up
//             </span>
//           </p>
//         </form>
//       </div>
//       {showModal && (
//         <div className="otp-modal">
//           <div className="otp-box">
//             <h3>Reset Password</h3>
//             {step === 1 && (
//               <>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   id="resetEmail"
//                 />
//                 <button
//                   onClick={() =>
//                     handleSendOtp(
//                       document.getElementById("resetEmail").value
//                     )
//                   }
//                 >
//                   Send OTP
//                 </button>
//               </>
//             )}
//             {step === 2 && (
//               <>
//                 <input type="text" placeholder="Enter OTP" id="otpInput" />
//                 <button
//                   onClick={() =>
//                     handleVerifyOtp(
//                       document.getElementById("otpInput").value
//                     )
//                   }
//                 >
//                   Verify OTP
//                 </button>
//               </>
//             )}
//             <p onClick={() => setShowModal(false)} className="close-modal">
//               Cancel
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LoginPage;







import { useState, useActionState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1);

  const loginAction = async (prevState, formData) => {
    const usernameOrEmail = formData.get("usernameOrEmail");
    const password        = formData.get("password");
    const role            = formData.get("role");

    // ── Frontend Validation ──────────────────────────
    let errors = {};

    if (!usernameOrEmail || usernameOrEmail.length < 3) {
      errors.usernameOrEmail = "Username or Email must be at least 3 characters";
    }
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!role) {
      errors.role = "Please select a role";
    }
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    // ── API Call to Spring Boot ──────────────────────
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail, // ← matches Spring Boot LoginRequest
          password:        password,
        }),
      });

      const data = await response.json();

      // ── If login failed ──────────────────────────
      if (!response.ok) {
        return {
          success: false,
          errors: { password: data || "Invalid username/email or password" },
        };
      }

      // ── Role match check ─────────────────────────
      if (data.role.toUpperCase() !== role.toUpperCase()) {
        return {
          success: false,
          errors: { role: `This account is not a ${role} account` },
        };
      }

      // ── Save everything to localStorage ──────────
      localStorage.setItem("token",    data.token);     // JWT token
      localStorage.setItem("userId",   data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email",    data.email);
      localStorage.setItem("role",     data.role);

      // ── Notify parent component ───────────────────
      if (onLogin) onLogin(data.role);

      // ── Redirect based on role ────────────────────
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "STAFF") {
        navigate("/staff/dashboard");
      } else {
        navigate("/Userdashboard");
      }

      return { success: true, errors: {} };

    } catch (error) {
      return {
        success: false,
        errors: { password: "Server error. Make sure backend is running." },
      };
    }
  };

  const [state, formAction] = useActionState(loginAction, {
    success: false,
    errors: {},
  });

  // OTP (UI Only — no backend yet)
  const handleSendOtp = (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    alert("OTP sent to email: " + otp);
    setStep(2);
  };

  const handleVerifyOtp = (otpInput) => {
    if (otpInput === generatedOtp) {
      alert("Password reset successful!");
      setShowModal(false);
      setStep(1);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        <form action={formAction}>

          {/* Role Selector */}
          <div className="role-selector top-role-selector">
            <label>
              <input type="radio" name="role" value="USER" defaultChecked />
              User
            </label>
            <label>
              <input type="radio" name="role" value="STAFF" />
              Staff
            </label>
            <label>
              <input type="radio" name="role" value="ADMIN" />
              Admin
            </label>
          </div>
          {state.errors.role && (
            <div style={{ color: "red" }}>{state.errors.role}</div>
          )}

          {/* Username or Email */}
          <input
            className="email-field"
            name="usernameOrEmail"         
            type="text"                    
            placeholder="Enter Username or Email"
          />
          {state.errors.usernameOrEmail && (
            <div style={{ color: "red" }}>{state.errors.usernameOrEmail}</div>
          )}

          {/* Password */}
          <div className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {state.errors.password && (
            <div style={{ color: "red" }}>{state.errors.password}</div>
          )}

          <p className="forgot-password" onClick={() => setShowModal(true)}>
            Forgot Password?
          </p>

          <button type="submit">Login</button>

          <p className="switch-text">
            Don't have an account?{" "}
            <span className="link-text" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>

        </form>
      </div>

      {/* OTP Modal */}
      {showModal && (
        <div className="otp-modal">
          <div className="otp-box">
            <h3>Reset Password</h3>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  id="resetEmail"
                />
                <button
                  onClick={() =>
                    handleSendOtp(document.getElementById("resetEmail").value)
                  }
                >
                  Send OTP
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <input type="text" placeholder="Enter OTP" id="otpInput" />
                <button
                  onClick={() =>
                    handleVerifyOtp(document.getElementById("otpInput").value)
                  }
                >
                  Verify OTP
                </button>
              </>
            )}
            <p onClick={() => setShowModal(false)} className="close-modal">
              Cancel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;