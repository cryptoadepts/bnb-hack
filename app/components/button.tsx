type Props = {
  type?: "submit" | "reset" | "button" | undefined;
  onClick: () => void;
};

export const Button = (props: Props) => {
  const { type, onClick } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      className="w-[min(240px,100%)] rounded-full bg-[#FF0099] px-[96px] py-[22px]"
    >
      create
    </button>
  );
};
