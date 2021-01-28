import { useMutation } from "@apollo/client";
import {
  faCheck,
  faPlus,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BUCKET_NAME } from "../constants";
import { EDIT_PRODUCT_MUTATION } from "../pages/EditProduct";
import {
  editProduct,
  editProductVariables,
} from "../__generated__/editProduct";
import { EDIT_PRODUCT_PRODUCT_QUERY } from "../pages/EditProduct";
import { FIND_PRODUCT_BY_ID_QUERY } from "../pages/Product";

interface IProps {
  originalImgs: string[];
  exitImgGrid: boolean;
  setExitImgGrid: React.Dispatch<React.SetStateAction<boolean>>;
  useFor: "CREATE" | "EDIT";
  productId?: number;
}

enum ImgGridMode {
  plus = "plus",
  delete = "delete",
}

export const ImgGrid: React.FC<IProps> = ({
  originalImgs,
  exitImgGrid,
  setExitImgGrid,
  useFor,
  productId,
}) => {
  const [imgGridMode, setImgGridMode] = useState<ImgGridMode>(ImgGridMode.plus);
  const [imgGrid, setImgGrid] = useState<string[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  const onCompleted = (data: editProduct) => {
    const {
      editProduct: { ok, error },
    } = data;
    if (ok) {
      alert("업데이트 완료");
    } else {
      alert(error);
    }
  };

  const [editProductMutation] = useMutation<editProduct, editProductVariables>(
    EDIT_PRODUCT_MUTATION,
    { onCompleted }
  );

  const onClickToDelete = async (e: any) => {
    let section = e.target.parentNode;
    if (section.tagName === "svg") {
      section = section.parentNode.parentNode;
    }
    if (section.tagName === "DIV") {
      section = section.parentNode;
    }
    // 어딜 클릭하든 section으로 나옴
    const id = section.id.split("-")[1];
    const img = imgGrid[+id];
    const key = img.split("/")[3];
    const data: { bucket: string; key: string } = {
      bucket: BUCKET_NAME,
      key,
    };
    console.log(key);
    const {
      data: axiosData,
    }: { data: { deleted: boolean; error?: string } } = await axios({
      method: "DELETE",
      url: "http://localhost:4000/uploads",
      data,
    });

    // send server delete command
    if (axiosData.deleted) {
      const updatedImgs = imgGrid.filter((eachImg) => eachImg !== img);
      setImgGrid([...updatedImgs]);
      if (useFor === "EDIT" && productId) {
        let bigImg: string | null;
        if (updatedImgs.length === 0) {
          bigImg = "delete";
        } else {
          bigImg = updatedImgs[0];
        }
        console.log(bigImg);
        await editProductMutation({
          variables: {
            input: {
              productId,
              detailImgSrcs: updatedImgs,
              bigImg,
            },
          },
          refetchQueries: [
            {
              query: EDIT_PRODUCT_PRODUCT_QUERY,
              variables: {
                productId: +productId,
              },
            },
            {
              query: FIND_PRODUCT_BY_ID_QUERY,
              variables: { productId: +productId },
            },
          ],
        });
      }
    } else {
      alert("해당 요청이 거부되었습니다.");
      console.log(axiosData.error);
    }
  };

  const uploadImg = () => {
    if (uploadRef.current) {
      console.log(uploadRef.current.files);
    }
  };

  useEffect(() => {
    setImgGrid([...originalImgs]);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-800">
      {/* grid mode changer */}
      <div className="fixed bottom-0 right-0 m-5 flex flex-col items-center justify-end">
        <FontAwesomeIcon
          onClick={() => setExitImgGrid(true)}
          icon={faCheck}
          className=" text-3xl text-teal-500 cursor-pointer "
        />
        <FontAwesomeIcon
          onClick={() => setImgGridMode(ImgGridMode.delete)}
          icon={faTrash}
          className=" text-3xl text-rose-500 my-10 cursor-pointer"
        />
        <label htmlFor="imgUpload">
          <FontAwesomeIcon
            onClick={() => setImgGridMode(ImgGridMode.plus)}
            icon={faPlus}
            className=" text-3xl text-gray-200  cursor-pointer"
          />
        </label>
        <input
          ref={uploadRef}
          onInput={uploadImg}
          type="file"
          id="imgUpload"
          name="imgUpload"
          multiple
          accept={"image/*"}
          className="hidden opacity-0 w-0 h-0"
        />
      </div>

      {/* grid */}
      <main className="max-w-screen-xl min-h-screen  mr-20 2xl:mx-auto grid md:grid-cols-3 gap-5 p-5">
        {imgGrid &&
          imgGrid.length !== 0 &&
          imgGrid.map((eachImg, index) => (
            <section
              id={`ImgGridItem-${index}`}
              key={index}
              className=" py-32 relative flex justify-center items-center bg-cover bg-center border-8 border-indigo-900 rounded-xl"
              style={{ backgroundImage: `url(${eachImg})` }}
            >
              {imgGridMode === ImgGridMode.delete && (
                <div
                  onClick={onClickToDelete}
                  className="absolute top-0 left-0 w-full h-full flex justify-center items-center cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-5xl text-amber-300 "
                  />
                </div>
              )}
            </section>
          ))}
      </main>
    </div>
  );
};
