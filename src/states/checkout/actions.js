import { GET_CHECKOUT_INFO_LOADING, GET_CHECKOUT_INFO_SUCCESS, GET_CHECKOUT_INFO_FAILURE,
    ADD_CHECKOUT_INFO_LOADING, ADD_CHECKOUT_INFO_SUCCESS, ADD_CHECKOUT_INFO_FAILURE,
} from './types'

const getCheckoutInfo = async(checkoutNo) => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`checkout/${checkoutNo}`)
    return await response.data
}

export const getCheckoutByOrderNumber = (checkoutNo, navigate)  => {
    return async dispatch => {
            dispatch(fetchCheckoutInfoLoading());
        try {
            const checkout = await getCheckoutInfo(checkoutNo);

            if (checkout.length) {
                dispatch(fetchCheckoutInfoSuccess(checkout));
            } else {
                navigate('/')
            }
           
        } catch{
            dispatch(fetchCheckoutInfoFailure());
        }
    }
}

export const fetchCheckoutInfoLoading = () => ({type: GET_CHECKOUT_INFO_LOADING})
export const fetchCheckoutInfoSuccess = (payload) => ({type: GET_CHECKOUT_INFO_SUCCESS, payload})
export const fetchCheckoutInfoFailure = () => ({type: GET_CHECKOUT_INFO_FAILURE})

// CREATE
export const addToCheckout = (checkout, { navigate, message}) => {
    return async dispatch => {
        dispatch(addCheckoutInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('checkouts', checkout)
            const data = await response.data
            
            if(data)   navigate(`/checkout/${data}`)
            
            // Promise.all([
            //     // dispatch(addCheckoutInfoSuccess(data)),
            // ])

        } catch (error) {

            dispatch(addCheckoutInfoFailure());

        }
    }
}

export const addCheckoutInfoLoading = () => ({type: ADD_CHECKOUT_INFO_LOADING})
export const addCheckoutInfoSuccess = (payload) => ({type: ADD_CHECKOUT_INFO_SUCCESS, payload})
export const addCheckoutInfoFailure = () => ({type: ADD_CHECKOUT_INFO_FAILURE})