import type { ButtonProps } from "~/components/buttons/button.interface";
import { clsx } from "clsx";

export const OutlineButton = (props: ButtonProps) => {
  const { className, disabled, type, onClick, children } = props;

  return (
    <button
      className={clsx(
        "rounded-xl border border-[#575757] py-2.5 px-[30px] transition-all duration-300 hover:border-pink-800",
        className,
        { "cursor-not-allowed opacity-50 hover:border-[#575757]": disabled }
      )}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
