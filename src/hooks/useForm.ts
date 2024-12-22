import { useState } from "react"; 

type Errors<T> = Partial<Record<keyof T, string>>;

export function useForm<T>(
  initialValues: T,
  validate: (values: T) => Errors<T>,
  onSubmit: (values: T) => void | Promise<void>
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as T[keyof T] }));

    setErrors((prev) => {
      const fieldError = validate({ ...formData, [name]: value } as T)[
        name as keyof T
      ];
      return { ...prev, [name]: fieldError };
    });
  };

  const handleSubmit = () => async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await onSubmit(formData); 
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return { formData, errors, handleChange, handleSubmit, isSubmitting };
}
