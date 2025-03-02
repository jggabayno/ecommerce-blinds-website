import {GET_PRODUCT_INFO_LOADING, GET_PRODUCT_INFO_SUCCESS, GET_PRODUCT_INFO_FAILURE} from './types'

export const fetchProduct = async(id, setProduct) => {
    setProduct({isLoading: true, data: {}})
    try {
        const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`productwithcolors/${id}`)
        const data =  await response.data
        if(data) setProduct({isLoading: false, data})
    } catch(error) {
        setProduct({isLoading: false, data: {}})
    }
}


const getProductInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('productswithcolors')
    return await response.data
}

export const fetchProducts = ()  => {
    return async dispatch => {
            dispatch(fetchProductInfoLoading());
        try {
            const product = await getProductInfo();
            dispatch(fetchProductInfoSuccess(product));
        } catch{
            dispatch(fetchProductInfoFailure());
        }
    }
}

export const fetchProductInfoLoading = () => ({type: GET_PRODUCT_INFO_LOADING})
export const fetchProductInfoSuccess = (ProductInfo) => ({type: GET_PRODUCT_INFO_SUCCESS, payload: ProductInfo})
export const fetchProductInfoFailure = () => ({type: GET_PRODUCT_INFO_FAILURE})