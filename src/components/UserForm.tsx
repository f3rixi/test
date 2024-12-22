import React from "react";
import { useForm } from "../hooks/useForm";
import { User, createUser, updateUser } from "../api";
import regexPatterns from "../utils/regexPatterns";

interface UserFormProps {
  user: User | null; 
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSuccess }) => {
  const validate = (values: User) => {
    const errors: { first_name?: string; last_name?: string; email?: string } =
      {};

    if (!values.first_name) {
      errors.first_name = "First name is required.";
    } else if (!regexPatterns.name.test(values.first_name)) {
      errors.first_name = "First name can only contain alphabets and spaces.";
    }

    if (!values.last_name) {
      errors.last_name = "Last name is required.";
    } else if (!regexPatterns.name.test(values.last_name)) {
      errors.last_name = "Last name can only contain alphabets and spaces.";
    }

    if (!values.email) {
      errors.email = "Email is required.";
    } else if (!regexPatterns.email.test(values.email)) {
      errors.email = "Email is not valid.";
    }

    return errors;
  };

  const { formData, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<User>(
      {
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        id: user?.id || undefined,
      },
      validate,
      async (data) => {
        if (data.id) {
          await updateUser(data.id, data); 
        } else {
          await createUser(data); 
        }
        onSuccess();
        onClose(); 
      }
    );

  return (
    <form onSubmit={handleSubmit()}>
      <div>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>
        {errors.first_name && (
          <p style={{ color: "red" }}>{errors.first_name}</p>
        )}
      </div>
      <div>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>
        {errors.last_name && <p style={{ color: "red" }}>{errors.last_name}</p>}
      </div>
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
        <button type="submit" disabled={isSubmitting}>
          {user?.id ? "Update" : "Add"}
        </button>
        <button type="button" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
