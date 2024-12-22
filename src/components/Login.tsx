import React from "react";
import { useForm } from "../hooks/useForm";
import { login } from "../api";
import regexPatterns from "../utils/regexPatterns";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const validate = (values: { email: string; password: string }) => {
    const errors: { email?: string; password?: string } = {};

    if (!values.email) {
      errors.email = "Email is required.";
    } else if (!regexPatterns.email.test(values.email)) {
      errors.email = "Email is not valid.";
    }

    if (!values.password) {
      errors.password = "Password is required.";
    } else if (!regexPatterns.password.test(values.password)) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const { formData, errors, handleChange, handleSubmit, isSubmitting } =
    useForm(
      { email: "", password: "" },
      validate,
      async (data: { email: string; password: string }) => {
        try {
          await login(data.email, data.password);
          onLogin(); 
        } catch {
          alert("Invalid credentials"); 
        }
      }
    );

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit()}>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </label>
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </label>
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
