interface IProps {
  loading: boolean;
  isValid: boolean;
  btnText: string;
}

export const FormButton: React.FC<IProps> = ({ loading, btnText, isValid }) => {
  return isValid ? (
    <button
      type="submit"
      className={`py-5 px-10 md:px-20 bg-teal-500 rounded-xl focus:outline-none ${
        loading && "pointer-events-none"
      }`}
    >
      {loading ? (
        <span className="md:text-xl text-gray-200 font-semibold">
          Loading...
        </span>
      ) : (
        <span className="md:text-xl text-gray-200 font-semibold">
          {btnText}
        </span>
      )}
    </button>
  ) : (
    <button
      type="submit"
      className="py-5 px-10 md:px-20 bg-rose-500 rounded-xl pointer-events-none focus:outline-none"
    >
      <span className="md:text-xl text-gray-200 font-semibold">...</span>
    </button>
  );
};
