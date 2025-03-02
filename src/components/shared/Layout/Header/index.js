import {NavLink} from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Badge from 'antd/lib/badge'
import './index.scss'
import { logout } from '../../../../states/auth/actions'
import { fetchCart } from '../../../../states/cart/actions'
import { useNavigate } from "react-router-dom"
import { BiChevronDown } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgShoppingCart } from "react-icons/cg";
import { useEffect } from "react"
import { fetchNotifications, updateNotification } from '../../../../states/notifications/actions'
import moment from 'moment';
import Avatar from 'antd/lib/avatar'
import { fetchProfile } from '../../../../states/profile/actions'

function UserDropdown(props){
  const {navigate, onLogout, name} = props

  return (
    <Dropdown
            overlay={(
              <Menu>
                <Menu.Item key='profile' onClick={() => navigate('/account/profile')}>My Account</Menu.Item>
                <Menu.Item key='my-purchase' onClick={() => navigate('/my-purchase')}>My Purchase</Menu.Item>
                <Menu.Item key='logout' onClick={onLogout}>Logout</Menu.Item>
            </Menu>
            )}
            trigger={['click']}
          >
          <span onClick={e => e.preventDefault()} className='user-x-downicon'>
            <span>{name}</span>
            <BiChevronDown/>
          </span>
        </Dropdown>
  )
}

export default function Header({auth, screens}) {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onLogout = async() => dispatch(logout(navigate))


    const {data: cart} = useSelector(state => state.cart)

    useEffect(() => {
      if (auth.isLoggedIn) dispatch(fetchCart())
      
    }, [dispatch, auth.isLoggedIn])
    
    const cartCount = cart.length ? (auth.isLoggedIn ? cart.length : '') : ''

    const {isLoading, data: notifications} = useSelector(state => state.notifications)

    useEffect(() => {if(auth.isLoggedIn && window.location.pathname) dispatch(fetchNotifications())}, [dispatch, auth.isLoggedIn, window.location.pathname])
    
    const notificationsCount = notifications.length ? (auth.isLoggedIn ? notifications.filter(notification => notification.is_read === 0 && notification.is_seen === 0
      ).length : '') : ''

    function onReadNotification(notification){
      dispatch(updateNotification({id: notification.id, is_seen: true,is_read: true}))
      navigate(`/my-purchase/${notification?.physical_number}`)
    }

    const profile = useSelector(state => state.profile)
    useEffect(() => {auth.isLoggedIn && dispatch(fetchProfile())},[dispatch, auth.isLoggedIn])
  
    return (
        <header>
        <NavLink to='/' className='logo'></NavLink>
        <nav>
          {auth.isLoggedIn && 
          <Badge className="notif-badge" count={notificationsCount}>
            
          <Dropdown
          placement="bottomRight"
          overlay={(
          <Menu>
          {notifications.sort((a,c) => a.created_at - c.created_at).slice(0,3).map(notification => (
          <Menu.Item
          key={notification.physical_number} 
          style={notification.is_read ? {} : {background: '#f1f1f1'}}
          onClick={() => onReadNotification(notification)}
          className='header-menu-item-notif'
          >
          <div className='header-menu-item-notif-container'>
          <h4>{notification?.title}</h4>
          <p>{notification?.content?.length > 50 ? `${notification?.content.slice(0, 50)}...` : notification?.content}</p>
          <span>{moment(notification?.created_at).fromNow()}</span>
          </div>
          </Menu.Item>
          ))}
          {notifications.length ?   <Menu.Item key='all' onClick={() => navigate('/notifications')}>View All</Menu.Item> :
                    <Menu.Item key='no-notif' className="h-no-notif"> No Notification</Menu.Item>

          }
          </Menu>
          )}
          // trigger={['click']}
          >
          <span className="notif-text-icon">
          <IoIosNotificationsOutline/> <span>Notifications</span>
          </span>
          </Dropdown>
          </Badge>}
        <NavLink to={auth.isLoggedIn ? '/cart' : '/login'}
        className={`${auth.isLoggedIn ? 'cart-wa' : 'cart-woa'}`}> <Badge className='cart-badge' count={cartCount}><CgShoppingCart/></Badge></NavLink>
        {!auth.isLoggedIn && 
        <span className="suxl">
        <NavLink to='/signup'>Sign Up</NavLink>
        <NavLink to='/login'>Login</NavLink>
        </span>
        } 
        {auth.isLoggedIn && 
        <span className="user"><Avatar size={30} src={
          profile?.data?.photo ? 
          process.env.REACT_APP_API_USER_PHOTO + profile?.data?.photo : `https://ui-avatars.com/api/?name=${profile?.data?.user_name ? profile?.data?.user_name : profile?.data?.first_name}`
          } />
                   <UserDropdown navigate={navigate} onLogout={onLogout} name={profile?.data?.user_name ? profile?.data?.user_name : profile?.data?.first_name }/></span>
        } 
        </nav>
      </header> 
    )
}