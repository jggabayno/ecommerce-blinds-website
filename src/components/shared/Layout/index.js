import Header from "./Header"
// import Drawer from "./Drawer"
// import Footer from "./Footer"

export default function Layout({auth, screens, routes, children}) {
    return (
        <div className='layout'>
            <Header auth={auth} screens={screens}/>
            {/* {screens.xs && <Drawer auth={auth} routes={routes}/>} */}
            {children}
            {/* <Footer/> */}
        </div>
    )
} 