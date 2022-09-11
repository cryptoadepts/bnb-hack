export type ButtonProps = {
  onClick: () => void;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  children?: React.ReactNode;
};
