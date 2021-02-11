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

export const getDate = (dateNumber: number): string => {
  const dateObj = new Date(dateNumber);
  const dateYear = dateObj.getFullYear();
  const dateMonth = dateObj.getMonth() + 1;
  const dateDate = dateObj.getDate();
  return `${dateYear}년 ${dateMonth}월 ${dateDate}일`;
};

export const getNameSuppressed = (name: string): string => {
  let newName = name;
  if (name.length > 10) {
    newName = `${name.substr(0, 10)}...`;
  }
  return newName;
};

export const numberWithCommas = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export {};
