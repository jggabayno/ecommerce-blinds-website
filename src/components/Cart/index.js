import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import QtyInput from '../shared/QtyInput'
import Button from '../shared/Button'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import './index.scss'
import { updateCart, deleteCart} from '../../states/cart/actions'
import { addToCheckout } from '../../states/checkout/actions'

import Image from 'antd/lib/image'

import { useNavigate } from 'react-router-dom'

export default function Cart(){

    const navigate = useNavigate()
    const dispatch = useDispatch()
 
    const {isLoading, data: cart} = useSelector(state => state.cart)

    const dataSource = () => cart

    const cartItemsCount = Boolean(cart.length)
 
    const [selectedCart, setSelectedCart] = useState([])

    const [total,setTotal] = useState(0)

    function onSelectCartChange(_,cart) {
     setSelectedCart(cart)
     setTotal(cart.map(cart => cart.price * cart.quantity).reduce((acc, cur) => acc + cur, 0))
    }
       
    function onDelete(id, hasMessage = false) {
      const isIdBySelectedCart = !id
      const ids = isIdBySelectedCart ? selectedCart.map((cart) => cart.id) : [id] 

      dispatch(
        deleteCart(
          {ids},
          { message: hasMessage ? message : {warning: () => null}, selectedCart, setSelectedCart, setTotal}
        )
      )
    }
    
    const rowSelection = {
      onChange: onSelectCartChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_NONE
      ]
    };

    function RenderQtyInput({cart}) {

        const [inputValue, setInputValue] = useState(Number(cart.quantity))
 
        function onUpdateCart(quantity) {
          const params = {...cart, quantity: Number(quantity)}
          dispatch(updateCart(params, {selectedCart, setTotal}))
        }
  
        return <QtyInput callback={onUpdateCart} qtyState={[inputValue, setInputValue]} />
    }

    const columns = [
    {
    title: 'Product',
    dataIndex: 'name',
    render: (text, record) => {

      const photo = (process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + record?.color?.photo)
 
      return (
        <div className='cart-product-column-detail'>
        <Image
          className='product-img-wrapper'
          src={photo || 'error'}
          preview={false}
          fallback="data:image/png;base64,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"
        />
        <h2>{record.product.name}</h2> 
        <div>
          
          <h4>Variations</h4>
          <span>{record.color?.name} - {record.size?.name} - {record?.ctrl === 'r' ? 'Right' : 'Left'}</span>
        </div>                 
      </div>
      )
    }
  
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      render:(price) => <div>&#8369; {price.toLocaleString()}</div>
      },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, cart) => <RenderQtyInput cart={cart}/>
      },
      {
      title: 'Total Price',
      render:(_,{quantity, price}) => <div>&#8369; {(price * quantity).toLocaleString()}</div>
      },
      {
      title: 'Actions',
      dataIndex: 'id',
      render: (id) => <Button size="small" onClick={() => onDelete(id, true)} type="link">Delete</Button> 
      }
    ]

    function onCheckout() {

      const params = {selected_cart_items: cart.filter(row => selectedCart
        .map(sc => sc.id).includes(row.id)).map(row => ({...row}))}

        dispatch(addToCheckout(params, {navigate, message}))
    }

    return (
        <main className='cart'>
            <div>
                <h1 className='title'>My Cart</h1>
                <Table rowKey="id"
                   rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={dataSource()}
                  pagination={false}
                  loading={isLoading}
                />
            </div>
            {cartItemsCount && 
            <section className='sticky'>
                  <div className='flex-between-center-1'>
                    <div>Selected ({`${selectedCart.length} ${selectedCart.length > 1 ? 'items' : 'item'}`})</div>
                    <Button onClick={() => onDelete()} disabled={!selectedCart.length}>Delete</Button>
                  </div>
                  <div className='flex-between-center-1'>
                    <div>Total: &#8369; {total.toLocaleString()}</div>
                    <Button onClick={onCheckout} type='primary' className='btn-checkout' disabled={!selectedCart.length} loading={isLoading}>Checkout</Button>
                  </div> 
              </section>
            }

        </main>
    )
}