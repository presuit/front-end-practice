import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

interface IProps {
  avatarUrl: string;
  fullsizeMode: boolean;
  setFullsizeMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AvatarFullsize: React.FC<IProps> = ({
  avatarUrl,
  fullsizeMode,
  setFullsizeMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onClickToExit = () => {
    setFullsizeMode(false);
  };

  useEffect(() => {
    if (fullsizeMode) {
      if (containerRef.current) {
        containerRef.current.style.display = "flex";
      }
    } else {
      if (containerRef.current) {
        containerRef.current.style.display = "hidden";
      }
    }
  }, [fullsizeMode]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen items-center justify-center hidden z-50 bg-gray-800"
    >
      <img src={avatarUrl} className="max-w-full max-h-full" />
      <FontAwesomeIcon
        onClick={onClickToExit}
        className="absolute top-0 right-0 text-5xl text-amber-300 mx-5 my-5 cursor-pointer"
        icon={faTimes}
      />
    </div>
  );
};
