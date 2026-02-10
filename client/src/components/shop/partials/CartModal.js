import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi";
import { isAuthenticate } from "../auth/fetchApi";
import { cartList } from "../productDetails/Mixins";
import { subTotal, quantity, totalCost } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const CartModal = () => {
  const history = useHistory();

  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy giá từ localStorage (giá đã có offer)
  const getCartPrice = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(c => String(c.id) === String(productId));
    return item ? item.price : 0;
  };

  // Hàm cập nhật số lượng
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex(item => String(item.id) === String(productId));
    
    if (productIndex !== -1) {
      cart[productIndex].quantitiy = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Cập nhật lại state
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
  };

  // Hàm tăng số lượng
  const increaseQuantity = (productId) => {
    const currentQty = quantity(productId);
    updateQuantity(productId, currentQty + 1);
  };

  // Hàm giảm số lượng
  const decreaseQuantity = (productId) => {
    const currentQty = quantity(productId);
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const removeCartProduct = (id) => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart.length !== 0) {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    if (cart.length === 0) {
      dispatch({ type: "cartProduct", payload: null });
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        className={`${
          !data.cartModal ? "hidden" : ""
        } fixed top-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* Cart Modal Start */}
      <section
        className={`${
          !data.cartModal ? "hidden" : ""
        } fixed z-40 inset-0 flex items-start justify-end`}
      >
        <div
          style={{ background: "#303031" }}
          className="w-full md:w-5/12 lg:w-4/12 h-full flex flex-col justify-between"
        >
          <div className="overflow-y-auto">
            <div className="border-b border-gray-700 flex justify-between">
              <div className="p-4 text-white text-lg font-semibold">Giỏ hàng</div>
              {/* Cart Modal Close Button */}
              <div className="p-4 text-white">
                <svg
                  onClick={(e) => cartModalOpen()}
                  className="w-6 h-6 cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="m-4 flex-col">
              {products &&
                products.length !== 0 &&
                products.map((item, index) => {
                  const currentQty = quantity(item._id);
                  const productPrice = getCartPrice(item._id);
                  
                  return (
                    <Fragment key={index}>
                      {/* Cart Product Start */}
                      <div className="text-white flex space-x-3 my-4 items-start bg-gray-800 bg-opacity-50 p-3 rounded">
                        <img
                          className="w-20 h-20 object-cover object-center rounded"
                          src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                          alt="cartProduct"
                        />
                        <div className="relative w-full flex flex-col">
                          <div className="font-medium mb-2 pr-6">{item.pName}</div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm text-gray-400">Số lượng:</span>
                            <div className="flex items-center border border-gray-600 rounded overflow-hidden">
                              <button
                                onClick={() => decreaseQuantity(item._id)}
                                disabled={currentQty <= 1}
                                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <input
                                type="number"
                                value={currentQty}
                                onChange={(e) => {
                                  const newQty = parseInt(e.target.value);
                                  if (!isNaN(newQty) && newQty >= 1) {
                                    updateQuantity(item._id, newQty);
                                  }
                                }}
                                style={{
                                  MozAppearance: 'textfield',
                                  WebkitAppearance: 'none',
                                  appearance: 'none'
                                }}
                                className="w-12 text-center py-1 bg-gray-700 border-l border-r border-gray-600 focus:outline-none text-white"
                                min="1"
                              />
                              
                              <button
                                onClick={() => increaseQuantity(item._id)}
                                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Price Info */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              Đơn giá: <span className="text-white">{productPrice}.000 VNĐ</span>
                            </div>
                            <div className="text-sm font-semibold">
                              {subTotal(item._id, productPrice)}.000 VNĐ
                            </div>
                          </div>
                          
                          {/* Cart Product Remove Button */}
                          <div
                            onClick={(e) => removeCartProduct(item._id)}
                            className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
                          >
                            <svg
                              className="w-5 h-5 cursor-pointer"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Cart Product End */}
                    </Fragment>
                  );
                })}

              {products === null && (
                <div className="m-4 flex-col text-white text-xl text-center">
                  Không có sản phẩm trong giỏ hàng
                </div>
              )}
            </div>
          </div>
          <div className="m-4 space-y-4">
            <div
              onClick={(e) => cartModalOpen()}
              className="cursor-pointer px-4 py-2 border border-gray-400 text-white text-center"
            >
              Tiếp tục mua sắm
            </div>
            {data.cartTotalCost ? (
              <Fragment>
                {isAuthenticate() ? (
                  <div
                    className="px-4 py-2 bg-black text-white text-center cursor-pointer hover:bg-gray-900 transition-colors"
                    onClick={(e) => {
                      history.push("/checkout");
                      cartModalOpen();
                    }}
                  >
                    Mua ngay {data.cartTotalCost}.000 VNĐ
                  </div>
                ) : (
                  <div
                    className="px-4 py-2 bg-black text-white text-center cursor-pointer hover:bg-gray-900 transition-colors"
                    onClick={(e) => {
                      history.push("/");
                      cartModalOpen();
                      dispatch({
                        type: "loginSignupError",
                        payload: !data.loginSignupError,
                      });
                      dispatch({
                        type: "loginSignupModalToggle",
                        payload: !data.loginSignupModal,
                      });
                    }}
                  >
                    Mua ngay {data.cartTotalCost}.000 VNĐ
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="px-4 py-2 bg-black text-white text-center cursor-not-allowed">
                Mua ngay
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Cart Modal End */}
    </Fragment>
  );
};

export default CartModal;