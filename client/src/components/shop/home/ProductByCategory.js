import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Layout from "../layout";
import { productByCategory } from "../../admin/products/FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const Submenu = ({ category }) => {
  const history = useHistory();
  return (
    <Fragment>
      {/* Submenu Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-20 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-sm flex items-center space-x-2">
            <span
              className="hover:text-yellow-700 cursor-pointer"
              onClick={(e) => history.push("/")}
            >
              Trang chủ
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-yellow-700 font-medium">{category}</span>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const AllProduct = ({ products }) => {
  const history = useHistory();
  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );
  
  const category =
    products && products.length > 0 ? products[0].pCategory.cName : "";

  const isWish = (productId) => {
    if (!wList) return false;
    return wList.some(item => item === productId);
  };

  const toggleWish = (e, productId) => {
    e.stopPropagation();
    let newWishList = wList ? [...wList] : [];
    
    if (isWish(productId)) {
      newWishList = newWishList.filter(id => id !== productId);
    } else {
      newWishList.push(productId);
    }
    
    localStorage.setItem("wishList", JSON.stringify(newWishList));
    setWlist(newWishList);
  };

  return (
    <Fragment>
      <Submenu category={category} />
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-8 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {products && products.length > 0 ? (
          products.map((item, index) => {
            const hasOffer = item.pOffer && Number(item.pOffer) > 0;
            const finalPrice = hasOffer
              ? Math.round(item.pPrice - (item.pPrice * item.pOffer) / 100)
              : item.pPrice;

            return (
              <div key={index} className="relative col-span-1 p-1">
                {/* Card container */}
                <div className="flex flex-col h-full bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  
                  {/* IMAGE */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-t-md cursor-pointer bg-gray-50">
                    <img
                      onClick={(e) => history.push(`/products/${item._id}`)}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                      alt={item.pName}
                    />

                    {/* OFFER BADGE */}
                    {hasOffer && (
                      <div className="absolute top-1 left-1 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                        -{item.pOffer}%
                      </div>
                    )}

                    {/* WISHLIST */}
                    <div className="absolute top-1 right-1">
                      <svg
                        onClick={(e) => toggleWish(e, item._id)}
                        className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer drop-shadow-md ${
                          isWish(item._id) ? 'fill-yellow-700 text-yellow-700' : 'text-yellow-700'
                        }`}
                        fill={isWish(item._id) ? "currentColor" : "none"}
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
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="flex-1 p-2 flex flex-col justify-between">
                    {/* Product Name */}
                    <h3 
                      className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-gray-600"
                      onClick={() => history.push(`/products/${item._id}`)}
                    >
                      {item.pName}
                    </h3>

                    {/* PRICE và Rating */}
                    <div className="flex items-end justify-between gap-1">
                      <div className="flex flex-col">
                        {hasOffer && (
                          <span className="text-xs line-through text-gray-400">
                            {item.pPrice}k
                          </span>
                        )}
                        <span className="text-sm font-bold text-red-600">
                          {finalPrice}.000đ
                        </span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className="text-xs text-gray-600">
                          {item.pRatings ? item.pRatings.length : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 md:col-span-4 lg:col-span-5 flex items-center justify-center py-24 text-xl text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        )}
      </section>
    </Fragment>
  );
};

const PageComponent = () => {
  const [products, setProducts] = useState(null);
  const { catId } = useParams();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await productByCategory(catId);
      if (responseData && responseData.Products) {
        setProducts(responseData.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <AllProduct products={products} />
    </Fragment>
  );
};

const ProductByCategory = (props) => {
  return (
    <Fragment>
      <Layout children={<PageComponent />} />
    </Fragment>
  );
};

export default ProductByCategory;