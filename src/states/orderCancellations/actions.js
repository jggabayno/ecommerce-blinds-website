import { 
    GET_ORDER_CANCELLATIONS_INFO_LOADING, GET_ORDER_CANCELLATIONS_INFO_SUCCESS, GET_ORDER_CANCELLATIONS_INFO_FAILURE,
    ADD_ORDER_CANCELLATIONS_INFO_LOADING, ADD_ORDER_CANCELLATIONS_INFO_SUCCESS, ADD_ORDER_CANCELLATIONS_INFO_FAILURE
 } from './types'

import { getOwnOrders } from '../orders/actions'


const getOrderCancellationsInfo = async(order_id) => {

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`order-cancellations/${order_id}`)
    return await response.data
}

export const fetchOrderCancellations = (order_id)  => {
    return async dispatch => {
            dispatch(fetchOrderCancellationsInfoLoading());
        try {
            const info = await getOrderCancellationsInfo(order_id);
            dispatch(fetchOrderCancellationsInfoSuccess(info));
        } catch{
            dispatch(fetchOrderCancellationsInfoFailure());
        }
    }
}

export const fetchOrderCancellationsInfoLoading = () => ({type: GET_ORDER_CANCELLATIONS_INFO_LOADING})
export const fetchOrderCancellationsInfoSuccess = (payload) => ({type: GET_ORDER_CANCELLATIONS_INFO_SUCCESS, payload })
export const fetchOrderCancellationsInfoFailure = () => ({type: GET_ORDER_CANCELLATIONS_INFO_FAILURE})

// CREATE
export const addOrderCancellations = (orderCancellation, { message, form, setIsCancelModalVisible }) => {
    return async dispatch => {
        dispatch(addOrderCancellationsInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('order-cancellations', orderCancellation)
            const data = await response.data
 
            Promise.all([
                dispatch(addOrderCancellationsInfoSuccess(data)),
                dispatch(getOwnOrders()),
                message.success(`Your order cancellation requested successfully!`),
                form.resetFields(),
                setIsCancelModalVisible(false)
            ])

        } catch (error) {

            dispatch(addOrderCancellationsInfoFailure());

        }
    }
}

export const addOrderCancellationsInfoLoading = () => ({type: ADD_ORDER_CANCELLATIONS_INFO_LOADING})
export const addOrderCancellationsInfoSuccess = (payload) => ({type: ADD_ORDER_CANCELLATIONS_INFO_SUCCESS, payload})
export const addOrderCancellationsInfoFailure = () => ({type: ADD_ORDER_CANCELLATIONS_INFO_FAILURE})