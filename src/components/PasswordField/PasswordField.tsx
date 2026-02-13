import * as React from "react";
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { TextField, type TextFieldProps } from "../TextField/TextField";

export type PasswordFieldSize = "48" | "40" | "32";

export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "rightIcon"> {
  /** Size variant of the password field */
  size?: PasswordFieldSize;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const rightIcon = (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        disabled={disabled}
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
        className="flex size-5 shrink-0 items-center justify-center text-body-200 transition-colors hover:text-body-100 focus:outline-none disabled:cursor-not-allowed"
      >
        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
      </button>
    );

    return (
      <TextField
        ref={ref}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        rightIcon={rightIcon}
        aria-label={!props.label ? "Password field" : undefined}
        {...props}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";
