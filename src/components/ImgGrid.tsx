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
import {
  BASE_BACKEND_HTTPS_URL,
  BASE_LOCAL_BACKEND_HTTP_URL,
  BUCKET_NAME,
} from "../constants";
import { EDIT_PRODUCT_MUTATION } from "../pages/EditProduct";
import {
  editProduct,
  editProductVariables,
} from "../__generated__/editProduct";
import { EDIT_PRODUCT_PRODUCT_QUERY } from "../pages/EditProduct";
import { FIND_PRODUCT_BY_ID_QUERY } from "../pages/Product";
import { AvatarFullsize } from "./avatarFullsize";

interface IProps {
  originalImgs: string[];
  setOriginalImgs?: React.Dispatch<React.SetStateAction<string[]>>;
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
  setOriginalImgs,
}) => {
  const [imgGridMode, setImgGridMode] = useState<ImgGridMode>(ImgGridMode.plus);
  const [imgGrid, setImgGrid] = useState<string[]>([]);
  const [fullsizeMode, setFullsizeMode] = useState(false);
  const [currentFullImg, setCurrentFullImg] = useState("");
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

  const onClickToDeleteOnUpdate = async (e: any) => {
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
    const {
      data: axiosData,
    }: { data: { deleted: boolean; error?: string } } = await axios({
      method: "DELETE",
      url:
        process.env.NODE_ENV === "production"
          ? `${BASE_BACKEND_HTTPS_URL}/uploads`
          : `${BASE_LOCAL_BACKEND_HTTP_URL}/uploads`,
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

  const uploadImgUpdate = async () => {
    if (useFor === "EDIT" && productId) {
      if (uploadRef.current?.files) {
        const fileList: FileList = uploadRef.current.files;
        if (fileList && fileList.length !== 0) {
          const formData = new FormData();
          Object.values(fileList).forEach(async (eachFile) => {
            formData.append("uploads", eachFile);
          });
          const {
            data,
          }: {
            data: { uploaded: boolean; url: string | null }[];
          } = await axios({
            method: "POST",
            url:
              process.env.NODE_ENV === "production"
                ? `${BASE_BACKEND_HTTPS_URL}/uploads`
                : `${BASE_LOCAL_BACKEND_HTTP_URL}/uploads`,
            headers: { "Content-Type": "multipart/form-data" },
            data: formData,
          });
          if (data && data.length !== 0) {
            const urlContainer: string[] = [];
            for (const item of data) {
              if (item.uploaded && item.url) {
                urlContainer.push(item.url);
              } else {
                console.log(`aws-s3 img upload error on ${item}`);
              }
            }
            if (urlContainer.length !== 0) {
              const detailImgSrcs = [...imgGrid, ...urlContainer];
              setImgGrid((prev) => [...prev, ...urlContainer]);
              console.log("detailImgs", detailImgSrcs, imgGrid);
              await editProductMutation({
                variables: {
                  input: {
                    productId,
                    detailImgSrcs,
                    bigImg: detailImgSrcs[0],
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
              uploadRef.current.value = "";
            }
          }
        }
      }
    }
  };

  const uploadImgCreate = async () => {
    if (useFor === "CREATE" && setOriginalImgs) {
      if (uploadRef.current?.files) {
        const fileList: FileList = uploadRef.current.files;
        const urls = Object.values(fileList).map((eachFile) =>
          URL.createObjectURL(eachFile)
        );
        console.log(urls);
        if (urls.length !== 0) {
          setImgGrid([...imgGrid, ...urls]);
          setOriginalImgs([...originalImgs, ...urls]);
          uploadRef.current.value = "";
        }
      }
    }
  };

  const onClickToDeleteOnCreate = (e: any) => {
    if (useFor === "CREATE" && setOriginalImgs) {
      let section = e.target.parentNode;
      if (section.tagName === "svg") {
        section = section.parentNode.parentNode;
      }
      if (section.tagName === "DIV") {
        section = section.parentNode;
      }

      const sectionId = section.id.split("-")[1];
      const sectionImg = imgGrid[+sectionId];
      const updatedImgGrid = imgGrid.filter(
        (eachImg) => eachImg !== sectionImg
      );
      setImgGrid([...updatedImgGrid]);
      setOriginalImgs([...updatedImgGrid]);
    }
  };

  const onClickToFullSize = (e: any) => {
    let section = e.target.parentNode;
    if (section.tagName === "svg") {
      section = section.parentNode.parentNode;
    }
    if (section.tagName === "DIV") {
      section = section.parentNode;
    }

    const id = section.id.split("-")[1];
    const img = imgGrid[+id];
    setCurrentFullImg(img);
    setFullsizeMode(true);
  };

  useEffect(() => {
    setImgGrid([...originalImgs]);
  }, []);

  console.log(currentFullImg);

  return (
    <div className="min-h-screen w-full bg-gray-800 z-50 ">
      {fullsizeMode && (
        <AvatarFullsize
          avatarUrl={currentFullImg}
          fullsizeMode={fullsizeMode}
          setFullsizeMode={setFullsizeMode}
        />
      )}
      {/* grid mode changer */}
      <div className="fixed bottom-0 right-0 m-5 flex flex-col items-center justify-end">
        <FontAwesomeIcon
          onClick={() => {
            setExitImgGrid(true);
            setImgGridMode(ImgGridMode.plus);
          }}
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
          onInput={useFor === "EDIT" ? uploadImgUpdate : uploadImgCreate}
          type="file"
          id="imgUpload"
          name="imgUpload"
          multiple
          accept={"image/*"}
          className="hidden opacity-0 w-0 h-0"
        />
      </div>

      {/* grid */}
      <main className="max-w-screen-xl min-h-screen  mr-20 2xl:mx-auto grid grid-rows-3 md:grid-cols-3 gap-5 p-5">
        {imgGrid &&
          imgGrid.length !== 0 &&
          imgGrid.map((eachImg, index) => (
            <section
              id={`ImgGridItem-${index}`}
              key={index}
              className=" relative rounded-xl  hover:shadow-2xl transition-shadow overflow-hidden"
            >
              <div
                onClick={onClickToFullSize}
                className="w-full h-full bg-cover bg-center transform hover:scale-125 transition-transform duration-500 cursor-pointer"
                style={{ backgroundImage: `url(${eachImg})` }}
              ></div>
              {imgGridMode === ImgGridMode.delete && (
                <div
                  onClick={
                    useFor === "EDIT"
                      ? onClickToDeleteOnUpdate
                      : onClickToDeleteOnCreate
                  }
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
