
// import { useState } from "react";   
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import "./LoginPage.scss";

// function LoginPage({ onLogin }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   // Forgot Password States
//   const [showModal, setShowModal] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [step, setStep] = useState(1);

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       password: "",
//       role: "user",
//     },

//     validationSchema: Yup.object({
//       username: Yup.string()
//         .min(3, "Username must be at least 3 characters")
//         .required("Username is required"),

//       password: Yup.string()
//         .min(6, "Password must be at least 6 characters")
//         .required("Password is required"),

//       role: Yup.string().required("Please select a role"),
//     }),

//     onSubmit: (values) => {
//       // 🔐 Store single user object
//       const userData = {
//         username: values.username,
//         role: values.role.toUpperCase(), // USER / STAFF / ADMIN
//       };

//       localStorage.setItem("user", JSON.stringify(userData));

//       if (onLogin) {
//         onLogin(values.role);
//       }

//       // 🚀 Role Based Navigation
//       if (values.role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (values.role === "staff") {
//         navigate("/staff/dashboard");
//       } else {
//         navigate("/UserDashboard");
//       }
//     },
//   });

//   // Send OTP
//   const handleSendOtp = (email) => {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedOtp(otp);
//     alert("OTP sent to email: " + otp);
//     setStep(2);
//   };

//   // Verify OTP
//   const handleVerifyOtp = (otpInput, newPassword) => {
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

//         <form onSubmit={formik.handleSubmit}>
//           <div className="role-selector top-role-selector">
//             <label className={formik.values.role === "user" ? "active" : ""}>
//               <input
//                 type="radio"
//                 name="role"
//                 value="user"
//                 checked={formik.values.role === "user"}
//                 onChange={formik.handleChange}
//               />
//               User
//             </label>

//             <label className={formik.values.role === "staff" ? "active" : ""}>
//               <input
//                 type="radio"
//                 name="role"
//                 value="staff"
//                 checked={formik.values.role === "staff"}
//                 onChange={formik.handleChange}
//               />
//               Staff
//             </label>

//             <label className={formik.values.role === "admin" ? "active" : ""}>
//               <input
//                 type="radio"
//                 name="role"
//                 value="admin"
//                 checked={formik.values.role === "admin"}
//                 onChange={formik.handleChange}
//               />
//               Admin
//             </label>
//           </div>

//           <input
//             name="username"
//             type="text"
//             placeholder="Username"
//             value={formik.values.username}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />

//           <div className="password-field">
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />

//             <span
//               className="toggle-password"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </span>
//           </div>

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
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   id="newPassword"
//                 />
//                 <button
//                   onClick={() =>
//                     handleVerifyOtp(
//                       document.getElementById("otpInput").value,
//                       document.getElementById("newPassword").value
//                     )
//                   }
//                 >
//                   Reset Password
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





































// import { useState, useActionState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoginPage.scss";

// function LoginPage({ onLogin }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [step, setStep] = useState(1);

//   // ✅ useActionState Validation
//   const loginAction = async (prevState, formData) => {
//     const username = formData.get("username");
//     const password = formData.get("password");
//     const role = formData.get("role");

//     let errors = {};

//     if (!username || username.length < 3) {
//       errors.username = "Username must be at least 3 characters";
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

//     // ✅ If validation passes
//     const userData = {
//       username,
//       role: role.toUpperCase(),
//     };

//     localStorage.setItem("user", JSON.stringify(userData));

//     if (onLogin) onLogin(role);

//     if (role === "admin") {
//       navigate("/admin/dashboard");
//     } else if (role === "staff") {
//       navigate("/staff/dashboard");
//     } else {
//       navigate("/UserDashboard");
//     }

//     return { success: true, errors: {} };
//   };

//   const [state, formAction] = useActionState(loginAction, {
//     success: false,
//     errors: {},
//   });

//   // Send OTP
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
//               <input type="radio" name="role" value="user" defaultChecked />
//               User
//             </label>

//             <label>
//               <input type="radio" name="role" value="staff" />
//               Staff
//             </label>

//             <label>
//               <input type="radio" name="role" value="admin" />
//               Admin
//             </label>
//           </div>

//           {state.errors.role && (
//             <div style={{ color: "red" }}>{state.errors.role}</div>
//           )}

//           <input
//             name="username"
//             type="text"
//             placeholder="Username"
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
//                   Reset Password
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

  // 🔥 LOGIN WITH BACKEND
  const loginAction = async (prevState, formData) => {
    const email = formData.get("username"); // username field used as email
    const password = formData.get("password");
    const role = formData.get("role");

    let errors = {};

    if (!email || email.length < 3) {
      errors.username = "Email must be at least 3 characters";
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

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const user = await response.json();

      if (!user || !user.role) {
        return {
          success: false,
          errors: { password: "Invalid email or password" },
        };
      }

      // ✅ Role match check
      if (user.role.toLowerCase() !== role.toLowerCase()) {
        return {
          success: false,
          errors: { role: "Selected role does not match your account" },
        };
      }

      // Save logged user
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin(user.role);

      // 🔥 Redirect by role
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "STAFF") {
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

  // OTP (UI Only)
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
          <div className="role-selector top-role-selector">
            <label>
              <input type="radio" name="role" value="user" defaultChecked />
              User
            </label>

            <label>
              <input type="radio" name="role" value="staff" />
              Staff
            </label>

            <label>
              <input type="radio" name="role" value="admin" />
              Admin
            </label>
          </div>

          {state.errors.role && (
            <div style={{ color: "red" }}>{state.errors.role}</div>
          )}

          <input className="email-field"
            name="username"
            type="email"
            placeholder="Enter Email"
          />
          {state.errors.username && (
            <div style={{ color: "red" }}>{state.errors.username}</div>
          )}

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

          <p
            className="forgot-password"
            onClick={() => setShowModal(true)}
          >
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
                    handleSendOtp(
                      document.getElementById("resetEmail").value
                    )
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
                    handleVerifyOtp(
                      document.getElementById("otpInput").value
                    )
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

