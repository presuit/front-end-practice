const colors = [
  "blugGray",
  "coolGray",
  "trueGray",
  "warmGray",
  "orange",
  "amber",
  "lime",
  "emerald",
  "teal",
  "cyan",
  "lightBlue",
  "violet",
  "fuchsia",
  "rose",
];

export const pickRandomBgColor = (): string => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

export {};
