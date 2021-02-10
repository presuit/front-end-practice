import React, { useEffect, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link, useHistory, useParams } from "react-router-dom";
import { PRODUCTS_FRAGMENT } from "../fragment";
import {
  findProductById,
  findProductByIdVariables,
} from "../__generated__/findProductById";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getNameSuppressed, numberWithCommas } from "../utils";
import { joinRoom, joinRoomVariables } from "../__generated__/joinRoom";
import { useMe } from "../hooks/useMe";
import { PointPercent } from "../__generated__/globalTypes";
import { FullSizeImgBoard } from "../components/FullSizeImgBoard";
import { BackButton } from "../components/BackButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { ALL_MSG_ROOMS_QUERY } from "./Messages";
import "../styles/productDetailImg.css";
import {
  deleteProduct,
  deleteProductVariables,
} from "../__generated__/deleteProduct";

interface IParams {
  id: string;
}

export const FIND_PRODUCT_BY_ID_QUERY = gql`
  query findProductById($productId: Float!) {
    findProductById(productId: $productId) {
      ok
      error
      product {
        ...productsParts
        seller {
          id
          username
        }
        buyer {
          id
          username
        }
        room {
          participantCounts
          isMeInRoom
        }
      }
    }
  }
  ${PRODUCTS_FRAGMENT}
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation deleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
      ok
      error
    }
  }
`;

const JOIN_ROOM_MUTATION = gql`
  mutation joinRoom($input: JoinRoomInput!) {
    joinRoom(input: $input) {
      ok
      error
      soldout
    }
  }
`;

export const Product = () => {
  const history = useHistory();
  const descriptionContainer = useRef<HTMLHeadingElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [fullSizeMode, setFullSizeMode] = useState<boolean>(false);
  const { id } = useParams<IParams>();
  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useMe();
  const { loading, data, refetch } = useQuery<
    findProductById,
    findProductByIdVariables
  >(FIND_PRODUCT_BY_ID_QUERY, {
    variables: {
      productId: +id,
    },
  });

  const onCompletedDeleteProduct = (data: deleteProduct) => {
    const {
      deleteProduct: { ok, error },
    } = data;
    if (ok) {
      alert("삭제 성공!");
      history.push("/");
    } else {
      alert(error);
    }
  };

  const [deleteProductMutation] = useMutation<
    deleteProduct,
    deleteProductVariables
  >(DELETE_PRODUCT_MUTATION, {
    onCompleted: onCompletedDeleteProduct,
  });

  const onCompleted = (data: joinRoom) => {
    const {
      joinRoom: { ok, error, soldout },
    } = data;
    if (ok) {
      alert("성공적으로 등록 되셨습니다.");
      if (soldout) {
        alert(
          "상품의 금액 임계점을 넘은 상태이므로 랜덤으로 구매자를 뽑습니다."
        );
      }
      refetch({ productId: +id });
      refetchUser();
    }
    if (!ok && error) {
      alert(error);
    }
  };
  const [joinRoomMutation] = useMutation<joinRoom, joinRoomVariables>(
    JOIN_ROOM_MUTATION,
    { onCompleted }
  );

  const getRoomPrice = (value: PointPercent) => {
    if (data?.findProductById.product?.price) {
      let percent: number;
      if (value === PointPercent.full) {
        percent = 1;
      } else if (value === PointPercent.half) {
        percent = 0.5;
      } else if (value === PointPercent.one) {
        percent = 0.01;
      } else if (value === PointPercent.ten) {
        percent = 0.1;
      } else if (value === PointPercent.zeroDotOne) {
        percent = 0.001;
      } else {
        return NaN;
      }
      console.log(percent);
      let calcedPrice = Math.ceil(data.findProductById.product.price * percent);
      if (calcedPrice % 10 !== 0) {
        calcedPrice = (Math.floor(calcedPrice / 10) + 1) * 10;
      }
      return calcedPrice;
    } else {
      return NaN;
    }
  };

  const onClickJoinRoom = async () => {
    if (data?.findProductById.product && userData?.me.user) {
      const joinRoomPrice = getRoomPrice(
        data.findProductById.product.pointPercent
      );
      await joinRoomMutation({
        variables: {
          input: {
            price: joinRoomPrice,
            productId: data.findProductById.product.id,
            userId: userData.me.user?.id,
          },
        },
        refetchQueries: [
          {
            query: ALL_MSG_ROOMS_QUERY,
          },
        ],
      });
    }
  };

  const onClickFullSizeImg = () => {
    if (data?.findProductById.product?.bigImg) {
      setFullSizeMode(true);
    }
  };

  const onClickToRevealAllName = (e: any) => {
    if (data?.findProductById.product?.name) {
      e.target.innerText = data?.findProductById.product?.name;
    }
  };

  const onClickToOpenQuestion = () => {
    if (questionRef.current) {
      questionRef.current.style.display = "block";
      questionRef.current.style.opacity = "1";
    }
  };

  const onClickToOpenQuestionClose = () => {
    if (questionRef.current) {
      questionRef.current.style.display = "hidden";
      questionRef.current.style.opacity = "0";
    }
  };

  const onClickToDeleteProduct = async () => {
    const ok = window.confirm("정말로 지우시겠습니까?");
    if (ok) {
      await deleteProductMutation({ variables: { input: { productId: +id } } });
    }
  };

  useEffect(() => {
    if (!userLoading && userData?.me.user?.isVerified === false) {
      history.push("/not-valid-user");
    }
  }, [userData]);

  useEffect(() => {
    if (data?.findProductById.product?.description) {
      if (descriptionContainer.current) {
        descriptionContainer.current.innerHTML =
          data.findProductById.product.description;
      }
    }
  }, [data]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (data?.findProductById.error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-amber-300 text-3xl font-bold">
          {data?.findProductById.error}
        </h1>
        <Link className="mt-10 text-gray-200 hover:underline text-xl" to="/">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 뒤로 가기 버튼 */}
      <BackButton url={"/"} />
      {data?.findProductById.product?.detailImgs &&
        data?.findProductById.product?.detailImgs.length !== 0 && (
          <FullSizeImgBoard
            fullSizeMode={fullSizeMode}
            setFullSizeMode={setFullSizeMode}
            detailImgs={data?.findProductById.product?.detailImgs}
          />
        )}
      {/* 메인 프레임  */}
      <div className="max-w-screen-2xl min-h-screen  2xl:mx-auto  bg-indigo-500">
        {/* 프로덕트 페이지  최상단에 위치한 상품 사진 및 정보 컴포넌트 */}
        <div className=" grid grid-rows-2  md:grid-cols-2 md:grid-rows-1  pt-10 mx-5  shadow-xl ">
          {/* 프로덕트 사진 */}
          <div className=" w-full h-full  md:rounded-l-2xl md:rounded-t-none rounded-t-2xl border-8 border-indigo-900 overflow-hidden  ">
            <div
              onClick={onClickFullSizeImg}
              className="w-full h-full bg-cover bg-center transform hover:scale-110 transition-transform cursor-pointer z-0 twoXLImg"
              style={{
                backgroundImage: `url(${data?.findProductById.product?.bigImg})`,
                transitionDuration: "0.6s",
              }}
            ></div>
          </div>
          {/* 프로덕트 디테일 정보 */}
          <div className=" w-full h-full bg-indigo-700 text-amber-300 grid grid-cols-2 md:rounded-r-2xl md:rounded-b-none rounded-b-2xl border-8 border-indigo-900 md:border-l-0 border-t-0 md:border-t-8">
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-r border-b border-indigo-500 p-3 ">
              <span>📦</span>
              {data?.findProductById.product?.name && (
                <div className="text-center">
                  {getNameSuppressed(
                    data.findProductById.product.name
                  ).includes("...") ? (
                    <>
                      <span
                        onClick={onClickToRevealAllName}
                        className="hover:underline"
                      >
                        {getNameSuppressed(data.findProductById.product.name)}
                      </span>
                    </>
                  ) : (
                    <span>{data.findProductById.product.name}</span>
                  )}
                </div>
              )}
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-b border-indigo-500 p-3">
              <span>💲</span>
              {data?.findProductById.product?.price ? (
                <span>
                  {numberWithCommas(data?.findProductById.product?.price)}원
                </span>
              ) : (
                <span>가격이 정해지지 않았습니다.</span>
              )}
              {data?.findProductById.product?.pointPercent && (
                <div className="text-xs md:text-base mt-3 relative">
                  (응모당{" "}
                  {numberWithCommas(
                    getRoomPrice(data.findProductById.product.pointPercent)
                  )}
                  원)
                  <FontAwesomeIcon
                    onClick={onClickToOpenQuestion}
                    className="ml-1 cursor-pointer text-indigo-300"
                    icon={faQuestionCircle}
                  />
                  <div
                    onClick={onClickToOpenQuestionClose}
                    ref={questionRef}
                    className="hidden absolute top-7  left-1/2 w-24 text-black text-xs  p-3 bg-indigo-300 rounded-xl font-semibold cursor-pointer transition-all"
                  >
                    응모당 가격의 일의자리는 올림하여 계산 됩니다.
                  </div>
                </div>
              )}
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-r border-indigo-500 p-3 border-b">
              <span>🛒</span>
              {data?.findProductById.product?.category.slug ? (
                <Link
                  to={`/category/${data?.findProductById.product?.category.slug}`}
                  className="hover:underline"
                >
                  {data?.findProductById.product?.category.slug}
                </Link>
              ) : (
                <div>No Category</div>
              )}
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center p-3 border-b border-indigo-500">
              <span>👨‍👧‍👧</span>
              <span>
                {data?.findProductById.product?.room?.participantCounts}
              </span>
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center p-3 border-r border-indigo-500">
              <span className="text-xs md:text-lg">판매자</span>
              <span>
                <Link
                  className="hover:underline"
                  to={`/users/${data?.findProductById.product?.seller.id}`}
                >
                  {data?.findProductById.product?.seller.username}
                </Link>
              </span>
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center p-3">
              <span className="text-xs md:text-lg">구매자</span>
              {data?.findProductById.product?.buyer ? (
                <span>
                  <Link
                    className="hover:underline"
                    to={`/users/${data?.findProductById.product?.buyer.id}`}
                  >
                    {data.findProductById.product.buyer.username}
                  </Link>
                </span>
              ) : (
                <span className="text-lg">구매자가 아직 없습니다.</span>
              )}
            </h1>
          </div>
        </div>

        {/* 프로덕트 수정 */}

        {data?.findProductById.product?.seller.id &&
          userData?.me.user?.id &&
          data?.findProductById.product?.seller.id ===
            userData?.me.user?.id && (
            <div className="mt-5 flex md:justify-end justify-center items-center mx-5">
              <button
                onClick={onClickToDeleteProduct}
                className="bg-rose-600 text-gray-200 py-5 px-10 rounded-xl font-semibold md:text-xl mr-5 focus:outline-none"
              >
                삭제하기
              </button>
              <Link
                to={`/product/${id}/edit`}
                className="bg-indigo-600 text-gray-200 py-5 px-10 rounded-xl font-semibold md:text-xl "
              >
                수정하기
              </Link>
            </div>
          )}

        {/* 프로덕트 모인 금액과 참가하는 버튼이 존재하는 부분 */}
        <div className="mt-5 mx-5 grid grid-cols-2  ">
          <div className="py-5 px-3 bg-indigo-700 text-center font-semibold text-base md:text-xl text-gray-200 rounded-l-2xl   focus:outline-none w-full h-full flex justify-center items-center">
            {data?.findProductById.product?.soldout ? (
              <span>soldout!</span>
            ) : (
              <>
                {" "}
                <span>현재까지 </span>
                <span className="text-amber-300">
                  {numberWithCommas(
                    data?.findProductById.product?.savedAmount || 0
                  )}
                  원
                </span>
              </>
            )}
          </div>
          <div className="w-full h-full flex justify-center items-center">
            {data?.findProductById.product?.room?.isMeInRoom ? (
              <button className="py-5 px-3 bg-teal-500 rounded-r-2xl focus:outline-none font-semibold text-base md:text-xl text-amber-300 transition-colors  cursor-not-allowed w-full ">
                이미 참여하셨습니다.
              </button>
            ) : (
              <>
                {data?.findProductById.product?.soldout ? (
                  <button className="py-5 px-3 bg-teal-500 rounded-r-2xl focus:outline-none font-semibold text-base md:text-xl text-amber-300 transition-colors  cursor-not-allowed w-full ">
                    SoldOut!
                  </button>
                ) : (
                  <button
                    onClick={onClickJoinRoom}
                    className="py-5 px-3 bg-teal-500 rounded-r-2xl focus:outline-none font-semibold text-base md:text-xl text-gray-200 hover:text-amber-300 transition-colors focus:ring-4 ring-teal-600 w-full "
                  >
                    참가하기
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        {/* 프로덕트 세부 설명 컴포넌트 */}
        <div className="mt-10 mx-5 pb-20">
          <h1
            ref={descriptionContainer}
            className="bg-gray-200 py-16 px-5 rounded-2xl shadow-2xl md:text-xl"
          ></h1>
        </div>
      </div>
    </div>
  );
};
