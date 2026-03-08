
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import "./SignUpPage.scss"; // adjust if needed
// import queueImage from "../../../assets/queue.png";

// function SignUpPage() {
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     username: Yup.string()
//       .required("Username is required")
//       .min(3, "Username must be at least 3 characters"),

//     email: Yup.string()
//       .required("Email is required")
//       .email("Enter a valid email"),

//     password: Yup.string()
//       .required("Password is required")
//       .min(6, "Password must be minimum 6 characters"),

//     confirmPassword: Yup.string()
//       .required("Confirm your password")
//       .oneOf([Yup.ref("password"), null], "Passwords must match"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           username: values.username,
//           email: values.email,
//           password: values.password,
//         })
//       );

//       alert("Account created successfully! Please login.");
//       navigate("/login");
//     },
//   });

//   return (
//     <div
//       className="signup-page"
//       style={{ backgroundImage: `url(${queueImage})` }}
//     >
//       <div className="signup-container">
//         <h2>Create Account</h2>

//         <form onSubmit={formik.handleSubmit}>
//           <input
//             name="username"
//             type="text"
//             placeholder="Username"
//             {...formik.getFieldProps("username")}
//           />
//           {formik.touched.username && formik.errors.username && (
//             <div className="error-message">{formik.errors.username}</div>
//           )}

//           <input
//             name="email"
//             type="email"
//             placeholder="Email Address"
//             {...formik.getFieldProps("email")}
//           />
//           {formik.touched.email && formik.errors.email && (
//             <div className="error-message">{formik.errors.email}</div>
//           )}

//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             {...formik.getFieldProps("password")}
//           />
//           {formik.touched.password && formik.errors.password && (
//             <div className="error-message">{formik.errors.password}</div>
//           )}

//           <input
//             name="confirmPassword"
//             type="password"
//             placeholder="Confirm Password"
//             {...formik.getFieldProps("confirmPassword")}
//           />
//           {formik.touched.confirmPassword &&
//             formik.errors.confirmPassword && (
//               <div className="error-message">
//                 {formik.errors.confirmPassword}
//               </div>
//             )}

//           <button type="submit">Sign Up</button>

//           <p className="switch-text">
//             Already have an account?{" "}
//             <span
//               className="link-text"
//               onClick={() => navigate("/login")}
//             >
//               Login
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUpPage;




import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.scss";
import queueImage from "../../../assets/queue.png";

function SignUpPage() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),

    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be minimum 6 characters"),

    confirmPassword: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("http://localhost:8080/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        });

        const message = await response.text();

        if (response.ok) {
          alert("Account created successfully!");
          resetForm();
          navigate("/login");
        } else {
          alert(message);
        }

      } catch (error) {
        alert("Server error! Make sure Spring Boot is running.");
      }
    },
  });

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${queueImage})` }}
    >
      <div className="signup-container">
        <h2>Create Account</h2>

        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}

          <input
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <div className="error-message">
                {formik.errors.confirmPassword}
              </div>
            )}

          <button type="submit">Sign Up</button>

          <p className="switch-text">
            Already have an account?{" "}
            <span
              className="link-text"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;









// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import "./SignUpPage.scss";

// function SignUpPage() {
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     username: Yup.string()
//       .required("Username is required")
//       .min(3, "Minimum 3 characters"),

//     email: Yup.string()
//       .required("Email is required")
//       .email("Enter valid email"),

//     password: Yup.string()
//       .required("Password required")
//       .min(6, "Minimum 6 characters"),

//     confirmPassword: Yup.string()
//       .required("Confirm password")
//       .oneOf([Yup.ref("password"), null], "Passwords must match"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,

//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const response = await fetch("http://localhost:8080/api/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username: values.username,
//             email: values.email,
//             password: values.password,
//           }),
//         });

//         const message = await response.text();

//         if (response.ok) {
//           alert("Account created successfully!");
//           resetForm();
//           navigate("/login");
//         } else {
//           alert(message);
//         }

//       } catch (error) {
//         alert("Server error. Make sure backend is running.");
//       }
//     },
//   });

//   return (
//     <div className="signup-page">
//       <div className="signup-container">
//         <h2>Create Account</h2>

//         <form onSubmit={formik.handleSubmit}>
//           <input
//             type="text"
//             placeholder="Username"
//             {...formik.getFieldProps("username")}
//           />
//           {formik.touched.username && formik.errors.username && (
//             <div className="error-message">{formik.errors.username}</div>
//           )}

//           <input
//             type="email"
//             placeholder="Email"
//             {...formik.getFieldProps("email")}
//           />
//           {formik.touched.email && formik.errors.email && (
//             <div className="error-message">{formik.errors.email}</div>
//           )}

//           <input
//             type="password"
//             placeholder="Password"
//             {...formik.getFieldProps("password")}
//           />
//           {formik.touched.password && formik.errors.password && (
//             <div className="error-message">{formik.errors.password}</div>
//           )}

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             {...formik.getFieldProps("confirmPassword")}
//           />
//           {formik.touched.confirmPassword &&
//             formik.errors.confirmPassword && (
//               <div className="error-message">
//                 {formik.errors.confirmPassword}
//               </div>
//             )}

//           <button type="submit">Sign Up</button>

//           <p>
//             Already have an account?{" "}
//             <span onClick={() => navigate("/login")}>
//               Login
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUpPage;