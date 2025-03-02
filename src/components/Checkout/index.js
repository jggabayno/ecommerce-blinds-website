import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getCheckoutByOrderNumber} from '../../states/checkout/actions'
import {fetchProfile} from '../../states/profile/actions'
import {getOwnOrders,addToMyPurchase} from '../../states/orders/actions'
import {deleteCartInfoSuccess} from '../../states/cart/actions'

import Table from 'antd/lib/table'
import Image from 'antd/lib/image'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Tabs from 'antd/lib/tabs'
import message from 'antd/lib/message'
import {Typography} from 'antd'
import Button from '../shared/Button'
import Input from '../shared/Input'
import CSelect from '../shared/Select'

import Radio from 'antd/lib/radio'
import Card from 'antd/lib/card'
import Upload from 'antd/lib/upload'
import Descriptions from 'antd/lib/descriptions'
import { UploadOutlined } from '@ant-design/icons';

import GcashImage from '../../assets/images/gcash.png'
import BPIImage from '../../assets/images/bpi.png'
import imageUpload from '../../states/imageupload/actions';
import './index.scss'

export default function Checkout(){

    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const {isLoading, data: checkout} = useSelector(state => state.checkout)

    const {data: profile} = useSelector(state => state.profile)
    const {isLoading: isLoadingOrders} = useSelector(state => state.orders)

    useEffect(() => { dispatch(fetchProfile())}, [dispatch])
    useEffect(() => { dispatch(getOwnOrders())}, [dispatch])

 
    useEffect(() => {
        if (!checkout) {
            navigate('/notifications')
        }
    }, [checkout])

    function dataSource() {
        return checkout[0]?.checkout_item
    }

    useEffect(() => {
        dispatch(getCheckoutByOrderNumber(params.checkout_no,navigate))
    }, [params.checkout_no])


    const columns = [
        {                                                                                                                                                         dataIndex: 'name',
        render: (text, record) => {
          const photo = (process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + record?.color?.photo)
          return  (
            <div className='checkout-product-column-detail'>
          <Image
            className='product-img-wrapper'
            src={photo || 'error'}
            preview={false}
            fallback="data:image/png;base64,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"
          />
          <h2>{record.product?.name}</h2> 
          <div>
            
            <h4>Variations</h4>
            <span> {`${record.color?.name} - ${record.size?.name} - ${record?.ctrl === 'r' ? 'Right' : 'Left'}`}</span>
          </div>                 
        </div>
          )
        }
        
        },
        {
          title: 'Unit Price',
          dataIndex: 'price',
          render:(price) => <div>&#8369; {price?.toLocaleString()}</div>
          },
        {
          title: 'Amount',
          dataIndex: 'quantity',
          },
          {
          title: 'Item Subtotal',
          render:(_,{quantity, price}) => <div>&#8369; {(price * quantity).toLocaleString()}</div>
          }
    ]

    const [deliveryAddress,setDeliveryAddress] = useState(profile.address)
    const onChangeAddress = (e) => setDeliveryAddress(e.target.value)

    const [isEditDeliveryAddress,setIsEditDeliveryAddress] = useState(false)
    useEffect(() => {
      form.setFieldsValue({address: profile.address})
      setDeliveryAddress(profile.address)
    }, [profile.address, form])
    const onSubmitAddress = () => setIsEditDeliveryAddress(prevState => !prevState)

    const hasShippingFee = !deliveryAddress?.toLowerCase()?.includes('rizal');
    const [shippingFee,setShippingFee] = useState(hasShippingFee ? 50 : 0)

    useEffect(() => {setShippingFee(hasShippingFee ? 50 : 0)},[hasShippingFee, deliveryAddress])

    const subTotal = dataSource()
    ?.map(checkout => checkout.price * checkout.quantity)
    .reduce((acc, cur) => acc + cur, 0)

    const [paymentOption, setPaymentOption] = useState(1);
    const onSelectPaymentOption = (value) => {
      setPaymentOption(value)
    }

    const [imageURL, setImageURL] = useState(null);

    const uploadImage = (info) => {

    function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
    }

    if (info) {
    getBase64(info.file, (imageUrl) => (
    setImageURL(imageUrl)
    ));
    }
    }

    const total_price =  (subTotal + shippingFee)

    function onChangePayment(isFullPayment) {
      if (isFullPayment) form.setFieldsValue({amount: subTotal})
      if (!isFullPayment) form.setFieldsValue({amount: subTotal / 2})
    }
    
    const onSubmit = async (values) => {

      const getImage = async (photo) => photo ? await imageUpload({ destination: 'payment', photo }) : imageURL

      const MODES_OF_PAYMENT = [
        {
          id: 1,
          name: 'Gcash'
        },
        {
          id: 2,
          name: 'BPI'
        }
      ]

      const name = MODES_OF_PAYMENT.find(row => row.id === Number(paymentOption)).name

      const PROFIT_SQFT = 20

      const order = {
        ...values,
        checkout_no: params.checkout_no,
        total_price,
        shipping_fee: shippingFee,
        items: checkout[0]?.checkout_item.map(item => ({
          product_id: item.product_id,
          color_id: item.color_id,
          size_id: item.size_id,
          quantity: item.quantity,
          product_name: item.product.name,
          color_name: item.color.name,
          size_name: item.size.name,
          ctrl: item.ctrl,
          unit_price: item.price,
          _profit: (item?.size?.multiplier / 144) * PROFIT_SQFT
        })),
        mode: {
          name,
          details: {
            ...values.mode.details,
            photo: await getImage(imageURL)
          }
        }
      }
      dispatch(addToMyPurchase(order, {navigate, message,deleteCartInfoSuccess}))
 
    }
 
    if (isLoading) return <></>

    return (
        <main className='checkout'>
            <div>
            <h1 className="title">Checkout</h1>
            <Form
              layout="vertical" 
              form={form}
              name="order-form"
              className='order-form'
              onFinish={onSubmit}
              colon={false}
              requiredMark={false}
              >
              <Card title="Delivery Address">
            
              <Form.Item className='form-item-name-mobile-number'>
              <Typography level={3}>{`${profile?.first_name} ${profile?.last_name} ${profile?.mobile_number?.replace('0','(+63) ')}`}</Typography>
              </Form.Item>

              <Form.Item name="address" rules={[{ required: true, message: "Delivery Address is Required" }]}>
              <Input
              className={isEditDeliveryAddress ? 'editAddress' : 'unEditAddress'}
              onChange={onChangeAddress}
              />
              </Form.Item>

              <Form.Item>
                  <Button type='link' onClick={onSubmitAddress}>
                  {isEditDeliveryAddress ? 'Done' : 'Change'}
                  </Button>
                  {isEditDeliveryAddress &&
                  <Button type='link' onClick={() => {
                  setIsEditDeliveryAddress(false)
                  form.setFieldsValue({
                    address: profile.address
                  })
                  }}>Cancel</Button>
                  }
              </Form.Item>
          
            </Card>

            <Table rowKey="id"
              columns={columns}
              dataSource={dataSource()}
              pagination={false}
              loading={isLoading}
              hoverable={false}
            />

         
            <Card title="Payment Option">
              <Tabs defaultActiveKey={paymentOption}  onChange={onSelectPaymentOption}>
                <Tabs.TabPane 
                tab={<span className='payment-option-tabpane-span gcash-tabpage'><img src={GcashImage} alt='gcash'/></span>}
                key={1}>
                  {Number(paymentOption) === 1 &&
                  <Card title="Gcash Payment" className='payment-option-card'>

                        <Form.Item  name={['mode', 'details', 'receiver_number']} initialValue={'09120247842 - Annabelle Regaton'} label="Receiver Number" rules={[{ required: true }]}>
                        <Typography.Paragraph copyable>09120247842 - Annabelle Regaton</Typography.Paragraph>
                        </Form.Item>

                        <Form.Item name={['mode', 'details', 'reference_no']} label="Reference Number"
                         rules={[{ required: true, message: "Reference Number is Required" }]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item name={['mode', 'details', 'sender_number']} label="Sender Number"
                          rules={[{ required: true, message: "Sender Number is Required" }]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item name={['mode', 'details', 'photo']} label="Screenshot of the receipt"
                        rules={[{ required: true, message: "Screenshot of the receipt is Required" }]}
                        >
                        <Upload
                        name="upload"
                        // showUploadList={false}
                        beforeUpload={() => false}
                        accept='image/*'
                        onChange={uploadImage}
                        >
                        <Button className='btn-upload' icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                        </Form.Item>

                        <Form.Item name="is_full_payment" label="Full Payment or Downpayment"
                        rules={[{ required: true, message: "Full Payment or Downpayment is Required" }]}
                        >
                        <CSelect
                        placeholder="Select Full Payment or Downpayment"
                        onChange={onChangePayment}
                        allowClear
                        >
                        <Select.Option value={1}>Full Payment</Select.Option>
                        <Select.Option value={0}>Down Payment</Select.Option>
                        </CSelect>
                        </Form.Item>

                        <Form.Item name="amount" label="Amount"
                        rules={[{ required: true, message: "Amount is Required" }]}
                        >
                        <Input disabled/>
                        </Form.Item>

                        <Form.Item name="message" label="Message">
                        <Input type='textarea' placeholder='(Optional) Leave a message to staff'/>
                        </Form.Item>

                        
                  </Card>
                   }
                </Tabs.TabPane>
                <Tabs.TabPane 
                tab={<span className='payment-option-tabpane-span bpi-tabpage'><img src={BPIImage} alt='bpi'/></span>}
                key={2}>
                    {Number(paymentOption) === 2 && 
                           <Card title="BPI Payment" className='payment-option-card'>

                            <Form.Item name={['mode', 'details', 'bank']} label="Bank"
                            rules={[{ required: true, message: "Bank is Required" }]}
                            >
                            <Input /> 
                            </Form.Item>

                            <Form.Item name={['mode', 'details', 'address']} label="Address"
                            rules={[{ required: true, message: "Address is Required" }]}
                            >
                            <Input /> 
                            </Form.Item>

                            <Form.Item name={['mode', 'details', 'account_no']} label="Account No"
                            rules={[{ required: true, message: "Account No is Required" }]}
                            >
                            <Input /> 
                            </Form.Item>

                            <Form.Item name={['mode', 'details', 'account_name']} label="Account Name"
                            rules={[{ required: true, message: "Account Name is Required" }]}
                            >
                            <Input /> 
                            </Form.Item>

                           <Form.Item  name={['mode', 'details', 'receiver_number']} initialValue={'09120247842 - Annabelle Regaton'} label="Receiver Number" rules={[{ required: true }]}>
                           <Typography.Paragraph copyable>09120247842 - Annabelle Regaton</Typography.Paragraph>
                           </Form.Item>
   
                           <Form.Item name={['mode', 'details', 'reference_no']} label="Reference Number"
                            rules={[{ required: true, message: "Reference Number is Required" }]}
                           >
                           <Input />
                           </Form.Item>
   
                           <Form.Item name={['mode', 'details', 'sender_number']} label="Sender Number"
                             rules={[{ required: true, message: "Sender Number is Required" }]}
                           >
                           <Input />
                           </Form.Item>
   
                           <Form.Item name={['mode', 'details', 'photo']} label="Screenshot of the receipt"
                           rules={[{ required: true, message: "Screenshot of the receipt is Required" }]}
                           >
                           <Upload
                           name="upload"
                           // showUploadList={false}
                           beforeUpload={() => false}
                           accept='image/*'
                           onChange={uploadImage}
                           >
                           <Button className='btn-upload' icon={<UploadOutlined />}>Upload</Button>
                           </Upload>
                           </Form.Item>
   
                           <Form.Item name="is_full_payment" label="Full Payment or Downpayment"
                           rules={[{ required: true, message: "Full Payment or Downpayment is Required" }]}
                           >
                           <CSelect
                           placeholder="Select Full Payment or Downpayment"
                           onChange={onChangePayment}
                           allowClear
                           >
                           <Select.Option value={1}>Full Payment</Select.Option>
                           <Select.Option value={0}>Down Payment</Select.Option>
                           </CSelect>
                           </Form.Item>
   
                           <Form.Item name="amount" label="Amount"
                           rules={[{ required: true, message: "Amount is Required" }]}
                           >
                           <Input disabled/>
                           </Form.Item>
   
                           <Form.Item name="message" label="Message">
                           <Input type='textarea' placeholder='(Optional) Leave a message to staff'/>
                           </Form.Item>
                     </Card>
                    }
                </Tabs.TabPane>
              </Tabs>
            </Card>
            
            <Card className='total-card'
            actions={[
                <Button type='primary' className='btn-placeorder' htmlType='submit' loading={isLoadingOrders || isLoading} onSubmit={onSubmit}>
                    Place Order
                </Button>
            ]}
            >
            <Descriptions column={1} colon={false}>
                <Descriptions.Item label="Sub Total">
                    &#8369; {subTotal?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping">
                    &#8369; {shippingFee?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Total" className='checkout-total'>
                    &#8369; {total_price?.toLocaleString()}
                </Descriptions.Item>
            </Descriptions>
            </Card>
            </Form>
            </div>
        </main>
    )
}