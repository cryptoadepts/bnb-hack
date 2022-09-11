import type { ButtonProps } from "~/components/buttons/button.interface";
import { clsx } from "clsx";

export const Button = (props: ButtonProps) => {
  const { className, type, onClick, disabled, children } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-[min(240px,100%)] rounded-full bg-[#FF0099] px-[96px] py-[22px]",
        className,
        {
          "cursor-not-allowed opacity-50": disabled,
        }
      )}
    >
      {children}
    </button>
  );
};
