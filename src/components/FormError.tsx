interface IProps {
  errorMsg: string;
  style?: string;
}

export const FormError: React.FC<IProps> = ({ errorMsg, style }) => {
  return (
    <span
      className={`my-5 text-rose-500 md:text-lg text-base font-semibold ${style}`}
    >
      {errorMsg}
    </span>
  );
};
