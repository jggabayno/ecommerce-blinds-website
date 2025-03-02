import { GET_ORDERS_INFO_LOADING, GET_ORDERS_INFO_SUCCESS, GET_ORDERS_INFO_FAILURE,
    ADD_ORDER_INFO_LOADING, ADD_ORDER_INFO_SUCCESS, ADD_ORDER_INFO_FAILURE,
} from './types'

const getOrdersInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('ownorders')
    return await response.data
}

export const getOwnOrders = ()  => {
    return async dispatch => {
           dispatch(fetchOrderInfoLoading());
        try {
            const order = await getOrdersInfo();
            dispatch(fetchOrderInfoSuccess(order));
           
        } catch{
            dispatch(fetchOrderInfoFailure());
        }
    }
}

export const fetchOrderInfoLoading = () => ({type: GET_ORDERS_INFO_LOADING})
export const fetchOrderInfoSuccess = (payload) => ({type: GET_ORDERS_INFO_SUCCESS, payload})
export const fetchOrderInfoFailure = () => ({type: GET_ORDERS_INFO_FAILURE})

// CREATE
export const addToMyPurchase = (order, { navigate, message, deleteCartInfoSuccess}) => {
    return async dispatch => {
        dispatch(addOrderInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('orders', order)
            const data = await response.data
            
            if (data) {
                Promise.all([
                    dispatch(addOrderInfoSuccess(data)),
                    dispatch(deleteCartInfoSuccess(data.map(row => row.cart_id))),
                    message.success('Added to your purchase'),
                    navigate('/my-purchase')
                ])
            }

        } catch (error) {

            dispatch(addOrderInfoFailure());

        }
    }
}

export const addOrderInfoLoading = () => ({type: ADD_ORDER_INFO_LOADING})
export const addOrderInfoSuccess = (payload) => ({type: ADD_ORDER_INFO_SUCCESS, payload})
export const addOrderInfoFailure = () => ({type: ADD_ORDER_INFO_FAILURE})