import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  reload,
  onAuthStateChanged
} from "firebase/auth";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./Auth.css";

export default function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userRole, setUserRole] = useState('user');
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Detect current user (session management)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

useEffect(() => {
  if (user) {
    getDoc(doc(db, "users", user.uid)).then(userDoc => {
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      } else {
        setUserRole(null);
      }
    });
  } else {
    setUserRole(null);
  }
}, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Email input onChange handler
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, email: value });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Password input onChange handler
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (isLogin) {
      // Login mode
      try {
            const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const role = userDoc.data().role;
              setUserRole(role);  // <-- Save role in state for access control
            } else {
              setUserRole(null);  // Or handle missing user doc
            }

        setMessage("Logged in successfully!");
      } catch (err) {
        setError("Invalid credentials. Please try again.");
      }
    } else {
      // Sign up mode
      try {       
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(userCredential.user);
        setUser(userCredential.user);

        setMessage("Verification email sent! Please check your email.");
        setCheckingVerification(true);

        // Start polling for verification
        const interval = setInterval(async () => {
          await reload(userCredential.user);
          if (userCredential.user.emailVerified) {
            clearInterval(interval);

            // Save user info in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
              firstName: form.firstName,
              lastName: form.lastName,
              email: userCredential.user.email,
              role: 'user',
              createdAt: serverTimestamp(),
            });

            setMessage("Email verified! Your account is now active.");
            setCheckingVerification(false);
          }
        }, 3000);
      } catch (err) {
        setError("This email is already registered or invalid.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserRole(null);
    setMessage("You have been logged out.");
  };

    // Determine if form is valid (no errors and inputs not empty)
  const isFormValid = 
    form.email && !emailError &&
    form.password && !passwordError &&
    // If sign up, also check first and last name:
    (isLogin || (form.firstName && form.lastName));

  return (
    <div className="auth-container">
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLogin ? "Log in" : "Create a new user"}</h2>

          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleEmailChange}
            required
          />
          {emailError && <p className="error">{emailError}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handlePasswordChange}
            required
          />
      {passwordError && <p className="error">{passwordError}</p>}

          <div className="auth-actions">
            <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
              {isLogin ? "Create new user" : "Login"}
            </Link>
            <button type="submit" disabled={!isFormValid}>{isLogin ? "Login" : "Sign Up"}</button>
          </div>
        </form>
      )}

      {message && <p className="message">{message}</p>}
      {checkingVerification && <p>Waiting for email verification...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}





// import { Form, Link, useSearchParams } from 'react-router-dom';

// import classes from './AuthForm.module.css';

// function AuthForm() {

//   const [searchParams] = useSearchParams();
//   const isLogin = searchParams.get('mode') === 'login';
//   return (
//     <>
//       <Form method="post" className={classes.form}>
//         <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
//         <p>
//           <label htmlFor="email">Email</label>
//           <input id="email" type="email" name="email" required />
//         </p>
//         <p>
//           <label htmlFor="image">Password</label>
//           <input id="password" type="password" name="password" required />
//         </p>
//         <div className={classes.actions}>
//           <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
//             {isLogin ? 'Create new user' : 'Login'}
//           </Link>
//           <button>Save</button>
//         </div>
//       </Form>
//     </>
//   );
// }

// export default AuthForm;
