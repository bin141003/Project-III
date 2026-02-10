import React, { Fragment, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";

import DropIn from "braintree-web-drop-in-react";
import { useState } from "react";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
    clientToken: null,
    instance: {},
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchbrainTree(getBrainTreeToken, setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Please wait until finish
      </div>
    );
  }
  
  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2 font-semibold mb-4">Giỏ hàng</div>
        
        {/* Product List */}
        <div className="flex flex-col md:flex md:space-x-4 md:flex-row">
          <div className="md:w-2/3">
            <CheckoutProducts products={data.cartProduct} dispatch={dispatch} />
          </div>
          
          <div className="w-full order-first md:order-last md:w-1/3">
            {/* Tổng giỏ hàng */}
            {data.cartProduct && data.cartProduct.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg mb-4 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Tổng đơn hàng</h3>
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Tạm tính:</span>
                  <span>{totalCost()}.000 VNĐ</span>
                </div>
                <div className="flex justify-between mb-4 text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{totalCost()}.000 VNĐ</span>
                  </div>
                </div>
              </div>
            )}

            {state.clientToken !== null ? (
              <Fragment>
                <div
                  onBlur={(e) => setState({ ...state, error: false })}
                  className="p-4 md:p-6 bg-white rounded-lg shadow"
                >
                  <h3 className="text-xl font-semibold mb-4">Thông tin giao hàng</h3>
                  
                  {state.error ? (
                    <div className="bg-red-200 py-2 px-4 rounded mb-4">
                      {state.error}
                    </div>
                  ) : (
                    ""
                  )}
                  
                  <div className="flex flex-col py-2">
                    <label htmlFor="address" className="pb-2 font-medium">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      value={state.address}
                      onChange={(e) =>
                        setState({
                          ...state,
                          address: e.target.value,
                          error: false,
                        })
                      }
                      type="text"
                      id="address"
                      className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập địa chỉ..."
                    />
                  </div>
                  
                  <div className="flex flex-col py-2 mb-4">
                    <label htmlFor="phone" className="pb-2 font-medium">
                      Số điện thoại
                    </label>
                    <input
                      value={state.phone}
                      onChange={(e) =>
                        setState({
                          ...state,
                          phone: e.target.value,
                          error: false,
                        })
                      }
                      type="number"
                      id="phone"
                      className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+84"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <DropIn
                      options={{
                        authorization: state.clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => (state.instance = instance)}
                    />
                  </div>
                  
                  <div
                    onClick={(e) =>
                      pay(
                        data,
                        dispatch,
                        state,
                        setState,
                        getPaymentProcess,
                        totalCost,
                        history
                      )
                    }
                    className="w-full px-4 py-3 text-center text-white font-semibold cursor-pointer rounded hover:opacity-90 transition-opacity"
                    style={{ background: "#303031" }}
                  >
                    Thanh toán ngay
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="flex items-center justify-center py-12">
                <svg
                  className="w-12 h-12 animate-spin text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products, dispatch }) => {
  const history = useHistory();
  
  // Kiểm tra products
  if (!products) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // Lấy giá từ localStorage (giá đã có offer)
  const getCartPrice = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(c => String(c.id) === String(productId));
    return item ? item.price : 0;
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Tìm sản phẩm theo id (chú ý: localStorage dùng "id", không phải "_id")
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
      // Cập nhật số lượng
      cart[productIndex].quantitiy = newQuantity;
      
      // Lưu lại localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Cập nhật lại products từ cart mới
      const updatedProducts = products.map(p => {
        const cartItem = cart.find(c => c.id === p._id);
        return cartItem ? { ...p, quantity: cartItem.quantitiy } : p;
      });
      
      // Dispatch để UI re-render
      dispatch({ type: "cartProduct", payload: updatedProducts });
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

  // Hàm xóa sản phẩm
  const removeProduct = (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Xóa sản phẩm khỏi cart
      cart = cart.filter(item => item.id !== productId);
      
      // Lưu lại localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Xóa sản phẩm khỏi products
      const updatedProducts = products.filter(p => p._id !== productId);
      
      // Dispatch để UI re-render
      dispatch({ type: "cartProduct", payload: updatedProducts });
    }
  };

  return (
    <Fragment>
      <div className="space-y-4">
        {products !== null && products.length > 0 ? (
          products.map((product, index) => {
            const currentQty = quantity(product._id);
            const productPrice = getCartPrice(product._id);
            const currentSubTotal = subTotal(product._id, productPrice);
            
            return (
              <div
                key={index}
                className="bg-white border rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                  {/* Hình ảnh và thông tin sản phẩm */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      onClick={(e) => history.push(`/products/${product._id}`)}
                      className="cursor-pointer h-24 w-24 object-cover object-center rounded border hover:opacity-80 transition-opacity"
                      src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                      alt={product.pName}
                    />
                    <div className="flex-1 min-w-0">
                      <div 
                        className="text-lg font-medium cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                        onClick={(e) => history.push(`/products/${product._id}`)}
                      >
                        {product.pName}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        Đơn giá: <span className="font-semibold">{getCartPrice(product._id)}.000 VNĐ</span>
                      </div>
                    </div>
                  </div>

                  {/* Điều chỉnh số lượng */}
                  <div className="flex items-center justify-between md:justify-end space-x-4 md:space-x-6">
                    {/* Nút điều chỉnh số lượng */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => decreaseQuantity(product._id)}
                        disabled={currentQty <= 1}
                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Giảm số lượng"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <input
                        type="number"
                        value={currentQty}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value);
                          if (!isNaN(newQty) && newQty >= 1) {
                            updateQuantity(product._id, newQty);
                          }
                        }}
                        className="w-14 text-center py-2 border-l border-r focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
                        min="1"
                      />
                      
                      <button
                        onClick={() => increaseQuantity(product._id)}
                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                        title="Tăng số lượng"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Tổng phụ */}
                    <div className="font-bold text-gray-800 min-w-max text-lg">
                      {currentSubTotal}.000 VNĐ
                    </div>

                    {/* Nút xóa */}
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Xóa sản phẩm"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              Giỏ hàng của bạn đang trống
            </p>
            <button
              onClick={() => history.push("/")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;