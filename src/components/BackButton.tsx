import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

interface IProps {
  url?: string;
}

export const BackButton: React.FC<IProps> = ({ url }) => {
  const history = useHistory();
  const onClickToGoBack = () => {
    if (url) {
      return history.push(url);
    }
    return history.goBack();
  };
  return (
    <div className="fixed top-0 left-0  ml-3 mt-5 z-50">
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={onClickToGoBack}
        className="text-5xl text-amber-300 transition-colors cursor-pointer"
      />
    </div>
  );
};
