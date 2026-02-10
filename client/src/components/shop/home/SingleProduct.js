import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index";
import { isWishReq, unWishReq, isWish } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const SingleProduct = () => {
  const { data, dispatch } = useContext(HomeContext);
  const { products } = data;
  const history = useHistory();

  /* WishList State */
  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      const responseData = await getAllProduct();
      setTimeout(() => {
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
          dispatch({ type: "loading", payload: false });
        }
      }, 500);
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  /* LOADING */
  if (data.loading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    );
  }

  return (
    <Fragment>
      {products && products.length > 0 ? (
        products.map((item, index) => {
          const hasOffer = item.pOffer && Number(item.pOffer) > 0;
          const finalPrice = hasOffer
            ? Math.round(item.pPrice - (item.pPrice * item.pOffer) / 100)
            : item.pPrice;

          return (
            <div key={index} className="relative col-span-1 p-2">
              {/* Card container với height cố định */}
              <div className="flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                
                {/* IMAGE - Tỷ lệ cố định */}
                <div className="relative w-full aspect-square overflow-hidden rounded-t-lg cursor-pointer bg-gray-100">
                  <img
                    src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                    alt={item.pName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onClick={() => history.push(`/products/${item._id}`)}
                  />

                  {/* OFFER BADGE */}
                  {hasOffer && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{item.pOffer}%
                    </div>
                  )}

                  {/* WISHLIST */}
                  <div className="absolute top-2 right-2">
                    <svg
                      onClick={(e) => isWishReq(e, item._id, setWlist)}
                      className={`${
                        isWish(item._id, wList) && "hidden"
                      } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700 drop-shadow-md`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>

                    <svg
                      onClick={(e) => unWishReq(e, item._id, setWlist)}
                      className={`${
                        !isWish(item._id, wList) && "hidden"
                      } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700 drop-shadow-md`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      />
                    </svg>
                  </div>
                </div>

                {/* INFO - Flex grow để chiếm không gian còn lại */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  {/* Product Name */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 
                      className="text-sm font-medium text-gray-800 line-clamp-2 flex-1 cursor-pointer hover:text-gray-600"
                      onClick={() => history.push(`/products/${item._id}`)}
                    >
                      {item.pName}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {item.pRatingsReviews.length} đánh giá
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="flex flex-col">
                    {hasOffer && (
                      <span className="text-xs line-through text-gray-400">
                        {item.pPrice}.000 VNĐ
                      </span>
                    )}
                    <span className="text-base font-bold text-red-600">
                      {finalPrice}.000 VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24 text-2xl">
          No product found
        </div>
      )}
    </Fragment>
  );
};

export default SingleProduct;