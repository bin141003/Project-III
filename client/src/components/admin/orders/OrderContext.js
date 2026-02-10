export const orderState = {
  orders: [],
  allOrders: [], // Thêm để lưu bản gốc
  addCategoryModal: false,
  updateOrderModal: {
    modal: false,
    oId: null,
    status: "",
  },
  loading: false,
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    /* Get all orders */
    case "fetchOrderAndChangeState":
      return {
        ...state,
        orders: action.payload,
        allOrders: action.payload, // Lưu bản gốc để search
      };
    
    /* Search orders - thêm action mới */
    case "searchOrders":
      return {
        ...state,
        orders: action.payload,
      };
    
    /* Create a category */
    case "addCategoryModal":
      return {
        ...state,
        addCategoryModal: action.payload,
      };
    
    /* Edit a category */
    case "updateOrderModalOpen":
      return {
        ...state,
        updateOrderModal: {
          modal: true,
          oId: action.oId,
          status: action.status,
        },
      };
    
    case "updateOrderModalClose":
      return {
        ...state,
        updateOrderModal: {
          modal: false,
          oId: null,
          status: "",
        },
      };
    
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    
    default:
      return state;
  }
};