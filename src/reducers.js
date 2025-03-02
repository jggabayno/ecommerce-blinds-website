import { combineReducers } from 'redux'

import auth from './states/auth/reducer'
import profile from './states/profile/reducer'
import products from './states/products/reducer'
import cart from './states/cart/reducer'
import checkout from './states/checkout/reducer'
import orders from './states/orders/reducer'
import notifications from './states/notifications/reducer'
import rates from './states/rates/reducer'
import orderCancellations from './states/orderCancellations/reducer'

const reducers = combineReducers({auth, profile, products, cart, checkout, orders, notifications, rates, orderCancellations})

export default reducers