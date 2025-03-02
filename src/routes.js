import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

import Cart from './components/Cart'
import Checkout from './components/Checkout'
import MyPurchase from './components/MyPurchase'

import Notifications from './components/Notifications'
import Profile from './components/Profile'
import ProductView from './components/Home/ProductView'

export default function useRoutes({auth}) {
 
    const notFoundRoute = { path: "*", element: <>Not Found</> }

    const privateRoute = auth.isLoggedIn ?
        [
        {slug: 'Cart', path: "/cart", element: <Cart/> },
        {slug: 'Checkout', path: "/checkout/:checkout_no", element: <Checkout/> },
        {slug: 'MyPurchase', path: "/my-purchase", element: <MyPurchase/> },
        {slug: 'MyPurchase', path: "/my-purchase/:order_no", element: <MyPurchase/> },

        {slug: 'Notifications', path: "/notifications", element: <Notifications/> },
        {slug: 'Profile', path: "/account/profile", element: <Profile/> }
        ] : []

    const routes = [
        {slug: 'Login', path: "/login", element: <Login/> },
        {slug: 'Sign Up', path: "/signup", element: <SignUp/> },
        {slug: 'Home', path: "/", element: <Home/> },
        {slug: 'Product View', path: "/product/:id", element: <ProductView/>},
        {slug: 'Forgot Password', path: "/forgot-password", element: <ForgotPassword/>},
        {slug: 'Reset Password', path: "/reset-password/:user_id/:sent_time", element: <ResetPassword/>},

        ...privateRoute,
        notFoundRoute
    ] 
    
    return auth.isLoggedIn ? routes.filter(route => !['/login', '/signup'].includes(route.path)) : routes 
}