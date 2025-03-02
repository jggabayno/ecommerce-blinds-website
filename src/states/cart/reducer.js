    import { GET_CART_INFO_LOADING, GET_CART_INFO_SUCCESS, GET_CART_INFO_FAILURE,
        ADD_CART_INFO_LOADING, ADD_CART_INFO_SUCCESS, ADD_CART_INFO_FAILURE,
        UPDATE_CART_INFO_LOADING, UPDATE_CART_INFO_SUCCESS, UPDATE_CART_INFO_FAILURE,
        DELETE_CART_INFO_LOADING, DELETE_CART_INFO_SUCCESS, DELETE_CART_INFO_FAILURE
    } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_CART_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_CART_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_CART_INFO_SUCCESS:
            return {...state,data: action.payload, isLoading: false, hasError: false};
        case ADD_CART_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_CART_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_CART_INFO_SUCCESS:

            const isCartAddedAlready = state.data.some(cart => cart.id === action.payload.id)
       
            const addUpdatedData = isCartAddedAlready 
            ? [action.payload, ...state.data.filter(cart => cart.id !== action.payload.id)]
            : [action.payload, ...state.data]

            return {...state, data: addUpdatedData, isLoading: false, hasError: false}
        case UPDATE_CART_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_CART_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_CART_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((user) => user.id !== action.payload.id)].sort((acc, cur) => acc.id - cur.id), isLoading: false, hasError: false};     
        case DELETE_CART_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case DELETE_CART_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case DELETE_CART_INFO_SUCCESS:

            const hasMany = Array.isArray(action.payload)

            const updatedData = state.data.filter((cart) => hasMany 
            ? (!action.payload.includes(cart.id))
            : (cart.id !== action.payload))

            return {...state, data: updatedData, isLoading: false, hasError: false};
        default:
            return state;
   }
}