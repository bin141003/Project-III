import React, { Fragment, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Alert, reviewSubmitHanlder } from "./Action";
import { LayoutContext } from "../layout";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const ReviewForm = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  let { id } = useParams();

  const [fData, setFdata] = useState({
    rating: "",
    review: "",
    error: false,
    success: false,
    pId: id,
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  if (fData.error || fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, error: false, success: false });
    }, 3000);
  }

  const fetchData = async () => {
    try {
      let responseData = await getSingleProduct(id);
      if (responseData.Product) {
        dispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
      }
      if (responseData.error) {
        console.log(responseData.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ratingUserList = data.singleProductDetail.pRatingsReviews.map(
    (item) => {
      return item.user ? item.user._id : "";
    }
  );

  const hasReviewed = ratingUserList.includes(isAuthenticate().user._id);

  return (
    <Fragment>
      {/* Alert Messages */}
      {(fData.error || fData.success) && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4">
          {fData.error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium">{fData.error}</p>
            </div>
          )}
          {fData.success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p className="font-medium">{fData.success}</p>
            </div>
          )}
        </div>
      )}

      {!hasReviewed && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Viết đánh giá của bạn</h3>
              <p className="text-sm text-gray-500">Chia sẻ trải nghiệm của bạn về sản phẩm này</p>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá của bạn <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFdata({ ...fData, rating: star })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || fData.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                      fill={star <= (hoveredRating || fData.rating) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
                {fData.rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {fData.rating === 5 && 'Tuyệt vời'}
                    {fData.rating === 4 && 'Rất tốt'}
                    {fData.rating === 3 && 'Bình thường'}
                    {fData.rating === 2 && 'Tệ'}
                    {fData.rating === 1 && 'Rất tệ'}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung đánh giá <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review"
                value={fData.review}
                onChange={(e) => setFdata({ ...fData, review: e.target.value })}
                rows={5}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                {fData.review.length}/500 ký tự
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={(e) => reviewSubmitHanlder(fData, setFdata, fetchData)}
                disabled={!fData.rating || !fData.review.trim()}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {hasReviewed && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-700 font-medium">Bạn đã đánh giá sản phẩm này rồi</p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ReviewForm;