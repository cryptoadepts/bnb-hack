export type ButtonProps = {
  onClick: () => void;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  children?: React.ReactNode;
};
