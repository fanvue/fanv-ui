import * as React from "react";
import { EyeIcon } from "../Icons/EyeIcon";
import { EyeOffIcon } from "../Icons/EyeOffIcon";
import { TextField, type TextFieldProps } from "../TextField/TextField";

export type PasswordInputSize = "48" | "40" | "32";

export interface PasswordInputProps extends Omit<TextFieldProps, "type" | "rightIcon"> {
  /** Size variant of the password input */
  size?: PasswordInputSize;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
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
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    );

    return (
      <TextField
        ref={ref}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        rightIcon={rightIcon}
        aria-label={!props.label ? "Password input" : undefined}
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
