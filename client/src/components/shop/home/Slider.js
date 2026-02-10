import React, { Fragment, useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data?.sliderImages || data.sliderImages.length === 0) return;

    const interval = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 30);

    return () => clearInterval(interval);
  }, [data.sliderImages]);

  // Duplicate images for infinite scroll
  const infiniteImages = data?.sliderImages ? [...data.sliderImages, ...data.sliderImages, ...data.sliderImages] : [];

  return (
    <Fragment>
      {/* SLIDER SECTION */}
      <div className="mt-16 bg-gradient-to-b from-gray-50 to-white py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* MAIN SLIDER - Continuous Scroll */}
            <div className="md:col-span-8">
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white" style={{ height: '280px' }}>
                <div
                  className="flex h-full"
                  style={{ 
                    transform: `translateX(-${offset}px)`,
                    transition: 'none'
                  }}
                  onTransitionEnd={() => {
                    const imageWidth = 450;
                    const totalWidth = imageWidth * (data?.sliderImages?.length || 1);
                    if (offset >= totalWidth) {
                      setOffset(offset - totalWidth);
                    }
                  }}
                >
                  {infiniteImages.map((item, i) => {
                    const SlideWrapper = item.productId ? Link : 'div';
                    const wrapperProps = item.productId 
                      ? { to: `/products/${item.productId}` }
                      : {};
                    
                    return (
                      <SlideWrapper
                        key={i}
                        {...wrapperProps}
                        className="flex-shrink-0 h-full bg-white flex items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ width: '450px' }}
                      >
                        <img
                          src={`${apiURL}/uploads/customize/${item.slideImage}`}
                          alt="slide"
                          className="max-w-full max-h-full object-contain"
                        />
                      </SlideWrapper>
                    );
                  })}
                </div>

                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* SIDE BANNERS */}
            <div className="hidden md:flex md:col-span-4 flex-col gap-3">
              {data?.sliderImages?.slice(0, 2).map((item, i) => {
                const BannerWrapper = item.productId ? Link : 'div';
                const wrapperProps = item.productId 
                  ? { to: `/products/${item.productId}` }
                  : {};
                
                return (
                  <BannerWrapper
                    key={i}
                    {...wrapperProps}
                    className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer flex items-center justify-center p-3"
                    style={{ height: '136px' }}
                  >
                    <img
                      src={`${apiURL}/uploads/customize/${item.slideImage}`}
                      alt="banner"
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </BannerWrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <OrderSuccessMessage />
    </Fragment>
  );
};

export default Slider;