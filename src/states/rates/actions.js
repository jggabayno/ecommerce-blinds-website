import {
    GET_RATES_INFO_LOADING, GET_RATES_INFO_SUCCESS, GET_RATES_INFO_FAILURE,
    ADD_RATE_INFO_LOADING, ADD_RATE_INFO_SUCCESS, ADD_RATE_INFO_FAILURE
} from './types'

const getRateInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('rates')
    return await response.data
}

export const fetchRates = ()  => {
    return async dispatch => {
            dispatch(fetchRateInfoLoading());
        try {
            const cart = await getRateInfo();
            dispatch(fetchRateInfoSuccess(cart));
        } catch{
            dispatch(fetchRateInfoFailure());
        }
    }
}

export const fetchRateInfoLoading = () => ({type: GET_RATES_INFO_LOADING})
export const fetchRateInfoSuccess = (payload) => ({type: GET_RATES_INFO_SUCCESS, payload})
export const fetchRateInfoFailure = () => ({type: GET_RATES_INFO_FAILURE})


// CREATE
export const addRate = (rates, { message, setRateConfig}) => {
    return async dispatch => {
        dispatch(addRateInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('rates', {data: rates})
            const data = await response.data
            dispatch(addRateInfoSuccess(data))
            message.success('You have successfully rate the item')
            setRateConfig({isVisible: false, data: {}})
        } catch (error) {

            dispatch(addRateInfoFailure());

        }
    }
}

export const addRateInfoLoading = () => ({type: ADD_RATE_INFO_LOADING})
export const addRateInfoSuccess = (payload) => ({type: ADD_RATE_INFO_SUCCESS, payload})
export const addRateInfoFailure = () => ({type: ADD_RATE_INFO_FAILURE})