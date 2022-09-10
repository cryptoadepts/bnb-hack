export const cn = (...args: string[]) => {
  return args.filter(Boolean).join(" ");
};
