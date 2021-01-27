import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

export const BackButton: React.FC = () => {
  const history = useHistory();
  const onClickToGoBack = () => {
    history.goBack();
  };
  return (
    <div className="fixed top-0 left-0  ml-3 mt-5">
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={onClickToGoBack}
        className="text-2xl 2xl:text-5xl text-amber-300 transition-colors cursor-pointer"
      />
    </div>
  );
};
