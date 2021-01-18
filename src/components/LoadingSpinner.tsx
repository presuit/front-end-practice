import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <FontAwesomeIcon
        className="text-5xl text-white spinAround "
        icon={faSpinner}
      />
    </div>
  );
};
