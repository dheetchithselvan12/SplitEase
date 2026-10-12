interface FormErrors {
  name?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
}

interface AuthFormData {
  name: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export const validateRegister = (data: Partial<AuthFormData>) => {
  const error: FormErrors = {};

  if (!data.name?.trim()) {
    error.name = "Name is required";
  } else if (data.name.trim().length < 3) {
    error.name = "Name must be at least 3 characters";
  }

  if (!data.mobile?.trim()) {
    error.mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(data.mobile.trim())) {
    error.mobile = "Mobile number must be 10 digits";
  }

  if (!data.password) {
    error.password = "Password is required";
  } else if (data.password.length < 6 || data.password.length > 10) {
    error.password = "Password must be between 6 and 10 characters";
  }

  if (!data.confirmPassword) {
    error.confirmPassword = "Confirm password is required";
  } else if (data.password !== data.confirmPassword) {
    error.confirmPassword = "Passwords do not match";
  }

  return error;
};

export const validateLogin = (data: Partial<AuthFormData>) => {
  const error: FormErrors = {};

  if (!data.mobile?.trim()) {
    error.mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(data.mobile.trim())) {
    error.mobile = "Mobile number must be 10 digits";
  }

  if (!data.password) {
    error.password = "Password is required";
  } else if (data.password.length < 6 || data.password.length > 10) {
    error.password = "Password must be between 6 and 10 characters";
  }

  return error;
};