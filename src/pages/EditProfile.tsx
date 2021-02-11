import { gql, useMutation } from "@apollo/client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data } from "autoprefixer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import {
  BASE_BACKEND_HTTPS_URL,
  BASE_LOCAL_BACKEND_HTTP_URL,
  BUCKET_NAME,
} from "../constants";
import { useMe } from "../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../__generated__/editProfile";

interface IParams {
  id: string;
}

interface IFormParams {
  editProfileUserAvatar?: FileList | null;
  username?: string | null;
  password?: string | null;
}

const EDIT_USER_PROFILE = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

export const EditProfile = () => {
  const { data: userData } = useMe();
  const { register, getValues, setValue } = useForm<IFormParams>();
  const { id } = useParams<IParams>();
  const history = useHistory();
  const [previewImage, setPreviewImage] = useState<string>("");
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { error, ok },
    } = data;
    if (ok) {
      alert("프로필 수정이 성공적으로 완료되었습니다.");
      history.goBack();
    }
    if (!ok && error) {
      alert(error);
    }
  };
  const [editProfileMutation] = useMutation<editProfile, editProfileVariables>(
    EDIT_USER_PROFILE,
    { onCompleted }
  );

  const onInputPicture = () => {
    const { editProfileUserAvatar } = getValues();

    if (editProfileUserAvatar && editProfileUserAvatar.length !== 0) {
      const file = editProfileUserAvatar.item(0);
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
    }
    if (editProfileUserAvatar && editProfileUserAvatar.length === 0) {
      setPreviewImage((prev) => prev);
    }
  };

  const onClickToSave = async () => {
    const { editProfileUserAvatar, password, username } = getValues();
    let fileUrl: string = "";

    if (editProfileUserAvatar && editProfileUserAvatar.length !== 0) {
      // if previous avatar img exists then delete it from aws_s3 and update
      if (userData?.me?.user?.avatarImg) {
        const key = userData.me.user.avatarImg.split("/")[3];
        console.log("key", key);
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
        if (!axiosData.deleted) {
          console.log(axiosData.error);
          throw Error("axios delete method not fulfilled");
        }
      }

      const formImgData = new FormData();
      Object.values(editProfileUserAvatar).forEach((eachImg) =>
        formImgData.append("uploads", eachImg)
      );
      const {
        data,
      }: { data: { uploaded: boolean; url: string }[] } = await axios({
        method: "POST",
        url:
          process.env.NODE_ENV === "production"
            ? `${BASE_BACKEND_HTTPS_URL}/uploads`
            : `${BASE_LOCAL_BACKEND_HTTP_URL}/uploads`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formImgData,
      });
      if (data && data[0].uploaded === true) {
        fileUrl = data[0].url;
      }
    }

    await editProfileMutation({
      variables: {
        input: {
          userId: +id,
          ...(fileUrl !== "" && { avatarImg: fileUrl }),
          ...(password && { password }),
          ...(username && { username }),
        },
      },
    });
  };

  useEffect(() => {
    if (userData?.me.user) {
      if (userData.me.user.id !== +id) {
        history.goBack();
      }
    }
    if (userData?.me.user?.username) {
      setValue("username", userData?.me.user?.username);
    }
  }, [userData]);

  return (
    <div>
      <BackButton />
      <div className="max-w-screen-lg  min-h-screen  lg:mx-auto ">
        <div>
          <label
            htmlFor="editProfileUserAvatar"
            className="cursor-pointer h-96 bg-indigo-600 flex justify-center items-center"
          >
            {previewImage && (
              <img src={previewImage} className="max-h-full  max-w-full" />
            )}
            {userData?.me.user?.avatarImg && !Boolean(previewImage) && (
              <img
                src={userData?.me.user?.avatarImg}
                className="max-h-full  max-w-full"
              />
            )}
            {!Boolean(previewImage) && !userData?.me.user?.avatarImg && (
              <FontAwesomeIcon
                icon={faPlus}
                className="text-7xl text-indigo-500"
              />
            )}
          </label>
          <input
            onInput={onInputPicture}
            ref={register}
            className="absolute w-0 h-0 opacity-0"
            type="file"
            accept="image/*"
            name="editProfileUserAvatar"
            id="editProfileUserAvatar"
          />
        </div>
        <div className="flex flex-col p-5 bg-indigo-700">
          <input
            ref={register}
            name="username"
            placeholder="닉네임"
            className=" mb-3 py-5 px-3 md:text-xl focus:outline-none bg-indigo-500 text-white placeholder-gray-200"
          />
          <input
            ref={register}
            type="password"
            name="password"
            placeholder="비밀번호"
            className=" py-5 px-3 md:text-xl focus:outline-none bg-indigo-500 text-white placeholder-gray-200"
          />
          <button
            onClick={onClickToSave}
            className="self-end py-3 px-10 bg-teal-500 text-gray-200 font-semibold mt-3"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
