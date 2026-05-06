"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  checkPasswordRules,
  passwordStrength,
} from "@/lib/auth/passwordSchema";

type Props = {
  id: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
  showStrength?: boolean;
  showRules?: boolean;
  /** Optional controlled value. If omitted, component manages state internally. */
  value?: string;
  /** Called whenever the value changes (controlled or uncontrolled). */
  onValueChange?: (v: string) => void;
};

function PasswordInput({
  id,
  name,
  autoComplete = "current-password",
  required,
  showStrength = false,
  showRules = false,
  value: controlledValue,
  onValueChange,
}: Props) {
  const [show, setShow] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue ?? internalValue;

  const handleChange = (v: string) => {
    if (controlledValue === undefined) setInternalValue(v);
    onValueChange?.(v);
  };

  const rules = checkPasswordRules(value);
  const { score, label } = passwordStrength(value);

  const barColors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  return (
    <div className="grid gap-2">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#0d1f35]"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${
                  i <= score ? barColors[score] : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground w-16 text-right">
            {label}
          </span>
        </div>
      )}

      {showRules && value.length > 0 && (
        <ul className="text-xs space-y-0.5">
          {rules.map((r) => (
            <li
              key={r.label}
              className={`flex items-center gap-1.5 ${
                r.passed ? "text-green-700" : "text-muted-foreground"
              }`}
            >
              {r.passed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PasswordInput;
