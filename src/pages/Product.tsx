import React, { useEffect, useRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link, useHistory, useParams } from "react-router-dom";
import { PRODUCTS_FRAGMENT } from "../fragment";
import {
  findProductById,
  findProductByIdVariables,
} from "../__generated__/findProductById";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getNameSuppressed, numberWithCommas } from "../utils";
import { joinRoom, joinRoomVariables } from "../__generated__/joinRoom";
import { useMe } from "../hooks/useMe";
import { PointPercent } from "../__generated__/globalTypes";

interface IParams {
  id: string;
}

const FIND_PRODUCT_BY_ID_QUERY = gql`
  query findProductById($productId: Float!) {
    findProductById(productId: $productId) {
      ok
      error
      product {
        ...productsParts
        room {
          participantCounts
          isMeInRoom
        }
      }
    }
  }
  ${PRODUCTS_FRAGMENT}
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
  const { id } = useParams<IParams>();
  const { data: userData, loading: userLoading } = useMe();
  const { loading, data, refetch } = useQuery<
    findProductById,
    findProductByIdVariables
  >(FIND_PRODUCT_BY_ID_QUERY, {
    variables: {
      productId: +id,
    },
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
    }
    if (!ok && error) {
      alert(error);
    }
  };
  const [joinRoomMutation] = useMutation<joinRoom, joinRoomVariables>(
    JOIN_ROOM_MUTATION,
    { onCompleted }
  );

  const getRoomPrice = (value: PointPercent): number => {
    let percent: number = 1;
    if (data?.findProductById.product?.price) {
      if (value === PointPercent.full) {
        percent = 1;
      }
      if (value === PointPercent.half) {
        percent = 0.5;
      }
      if (value === PointPercent.one) {
        percent = 0.01;
      }
      if (value === PointPercent.ten) {
        percent = 0.1;
      }
      if (value === PointPercent.zeroDotOne) {
        percent = 0.001;
      }
      return Math.ceil(data.findProductById.product.price * percent);
    } else {
      throw Error("room Price를 구하지 못했습니다.");
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
      });
    }
  };
  const onClickToGoBack = () => {
    history.push("/");
  };

  if (!userLoading && userData?.me.user?.isVerified === false) {
    history.push("/not-valid-user");
  }

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

  console.log(data);

  return (
    <div>
      <div className="fixed top-0 left-0  ml-3 mt-5">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={onClickToGoBack}
          className="text-2xl 2xl:text-5xl text-amber-300 transition-colors cursor-pointer"
        />
      </div>
      <div className="max-w-screen-2xl min-h-screen mx-12 2xl:mx-auto shadow-2xl bg-indigo-500">
        <div className="flex items-center flex-col md:flex-row  pt-10 mx-5  shadow-xl">
          <div
            className="bg-cover bg-center  h-48 md:h-96  w-full md:rounded-l-2xl md:rounded-t-none rounded-t-2xl border-4 border-indigo-900"
            style={{
              backgroundImage: `url(${data?.findProductById.product?.bigImg})`,
            }}
          ></div>
          <div className="md:h-96  w-full bg-indigo-700 text-amber-300 grid grid-cols-2 md:rounded-r-2xl md:rounded-b-none rounded-b-2xl border-4 border-indigo-900 md:border-l-0 border-t-0 md:border-t-4">
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-r border-b border-indigo-500 p-3 ">
              <span>📦</span>
              {data?.findProductById.product?.name && (
                <span>
                  {getNameSuppressed(data?.findProductById.product?.name)}
                </span>
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
                <span className="text-xs md:text-base mt-3">
                  (응모당{" "}
                  {numberWithCommas(
                    getRoomPrice(data.findProductById.product.pointPercent)
                  )}
                  원)
                </span>
              )}
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center border-r border-indigo-500 p-3">
              <span>🛒</span>
              <Link to={`/category/slug`} className="hover:underline">
                {data?.findProductById.product?.category.slug}
              </Link>
            </h1>
            <h1 className="text-xl font-semibold md:text-3xl  flex flex-col justify-center items-center p-3">
              <span>👨‍👧‍👧</span>
              <span>
                {data?.findProductById.product?.room?.participantCounts}
              </span>
            </h1>
          </div>
        </div>
        {/*  */}

        <div className="mt-10 mx-5 flex items-center justify-center  ">
          <div className="py-5 px-3 bg-indigo-700 text-center font-semibold text-base md:text-xl text-gray-200 rounded-l-2xl   focus:outline-none w-1/2">
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
          <div className="w-1/2">
            {data?.findProductById.product?.room?.isMeInRoom ? (
              <button className="py-5 px-3 bg-teal-500 rounded-r-2xl focus:outline-none font-semibold text-base md:text-xl text-amber-300 transition-colors  cursor-not-allowed w-full ">
                이미 참여하셨습니다.
              </button>
            ) : (
              <button
                onClick={onClickJoinRoom}
                className="py-5 px-3 bg-teal-500 rounded-r-2xl focus:outline-none font-semibold text-base md:text-xl text-gray-200 hover:text-amber-300 transition-colors focus:ring-4 ring-teal-600 w-full "
              >
                참가하기
              </button>
            )}
          </div>
        </div>
        {/*  */}
        <div className="mt-10 mx-5 pb-10">
          <h1
            ref={descriptionContainer}
            className="bg-gray-200 py-16 px-5 rounded-2xl shadow-2xl md:text-xl"
          ></h1>
        </div>
      </div>
    </div>
  );
};
