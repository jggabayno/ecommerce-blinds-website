import { GET_CART_INFO_LOADING, GET_CART_INFO_SUCCESS, GET_CART_INFO_FAILURE,
    ADD_CART_INFO_LOADING, ADD_CART_INFO_SUCCESS, ADD_CART_INFO_FAILURE,
    UPDATE_CART_INFO_LOADING, UPDATE_CART_INFO_SUCCESS, UPDATE_CART_INFO_FAILURE,
    DELETE_CART_INFO_LOADING, DELETE_CART_INFO_SUCCESS, DELETE_CART_INFO_FAILURE
} from './types'

const getCartInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('cart')
    return await response.data
}

export const fetchCart = ()  => {
    return async dispatch => {
            dispatch(fetchCartInfoLoading());
        try {
            const cart = await getCartInfo();
            dispatch(fetchCartInfoSuccess(cart));
        } catch{
            dispatch(fetchCartInfoFailure());
        }
    }
}

export const fetchCartInfoLoading = () => ({type: GET_CART_INFO_LOADING})
export const fetchCartInfoSuccess = (payload) => ({type: GET_CART_INFO_SUCCESS, payload})
export const fetchCartInfoFailure = () => ({type: GET_CART_INFO_FAILURE})


// CREATE
export const addToCart = (cart, { message,  addProductSize, sizeValues}) => {
    return async dispatch => {
        dispatch(addCartInfoLoading());

        try {
            const addedSizeOrNot = cart.size_id === 999999 ? await addProductSize(sizeValues) : ''

            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('cart', {...cart, size_id: cart.size_id === 999999 ? addedSizeOrNot?.id : cart.size_id})
            const data = await response.data
 
            if(data) Promise.all([
                dispatch(addCartInfoSuccess(data)),
                message.success('Item has been added to your shopping cart'),
                addedSizeOrNot
            ])

        } catch (error) {

            dispatch(addCartInfoFailure());

        }
    }
}

export const addCartInfoLoading = () => ({type: ADD_CART_INFO_LOADING})
export const addCartInfoSuccess = (payload) => ({type: ADD_CART_INFO_SUCCESS, payload})
export const addCartInfoFailure = () => ({type: ADD_CART_INFO_FAILURE})


// UPDATE
export const updateCart = (cartData, {selectedCart, setTotal}) => {
    return async dispatch => {
        // dispatch(updateCartInfoLoading());

        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`cart/${cartData.id}`, cartData)
            const data = await response.data

            if(data) {
                Promise.all([
                dispatch(updateCartInfoSuccess(cartData)),
                setTotal([...selectedCart
                .filter(f => f.id !== cartData.id), ...selectedCart
                .filter(f => f.id === cartData.id)
                .map(row => ({...row, quantity: cartData.quantity }))]
                .map(m => m.price * m.quantity)
                .reduce((a, c) => a + c, 0))
                ])
            }

        } catch (error) {
            
            dispatch(updateCartInfoFailure());

        }
    }
}

export const updateCartInfoLoading = () => ({type: UPDATE_CART_INFO_LOADING})
export const updateCartInfoSuccess = (payload) => ({type: UPDATE_CART_INFO_SUCCESS, payload})
export const updateCartInfoFailure = () => ({type: UPDATE_CART_INFO_FAILURE })


// DELETE
export const deleteCart = (objectArrayIds,{ message,selectedCart, setSelectedCart, setTotal })  => {
    return async dispatch => {
        dispatch(deleteCartInfoLoading());

        try {

           await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).dropWithBody(`cart/`, objectArrayIds)

           const amountRemoveTotal = selectedCart.filter(row => objectArrayIds.ids.includes(row.id))
           .map(row => row.price * row.quantity).reduce((acc, cur) => acc + cur, 0)
       
            Promise.all([
                dispatch(deleteCartInfoSuccess(objectArrayIds.ids)),
                setSelectedCart([]),
                setTotal(prevTotal => prevTotal - amountRemoveTotal),
                message.warning(`Cart ${objectArrayIds.ids.length > 1 ? 'Items' : 'Item' } deleted successfully!`),
            ])

        } catch (error) {
            dispatch(deleteCartInfoFailure());
        }
    }
}

export const deleteCartInfoLoading = () => ({type: DELETE_CART_INFO_LOADING})
export const deleteCartInfoSuccess = (payload) => ({type: DELETE_CART_INFO_SUCCESS, payload})
export const deleteCartInfoFailure = () => ({type: DELETE_CART_INFO_FAILURE})