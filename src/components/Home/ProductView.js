import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {fetchProduct} from '../../states/products/actions'
import {fetchSize} from '../../states/sizes/actions'
import {addToCart} from '../../states/cart/actions'

import {useParams, useNavigate} from 'react-router-dom'
import QtyInput from '../shared/QtyInput'
import Button from '../shared/Button'

import Tag from 'antd/lib/tag'
import Rate from 'antd/lib/rate'
import Typography from 'antd/lib/typography'
import Image from 'antd/lib/image'
import Descriptions from 'antd/lib/descriptions'
import message from 'antd/lib/message'
import Card from 'antd/lib/card'
import moment from 'moment'
import NoPhoto from '../../assets/images/no_photo.png'
import { CgShoppingCart } from "react-icons/cg";
import Avatar from 'antd/lib/avatar'
import Divider from 'antd/lib/divider'
import Skeleton from 'antd/lib/skeleton'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'

import {addProductSize} from '../../states/sizes/actions'

export default function ProductView() {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    const [sizes,setSizes] = useState({isLoading: false, data: []})
    useEffect(() => fetchSize(setSizes), [])

    const [product,setProduct] = useState({isLoading: false, data: {}})
    useEffect(() => fetchProduct(params.id, setProduct), [params.id, setProduct])
 
    const {photo: productPhoto, name, price_per_square_feet, description, colors, rates, order_items} = product.data
    const photo = (process.env.REACT_APP_API_PRODUCT_PHOTO + product?.data?.photo)
 
    const isAllLoading = product.isLoading || sizes.isLoading
 
    const [selectedPhoto, setSelectedPhoto] = useState('')
 
    const [minPrice,setMinPrice] = useState();

    useEffect(() => {
        if (price_per_square_feet) setMinPrice((price_per_square_feet * 15))
    }, [price_per_square_feet])
 
    const [price, setPrice] = useState(0)

    useEffect(() => { setPrice(minPrice) }, [minPrice])
    
    const [selectedVariants,setSelectedVariant] = useState({ color_id: null, size_id: null})

    const [quantity, setQuantity] = useState(1)

    function onSelectVariant(type,value, options = {}) {
 
        setSelectedVariant(prevState => ({...prevState, [type]: value}))

        if (options.hasOwnProperty('multiplier')) {
            const formula =  (options.multiplier / 144) * price_per_square_feet
            const isMinPrice = minPrice > formula
            const total = isMinPrice ? minPrice : formula
            setPrice(total)
        }

        if (type === 'color_id') {
            setSelectedPhoto((process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + colors.find(color => color.id === value)?.photo))
        }
    }

    const [formErrors, setFormErrors] = useState({})

    const hasError = Boolean(Object.values(formErrors).length)
 
    function validateFormValues(values) {

    let errors = {}
 
    if(!values.color_id) {
        errors.color_id = 'Color is Required'
    }

    if(!values.size_id) {
        errors.size_id = 'Size is Required'
    }
 
    return errors;

    }

       
    const [customSize, setCustomSize] = useState({
        status: false,
        width: 0,
        height: 0,
        multiplier: 0
    })

    const [ctrl,setCtrl] = useState('l')
   
  
    function onAddToCart() {
        if (isLoggedIn) {
            const values = {...selectedVariants, product_id: Number(params.id), price,quantity, ctrl}
            setFormErrors(validateFormValues(values))
            const isValidated = !(Object.keys(validateFormValues(values)).length > 0)
            if (isValidated) dispatch(addToCart(values, {message, addProductSize, sizeValues: { name: `${customSize.width} x ${customSize.height}`,
                multiplier: customSize.multiplier }}))
            
        } else {
            navigate('/login')
        }
    }

    // function onBuyNow() {
    //     navigate('/cart')
    // }

    const totalResponses = rates?.length 
    const totalScores = rates?.map(rate => rate.count)?.reduce((a,c) => a + c,0)
    const totalRatingScore = totalScores / totalResponses

    const productSoldOut = order_items?.map(item => item?.quantity)?.reduce((a,c) => a + c,0)

    function getStocksCount() {
        const colorsData = colors?.filter(row => row.id === selectedVariants.color_id)
 
       const counts =  colorsData?.map(color => {
            const mapReduce = (value) => value.map(row => Number(row.quantity)).reduce((a,c) => a + c,0);
            return  {
                deducted: mapReduce(color?.stocks.filter(stock => stock.type === 0)),
                added: mapReduce(color?.stocks.filter(stock => stock.type === 1)),
                reserved: mapReduce(color?.stocks.filter(stock => stock.type === 2)),
                committed: mapReduce(color?.stocks.filter(stock => stock.type === 3))
            }
        })?.pop()           
  
        if (counts) {

            const {added, deducted, reserved,committed} = counts

            return (added - deducted - reserved - committed)
        }

       return 0
    }

    const customSizeObj = {
        id: 999999,
        name: customSize.width === 0 ? `Custom` : `Custom (${customSize.width} x ${customSize.height})`,
        user_id: 1,
        multiplier: customSize.width * customSize.height,
        created_at: moment().subtract(100, 'months'),
        updated_at: null,
    }
  
    return (
        <main className='product-view'>
            {isAllLoading ? <div className='product-view-skeleton'>
                <Skeleton/>
            </div> :
            <>      
                <div className='product-highlight'>
                <Image
                className='product-highlight-image'
                src={selectedPhoto || photo || 'error'}
                preview={false}
                fallback="data:image/png;base64,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"
                />
                <div className='detail'>

                <div className='product-detail'>
                <Typography.Title className='product-name' level={4}>{name} ({`${price_per_square_feet}/sqft`})</Typography.Title>
                <div className='product-detail-other'>
                <span> <span className='rate-count'>{`${(totalRatingScore || 0)?.toLocaleString()} `}</span> <Rate className='product-rate' disabled defaultValue={totalRatingScore} /></span><Divider type='vertical'/>
                <span><span className='rate-count'>{totalResponses?.toLocaleString()}</span> {`${totalResponses >= 1 ? 'Rating' : 'Ratings'}`}</span><Divider type='vertical'/>
                <div><span className='rate-count'>{productSoldOut?.toLocaleString()}</span> Sold</div>
                </div>

                <Typography.Text className='product-price'>&#8369; {Number(price?.toFixed(0))?.toLocaleString()}</Typography.Text>
                </div>

                <Descriptions column={1} colon={false}>
                <Descriptions.Item label="Shipping">
                <Tag color="success" className='free-shipping-tag'>
                Free shipping fee to your current address
                </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Color">
                {colors?.map(color => {


                function stocksCount() {

                const mapReduce = (value) => value.map(row => Number(row.quantity)).reduce((a,c) => a + c,0);

                const added = mapReduce(color?.stocks.filter(stock => stock.type === 1))
                const deducted = mapReduce(color?.stocks.filter(stock => stock.type === 0))
                const reserved = mapReduce(color?.stocks.filter(stock => stock.type === 2))
                const committed = mapReduce(color?.stocks.filter(stock => stock.type === 3))

                return (added - deducted - reserved - committed)
                }

                function hasStocks() {
                return stocksCount() > 0
                }

                return (
                <Tag  key={color.id}
                color={selectedVariants.color_id === color.id 
                ? 'processing' : 'default'}
                onClick={() => hasStocks() ?  onSelectVariant('color_id',color.id) : ''}
                style={{
                opacity: hasStocks() ? 1 : '.5',
                pointerEvents: hasStocks() ? 'initial' : 'none'
                }}
                >
                {color.name}
                </Tag>
                )
                })
                }
                </Descriptions.Item>
                <Descriptions.Item label="Size">
                {([...sizes.data.filter(row => [1,2,3,4].includes(row.id)), customSizeObj])?.sort((a,c) => a.multiplier - c.multiplier)?.map(size => {
                return (
                <Tag  key={size.id}
                color={selectedVariants.size_id === size.id 
                ? 'processing' : 'default'}
                onClick={
                () => {
                     onSelectVariant('size_id',size.id, {multiplier: size.multiplier})
                     if (size.id === 999999) {
                        setCustomSize(prev => ({...prev, status: true}))
                     } else {
                        // setCustomSize(prev => ({...prev, status: false}))
                        setCustomSize({
                            status: false,
                            width: 0,
                            height: 0,
                            multiplier: 0
                        })
                        
                     }
               
                }}
 
                >
                {size.name}
                </Tag>
                )
                })
                }
                {customSize.status && <div className='custom-size-inputs'>
                    <Input onChange={(e) => {
                        setCustomSize(prev => ({...prev, multiplier: (Number(e.target.value) * Number(prev.height)), width: Number(e.target.value)}))
                        const formula = ((Number(e.target.value) * Number(customSize.height)) / 144) * price_per_square_feet
                        const isMinPrice = minPrice > formula
                        const total = isMinPrice ? minPrice : formula
                        setPrice(total)
                    

                    }} placeholder='width'/>
                    <span>X</span>
                     <Input onChange={(e) => {
                         setCustomSize(prev => ({...prev, multiplier: (Number(prev.width) * Number(e.target.value)), height: Number(e.target.value)}))

                         const formula = ((Number(customSize.width) * Number(e.target.value)) / 144) * price_per_square_feet
                         const isMinPrice = minPrice > formula
                         const total = isMinPrice ? minPrice : formula
                         setPrice(total)
                 
                     }} placeholder='height'/>
                    </div>}
                </Descriptions.Item>
                <Descriptions.Item label="Control">
                    <Radio.Group
                    options={[
                    { label: 'Left', value: 'l' },
                    { label: 'Right', value: 'r' },
                    ]}
                    onChange={(e) => setCtrl(e.target.value)}
                    value={ctrl}
                    optionType="button"
                        />
                </Descriptions.Item>
                 
                <Descriptions.Item label="Quantity"><QtyInput stockCount={getStocksCount()} hasSelectedColorVariant={selectedVariants?.color_id !== null}  qtyState={[quantity, setQuantity]} /></Descriptions.Item>

                {selectedVariants?.color_id !== null &&
                <Descriptions.Item label="Available Stocks">{getStocksCount()}</Descriptions.Item>}

                {hasError &&<Descriptions.Item label="."><Typography.Text type="danger">Please select product variation first</Typography.Text></Descriptions.Item>}

                </Descriptions>
                <div className='btn-actions'>
                <Button onClick={onAddToCart} type='primary' ghost className='btn-add-to-cart' disabled={getStocksCount() < quantity}><CgShoppingCart/>Add to Cart</Button>
                {/* <Button onClick={onBuyNow} type='primary' ghost className='btn-buy-now'>Buy Now</Button> */}
                </div>
                </div>
                </div>

                <Card title='Product Description' className='product-rates'>
                <Typography.Paragraph
                ellipsis={ { rows: 2, symbol: 'more' }} 
                className='product-description'>{description}</Typography.Paragraph>
                </Card>

                <Card title='Product Ratings' className='product-rates'>
                {product?.data?.rates?.length ? 
                product?.data?.rates?.map(rate => (

                <Card key={rate?.id} className='product-rate'>
                <Card.Meta
                avatar={<Avatar src={
                !rate?.prefer_consumer_name.includes('*') ?
                (process.env.REACT_APP_API_USER_PHOTO + rate?.consumer?.photo) : NoPhoto
                } />}
                title={rate?.prefer_consumer_name}
                description={
                <div>
                <Rate className='rate' size='small' disabled defaultValue={rate?.count} />
                <div className='variation'>{rate?.product_variants?.length > 25 ? 'Variations:' : 'Variation:'} {rate?.product_variants}</div>
                <div className='date'>{moment(rate?.created_at).format('YYYY/MM/DD hh:mm A')}</div>
                <div className='message'>{rate?.message}</div>
                </div>
                }
                />
                </Card>

                ))
                : ''}
                </Card>
                </>}
        </main>
    )
}