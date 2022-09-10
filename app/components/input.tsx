import { clsx } from "clsx";
import type { HTMLInputTypeAttribute } from "react";

type Props = {
  type?: HTMLInputTypeAttribute;
  className?: string;
  placeholder?: string;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
};

export const Input = (props: Props) => {
  const {
    type = "text",
    disabled,
    placeholder,
    value,
    onChange,
    className,
  } = props;

  return (
    <input
      type={type}
      className={clsx(
        "block h-[60px] rounded-xl border border-pink-600 border-pink-600 bg-black p-[18px] transition-all duration-300",
        "text-[16px] leading-[24px] text-white placeholder-[#4F4F4F]",
        "focus:border-pink-800 focus:outline-none focus:ring-pink-800",
        className
      )}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
