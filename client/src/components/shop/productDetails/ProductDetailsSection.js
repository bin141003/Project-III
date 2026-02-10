import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";

import { getSingleProduct } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";

import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { updateQuantity, slideImage, addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const ProductDetailsSection = (props) => {
  let { id } = useParams();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const sProduct = layoutData.singleProductDetail;
  const [pImages, setPimages] = useState(null);
  const [count, setCount] = useState(0);
  const [quantitiy, setQuantitiy] = useState(1);
  const [, setAlertq] = useState(false);
  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")));

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      setTimeout(() => {
        if (responseData.Product) {
          layoutDispatch({ type: "singleProductDetail", payload: responseData.Product });
          setPimages(responseData.Product.pImages);
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() });
        }
        if (responseData.error) {
          console.log(responseData.error);
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
    fetchCartProduct();
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="w-12 h-12 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    );
  } 
  
  if (!sProduct) {
    return <div>No product</div>;
  }

  const hasOffer = sProduct.pOffer && Number(sProduct.pOffer) > 0;
  const finalPrice = Math.round(Number(sProduct.pPrice) - (Number(sProduct.pPrice) * Number(sProduct.pOffer || 0)) / 100);
  const isInCart = layoutData.inCart !== null && layoutData.inCart.includes(sProduct._id);
  const isOutOfStock = sProduct.pQuantity === 0;

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!sProduct.pRatingsReviews || sProduct.pRatingsReviews.length === 0) {
      return 0;
    }
    const totalRating = sProduct.pRatingsReviews.reduce((sum, review) => {
      const rating = Number(review.rating) || 0;
      return sum + rating;
    }, 0);
    const average = totalRating / sProduct.pRatingsReviews.length;
    return average.toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const reviewCount = sProduct.pRatingsReviews?.length || 0;

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory._id,
          product: sProduct.pName,
          category: sProduct.pCategory.cName,
        }}
      />
      
      <section className="max-w-6xl mx-auto px-4 md:px-6 my-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {sProduct.pImages.map((img, idx) => (
                <img
                  key={idx}
                  onClick={() => setCount(idx)}
                  className={`w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg cursor-pointer border-2 transition-all flex-shrink-0 ${
                    count === idx ? 'border-yellow-600 opacity-100' : 'border-gray-200 opacity-50 hover:opacity-75'
                  }`}
                  src={`${apiURL}/uploads/products/${img}`}
                  alt={`thumb-${idx}`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative bg-gray-50 rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
              <img
                className="w-full h-full object-contain p-4"
                src={`${apiURL}/uploads/products/${sProduct.pImages[count]}`}
                alt="Product"
              />
              
              {/* Navigation Arrows */}
              {sProduct.pImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCount(count > 0 ? count - 1 : sProduct.pImages.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCount(count < sProduct.pImages.length - 1 ? count + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col">
            {/* Title & Wishlist */}
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">{sProduct.pName}</h1>
              <button
                onClick={(e) => isWish(sProduct._id, wList) ? unWishReq(e, sProduct._id, setWlist) : isWishReq(e, sProduct._id, setWlist)}
                className="ml-3 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg
                  className={`w-6 h-6 ${isWish(sProduct._id, wList) ? 'fill-yellow-600 text-yellow-600' : 'text-gray-400'}`}
                  fill={isWish(sProduct._id, wList) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-500 fill-current' : i < averageRating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill={i < Math.floor(averageRating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">{averageRating > 0 ? averageRating : 'Chưa có'}</span>
              <span className="text-sm text-gray-500">({reviewCount} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">{finalPrice}.000đ</span>
                {hasOffer && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{sProduct.pPrice}.000đ</span>
                    <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">-{sProduct.pOffer}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {sProduct.pDescription && (
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{sProduct.pDescription}</p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Số lượng</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity("decrease", sProduct.pQuantity, quantitiy, setQuantitiy, setAlertq)}
                    disabled={isInCart || quantitiy <= 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-6 py-2 font-semibold text-gray-800">{quantitiy}</span>
                  <button
                    onClick={() => updateQuantity("increase", sProduct.pQuantity, quantitiy, setQuantitiy, setAlertq)}
                    disabled={isInCart || quantitiy >= sProduct.pQuantity}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {isOutOfStock ? 'Hết hàng' : `${sProduct.pQuantity} sản phẩm có sẵn`}
                </span>
              </div>
              {quantitiy === sProduct.pQuantity && (
                <p className="text-xs text-red-500 mt-2">Đã đạt số lượng tối đa</p>
              )}
            </div>

            {/* Add to Cart Button */}
            {isOutOfStock ? (
              <button disabled className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed">
                HẾT HÀNG
              </button>
            ) : isInCart ? (
              <button disabled className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold cursor-not-allowed">
                ĐÃ THÊM VÀO GIỎ HÀNG
              </button>
            ) : (
              <button
                onClick={() => addToCart(sProduct._id, quantitiy, finalPrice, layoutDispatch, setQuantitiy, setAlertq, fetchData, totalCost)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Product Details Section Two */}
      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;