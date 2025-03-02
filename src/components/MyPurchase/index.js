import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { getOwnOrders} from '../../states/orders/actions'
import { useNavigate, useParams } from 'react-router-dom'
import Tabs from 'antd/lib/tabs'
import List from 'antd/lib/list'
import Steps from 'antd/lib/steps'
import Skeleton from 'antd/lib/skeleton'
import Card from 'antd/lib/card'
import Avatar from 'antd/lib/avatar'
import Descriptions from 'antd/lib/descriptions'
import Button from '../shared/Button'
import Modal from 'antd/lib/modal'
import Rate from 'antd/lib/rate'
import Form from 'antd/lib/form'

import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'

import Checkbox from 'antd/lib/checkbox'
import Input from '../shared/Input'
import moment from 'moment'
import './index.scss'
import helpers from '../../services/helpers'
import message from 'antd/lib/message'
import {addRate} from '../../states/rates/actions'
import { fetchOrderCancellations, addOrderCancellations } from '../../states/orderCancellations/actions'
export default function MyPurchase(){

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const {isLoading, data: orders} = useSelector(state => state.orders)
    useEffect(() => {dispatch(getOwnOrders())}, [])

    const selectedOrder = orders.find(order => order.order_no === params?.order_no)

    const ORDER_STATUSES = [
      {
        id: 1,
        name: 'Order Submitted'
      },
      {
        id: 2,
        name: 'Order Placed'
      },
      {
        id: 3,
        name: 'Processing'
      },
      {
        id: 4,
        name: 'For Delivery'
      },
      {
        id: 5,
        // for customer the delivered is mark as completed
        // hence the original meaning in order status of completed is the payment has been turnover to store
        name: 'Delivered'
      },
      {
        id: 6,
        name: 'Completed'
      },
      {
        id: 7,
        name: 'Cancelled'
      }
    ]

    const ordersByStatus = ORDER_STATUSES.map(status => ({ ...status,
      orders: orders.filter(order => order.order_status_id === status.id)}))

 
    const ordersByStatusWithALL = [{id: 0, name: 'All', orders},...ordersByStatus]

    const hasOrderNoParams = params.hasOwnProperty('order_no')

    const onChangeOrderStatus = (status) => console.log('status', status)

    // start for has order params
    
      const latestOrderStatus = selectedOrder?.order_status_histories?.slice(-1)?.pop()

      const orderStatusWithDate = ORDER_STATUSES.map(status => ({
        ...status,
        date: (selectedOrder?.order_status_histories?.find(osh => osh?.order_status_id === status.id)?.created_at)
      }))

      const latestDeliveryAddress = selectedOrder?.billings?.slice(-1)?.pop()

      const payments = (selectedOrder?.payments?.map(payment => payment?.amount).reduce((acc,cur) => acc + cur, 0))
      const paymentsWithShippingFee = payments + selectedOrder?.shipping_fee
      const hasBalance = paymentsWithShippingFee  !== selectedOrder?.total_price
 
      // end for has order params

      function OrderList({order}){
        return (
          <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={order?.order_items}
          renderItem={orderItem => (
          <List.Item onClick={() => navigate(`/my-purchase/${orderItem?.order?.order_no}`)} className='order-item'>
          <Skeleton avatar title={true} loading={isLoading} active>
          <List.Item.Meta 
          avatar={<Avatar size={70} src={(process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + orderItem?.color?.photo)} shape='square' />}
          title={<>{orderItem?.product_name} {orderItem?.product?.brand?.name}</>}
          description={<div>
          <div>Variation: {`${orderItem?.color_name} ${orderItem?.size_name} ${orderItem?.ctrl === 'r' ? 'Right' : 'Left'}`} </div>
          <div>x{orderItem?.quantity}</div>
          </div>}
          />
          <div>&#8369; {orderItem?.unit_price.toLocaleString()}</div>
          </Skeleton>
          </List.Item>
          )}
          />
        )
      
      }

      const [rateConfig, setRateConfig] = useState({
        isVisible: false,
        data: {}
      })

      function openModalRate(data) {
        setRateConfig(prev => ({isVisible: !prev.isVisible, data}))
      }

     
    const [form] = Form.useForm()

    const uniqueEntries = helpers?.uniqueEntriesByObject(rateConfig?.data?.order_items, 'product_id')
    const matchedEntries = uniqueEntries?.map(row => {
      const filtered = rateConfig?.data?.order_items.filter(item => item.product_id === row.product_id)
     
        return {
          product_id: filtered[0]?.product_id,
          order_id: filtered[0]?.order_id,
          user_name: rateConfig?.data?.consumer?.user_name ?
          rateConfig?.data?.consumer?.user_name : rateConfig?.data?.consumer?.first_name,
          product_and_brand_name: `${filtered[0]?.product_name} ${filtered[0]?.product?.brand?.name}`,
          product_photo: filtered[0]?.product?.photo,
          product_variations: filtered.map(row => `${row.color_name} ${row.size_name}`).toString(),
        }
    })


    const [isHideName, setIsHideName] = useState({})

    function transformUserName(isAnonymous, userName){
      const getFirstLetter = userName?.slice(0,1)
      const getLastLetter = userName?.slice(-1)
      const constructedName = `${getFirstLetter}${userName?.substring(2).split('').map(row => `*`)?.toString()?.replaceAll(',','')}${getLastLetter}`
      return isAnonymous ? constructedName : userName
    }

    function onChangeIsAnonymousName(e, product_id){
      setIsHideName(prev => ({...prev, [`is_anonymous-${product_id}`]: e.target.checked}))
    }


    useEffect(() => {

      dispatch(fetchOrderCancellations(selectedOrder?.id))

    },[dispatch, selectedOrder])
    const {isLoading: isOrderCancellationLoading ,data: orderCancellation} = useSelector(state => state.orderCancellations)

  const hasOrderCancellationRequest = orderCancellation?.length > 0
 
    function onSubmitRate(values) {
        delete values.reason 
        
        const params = Object.values(values).sort((a,c) => a.id - c.id).map(row => {
   
          return {
            order_id: matchedEntries?.find(f => f?.product_id === row.id)?.order_id,
            prefer_consumer_name: transformUserName(row[`is_anonymous-${row.id}`],matchedEntries?.[0]?.user_name),
            product_id: row.id,
            count: row[`count-${row.id}`],
            message: row[`message-${row.id}`],
            product_variants: matchedEntries?.find(f => f?.product_id === row.id)?.product_variations
          }
        })
        dispatch(addRate(params, {message, setRateConfig}))
    }

    const isOrderSubmitted = [1,2].includes(selectedOrder?.order_status_id)
    

    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
    
    function onCancelOrder(){
      setIsCancelModalVisible(prev => !prev)
    }

    const [isViewCancelDetail, setIsViewCancelDetail] = useState(false)
    

    function onViewCancelDetail() {
      setIsViewCancelDetail(prev => !prev)
    }

    function onSubmitCancellationRequest(values){
     
      values.order_id = selectedOrder.id
      values.status = 1
      values.reason =  values.reason === 1 ? 'Need to change delivery address' : values.reason === 2 ? 'Others / change of mind' : ''

      dispatch(addOrderCancellations(values, {message, form, setIsCancelModalVisible}))
       
    }

    const orderHistoryStatus = selectedOrder?.order_status_histories?.map(row => row?.order_status_id)
    const isOrderCancelled = orderStatusWithDate?.find(row => row.id === 7).date !== undefined
   
    const orderStatusWithDateStep = isOrderCancelled ? orderStatusWithDate.filter(row => orderHistoryStatus.includes(row.id)) : orderStatusWithDate

    const orderCancellationDetail = selectedOrder?.order_cancellation;
 
    return (
        <main className='my-purchase'>
            <div>
                {hasOrderNoParams &&
                <section className='my-purchase-order'>
                <Card title={`ORDER ID: ${selectedOrder?.order_no}`}
                 extra={selectedOrder?.order_status_id ===  7 ? (
                  orderCancellationDetail?.status === 0 ?
                  'Order has been cancelled by Admin' : 'You have been cancelled your order.'
                 ) : latestOrderStatus?.order_status?.description
                  }
                 >
                   
                <Steps current={selectedOrder?.order_status_id} labelPlacement='vertical'>
                  {orderStatusWithDateStep.map(status => (
                     <Steps.Step key={status.name} title={status?.name} description={status?.date ?
                      (status.id === 4 ?  moment(selectedOrder?.delivery_date).format('MM/DD/YYYY') : moment(status?.date).format('MM/DD/YYYY hh:mm A')):''} />
                  ))}
                </Steps>
                </Card>
                <Card title='Delivery Address'>
                  <div>{latestDeliveryAddress?.user?.name}</div>
                  <div>{latestDeliveryAddress?.user?.mobile_number}</div>
                  <div>{latestDeliveryAddress?.address}</div>
                </Card>
                <Card title='Remarks'>
                   {selectedOrder?.message}
                </Card>
                <Card>
                <OrderList order={selectedOrder}/>
                </Card>
                <Card title='Payments' className='my-purchse-payments'>
                {selectedOrder?.payments?.map(payment => (
                  <div key={payment?.id}>
                    <div>&#8369; {payment?.amount?.toLocaleString()}</div>
                    <div>{payment?.mode_of_payment?.name}</div>
                    <div>{moment(payment?.mode_of_payment?.created_at).format('LL hh:mm A')}</div>
                  </div>
                ))}
                </Card>
                <Card className='orders-total'>
                    <Descriptions column={1} colon={false}>
                    <Descriptions.Item label="Sub Total">
                    &#8369; {selectedOrder?.order_items?.map(row => row?.quantity * row?.unit_price)
                    ?.reduce((acc,cur) => acc + cur,0)?.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Shipping">
                    &#8369; {selectedOrder?.shipping_fee?.toLocaleString()}
                    </Descriptions.Item>
                    {hasBalance && 
                      <Descriptions.Item label="Balance">
                      &#8369; {paymentsWithShippingFee?.toLocaleString()}
                      </Descriptions.Item>
                    }
                    <Descriptions.Item label="Total" className='order-total'>
                    &#8369; {selectedOrder?.total_price?.toLocaleString()}
                    </Descriptions.Item>
                    </Descriptions>
                </Card>

              {[1,2,7].includes(selectedOrder?.order_status_id) &&
                <div className='cancellation-section'>
                  {orderCancellationDetail?.status === 0 ? 
                  
                  <Button onClick={onViewCancelDetail} type='primary'>View Cancelled Order by Admin Details</Button>
                  : 

                  <>
                  {orderCancellationDetail?.hasOwnProperty('id') &&
                  
                  <div>
                  You have requested to cancel/ refund the order
                  </div>

              }

            {!orderCancellationDetail?.hasOwnProperty('id') && 
              <Button onClick={onCancelOrder} className='btn-cancel-order'
              disabled={hasOrderCancellationRequest}
              >Cancel/Refund Order</Button>
            }

            {orderCancellationDetail?.hasOwnProperty('id') &&
              <Button onClick={onViewCancelDetail} type='primary'>View Cancellation Details</Button>
            }
                  </>
                }
                </div>
                }

                </section>
                }

                {!hasOrderNoParams && 
                <Tabs defaultActiveKey={1}  onChange={onChangeOrderStatus}>
                {ordersByStatusWithALL.map(orderStatus => (
                <Tabs.TabPane tab={`${orderStatus.name} ${orderStatus.orders.length ? (orderStatus.name === 'All'  ? '' : `(${orderStatus.orders.length})`) : ''}`} key={orderStatus.id}>
                {orderStatus?.orders.map(order => {

                  const hasRate = order?.rates?.length > 0
                  const ORDER_DELIVERED = 5
                  const ORDER_COMPLETED = 6
                  const isOrderDelivered = order?.order_status_id === ORDER_DELIVERED
                  const isOrderDone = [5,6].some(status => status === order?.order_status_id)

                  const ORDER_FOR_DELIVERY = 4
                  const isOrderForDelivery = order?.order_status_id === ORDER_FOR_DELIVERY
   
                  const cardExtra =  isOrderForDelivery || isOrderDelivered ? isOrderForDelivery ?  {
                    extra: `${order?.order_items?.length > 1 ? 'Products' : 'Product'} will be deliver by ${moment(order.delivery_date).format('LL')}`
                  } :  {
                    extra: `${order?.order_items?.length > 1 ? 'Products' : 'Product'} has been delivered`
                  } 
                  : {}

                return (
                <Card title={order?.order_no}
                  {...cardExtra}
                actions= {[
                <div className='orders-card-bottom-content'>
                <div>{
                 (!hasRate && isOrderDone ? 
                  <Button type='primary' onClick={() => openModalRate(order)}>Rate</Button> :
                   '')
                   }</div>
                <div>Order Total: <span className='order-total'>&#8369;{order?.total_price?.toLocaleString()}</span></div>
                </div>
                ]}
                className='orders-card'
                >
                <OrderList order={order}/>
                </Card>
                )
                })}
                </Tabs.TabPane>
                ))}
                </Tabs>
                }
            </div>


            <Modal
          visible={isViewCancelDetail}
          title='Cancellation Details'
          maskClosable={false}
          onCancel={() => setIsViewCancelDetail(false)}
          width={500}
          footer={false}
          closable
          forceRender
          getContainer={false}
          >
        
          {/* {JSON.stringify(orderCancellationDetail)} */}



          {orderCancellationDetail?.status === 0 ? 
           <Card title='Order Cancelled by Admin'>
           <Descriptions column={1}>
           <Descriptions.Item label="Status">
            Manually Cancelled
           </Descriptions.Item>
           <Descriptions.Item label="Remarks">
           {orderCancellationDetail?.reason}
           </Descriptions.Item>
           <Descriptions.Item label="Date">
           {moment(orderCancellationDetail?.created_at).format('LLL')}
           </Descriptions.Item>
           </Descriptions>
           </Card>
        :
        
        <>
        <Card title='Requested' style={{marginBottom: '1rem'}}>
          <Descriptions column={1}>
          <Descriptions.Item label="Requested Status">
            Pending
           </Descriptions.Item>
          <Descriptions.Item label="Requested by">
            You
          </Descriptions.Item>
          <Descriptions.Item label="Requested at">
          {moment(orderCancellationDetail?.created_at).format('LLL')}
          </Descriptions.Item>
          </Descriptions>
          </Card>
          
        
          {orderCancellationDetail?.status !== 1 && 
           <Card title='Response'>
           <Descriptions column={1}>
           <Descriptions.Item label="Response Status">
           {orderCancellationDetail?.status === 0 ? 'Manual Cancelled' : 
           orderCancellationDetail?.status === 1 ? 'Pending' :
           orderCancellationDetail?.status === 2 ? 'Approved' :
           'Rejected'
          }
           </Descriptions.Item>
           <Descriptions.Item label="Remarks">
           {orderCancellationDetail?.reason}
           </Descriptions.Item>
           <Descriptions.Item label="Response at">
           {moment(orderCancellationDetail?.updated_at).format('LLL')}
           </Descriptions.Item>
           </Descriptions>
           </Card>
          }
        </>
        }
          
          </Modal>

            
          <Modal
          visible={isCancelModalVisible}
          title='Select Cancellation Process'
          maskClosable={false}
          onCancel={() => setIsCancelModalVisible(false)}
          width={500}
          closable
          footer={[
          <Button key={2} form='form-cancellation' type='primary' htmlType='submit' loading={isOrderCancellationLoading}>Confirm</Button>
          ]}
          forceRender
          getContainer={false}
          >
          <Form
          form={form}
          id='form-cancellation'
          onFinish={onSubmitCancellationRequest}
          autoComplete="off"
          layout='vertical'
          requiredMark={false}
          className='form-cancellation'
          initialValues={{
          reason: 2
          }}
          >
          <Form.Item
          name='reason'
          rules={[{ required: true, message: 'Reason is Required' }]}
          >
          <Radio.Group>
          <Space direction="vertical">
          <Radio value={1}>Need to change delivery address</Radio>
          <Radio value={2}>Others / change of mind</Radio>   
          </Space>
          </Radio.Group>
          </Form.Item>
          </Form>
          </Modal>

          <Modal
          visible={rateConfig.isVisible}
          title='Rate Product'
          maskClosable={false}
          onCancel={() => setRateConfig(prev => ({isVisible: false, data: prev.data}))}
          width={500}
          closable
          footer={[
          <Button key={1} type='ghost' onClick={() => setRateConfig(prev => ({isVisible: false, data: prev.data}))}>Cancel</Button>,
          <Button key={2} form='form-rate' type='primary' htmlType='submit' loading={isLoading}>Submit</Button>
          ]}
          forceRender
          getContainer={false}
          >


          <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={matchedEntries}
          rowKey={(obj) => obj.id}
          renderItem={item => (
          <List.Item className='rate-list-item'>
          <Skeleton avatar title={true} loading={isLoading} active>
          <List.Item.Meta 
          avatar={<Avatar size={70} src={(process.env.REACT_APP_API_PRODUCT_PHOTO + item?.product_photo)} shape='square' />}
          title={<>{item?.product_and_brand_name}</>}
          description={<div>
          <div>Variations: {item?.product_variations} </div>
          </div>}
          />
          <Form
          form={form}
          id='form-rate'
          onFinish={onSubmitRate}
          autoComplete="off"
          layout='vertical'
          requiredMark={false}
          className='form-rate'
          >
          <Form.Item
          name={[`product-${item?.product_id}`,`count-${item?.product_id}`]}
          label="Rate"
          rules={[{ required: true, message: 'Rate is Required' }]}
          >
          <Rate allowClear={false}/>
          </Form.Item>

          <Form.Item
          hidden={true}
          name={[`product-${item?.product_id}`,'id']}
          initialValue={item?.product_id}
          >
          <Input/>
          </Form.Item>

          <Form.Item
          name={[`product-${item?.product_id}`,`message-${item?.product_id}`]}
          label="Message"
          rules={[{ required: true, message: 'Message is Required' }]}
          >
          <Input type='textarea' />
          </Form.Item>
          <Form.Item
          name={[`product-${item?.product_id}`,`is_anonymous-${item?.product_id}`]}
          valuePropName="checked"
          initialValue={false}
          >
          <Checkbox onChange={(e) => onChangeIsAnonymousName(e, item.product_id)}>
          <div>

          <h3>Leave your review anonymously</h3>
          <span>Your user name will be shown as {transformUserName(isHideName[`is_anonymous-${item.product_id}`],item?.user_name)}
          </span>
          </div>
          </Checkbox>
          </Form.Item>

          </Form>
          </Skeleton>
          </List.Item>
          )}
          />


          </Modal>

        </main>
    )
}