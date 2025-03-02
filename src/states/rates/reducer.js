import {
    GET_RATES_INFO_LOADING, GET_RATES_INFO_SUCCESS, GET_RATES_INFO_FAILURE,
    ADD_RATE_INFO_LOADING, ADD_RATE_INFO_SUCCESS, ADD_RATE_INFO_FAILURE
} from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_RATES_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_RATES_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_RATES_INFO_SUCCESS:
            return {...state,data: action.payload, isLoading: false, hasError: false};
        case ADD_RATE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_RATE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_RATE_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false}
        default:
            return state;
   }
}