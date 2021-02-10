import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faTimes,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

interface IProps {
  detailImgs: { source: string }[];
  fullSizeMode: boolean;
  setFullSizeMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FullSizeImgBoard: React.FC<IProps> = ({
  detailImgs,
  fullSizeMode,
  setFullSizeMode,
}) => {
  const [imgIndex, setImgIndex] = useState<number>(0);

  const onClickToExit = () => {
    setFullSizeMode(false);
  };

  const onClickToLeft = () => {
    let _index = imgIndex;
    const prevImgPagination = document.getElementById(`imgPagination${_index}`);
    let nextImgPagination: HTMLElement | null;

    if (detailImgs) {
      if (imgIndex === 0) {
        setImgIndex(detailImgs.length - 1);
        _index = detailImgs.length - 1;
      } else {
        setImgIndex((prev) => prev - 1);
        _index -= 1;
      }
    }

    nextImgPagination = document.getElementById(`imgPagination${_index}`);

    if (prevImgPagination) {
      prevImgPagination.style.color = "black";
    }

    if (nextImgPagination) {
      nextImgPagination.style.color = "rgba(252, 211, 77, 1)";
    }
  };

  const onClickToRight = () => {
    let _index = imgIndex;
    const prevImgPagination = document.getElementById(`imgPagination${_index}`);
    let nextImgPagination: HTMLElement | null;

    if (imgIndex === detailImgs.length - 1) {
      _index = 0;
      setImgIndex(0);
    } else {
      setImgIndex((prev) => prev + 1);
      _index += 1;
    }

    nextImgPagination = document.getElementById(`imgPagination${_index}`);

    if (prevImgPagination) {
      prevImgPagination.style.color = "black";
    }

    if (nextImgPagination) {
      nextImgPagination.style.color = "rgba(252, 211, 77, 1)";
    }
  };

  useEffect(() => {
    const fullSizeImgBoard = document.getElementById("fullSizeImgBoard");
    if (fullSizeImgBoard) {
      if (fullSizeMode) {
        fullSizeImgBoard.style.visibility = "visible";
        fullSizeImgBoard.style.opacity = "1";
        fullSizeImgBoard.style.zIndex = "50";
      } else {
        fullSizeImgBoard.style.visibility = "hidden";
        fullSizeImgBoard.style.opacity = "0";
        fullSizeImgBoard.style.zIndex = "0";
      }
    }
  }, [fullSizeMode]);

  useEffect(() => {
    const imgPagination = document.getElementById(`imgPagination0`);
    if (imgPagination) {
      imgPagination.style.color = "rgba(252, 211, 77, 1)";
    }
  }, []);

  return (
    <div
      id="fullSizeImgBoard"
      className="z-0 overflow-hidden w-full h-screen fixed top-0 left-0 bg-gray-800 flex justify-center items-center opacity-0 "
    >
      <img
        src={detailImgs[imgIndex].source}
        className="max-w-full max-h-full"
        alt="Img"
        title="Img"
      />
      {detailImgs && detailImgs.length !== 0 && (
        <div className="bg-transparent py-5 px-3 flex justify-center items-center absolute bottom-0 left-0 right-0 mx-auto flex-wrap">
          {detailImgs.map((eachImg, index) => (
            <FontAwesomeIcon
              key={index}
              id={`imgPagination${index}`}
              icon={faCircle}
              className="text-base md:text-xl text-black mx-5 my-3"
            />
          ))}
        </div>
      )}
      <FontAwesomeIcon
        icon={faChevronLeft}
        onClick={onClickToLeft}
        className="absolute top-0 bottom-0 left-0 my-auto text-5xl mx-5 text-amber-300 cursor-pointer"
      />
      <FontAwesomeIcon
        icon={faChevronRight}
        onClick={onClickToRight}
        className="absolute top-0 bottom-0 right-0 my-auto text-5xl mx-5 text-amber-300 cursor-pointer"
      />
      <FontAwesomeIcon
        onClick={onClickToExit}
        icon={faTimes}
        className="absolute top-0 right-0 text-5xl text-amber-300 mx-5 my-5 cursor-pointer"
      />
    </div>
  );
};
