import {useState} from 'react'
import './index.scss'
import Title from 'antd/lib/typography/Title'
import Form from 'antd/lib/form'
import Checkbox from 'antd/lib/checkbox'
import Button from '../shared/Button'
import Input from '../shared/Input'
import {Link} from 'react-router-dom'
import {signUp} from '../../states/auth/actions'
import { useNavigate } from 'react-router-dom'
import message from 'antd/lib/message'

export default function SignUp(){
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const [isSigningUp,setIsSigningUp] = useState(false)
 
    async function onSubmit(user) {
        user.email = user.email.trim() 
        await signUp(user, {message, navigate, form, setIsSigningUp})        
    }

    return (
    <main className="sign-up">
        <Form
        form={form}
        name="register"
        onFinish={onSubmit}
        scrollToFirstError
        colon={false}
        requiredMark={false}
        layout='vertical'
        >
        <Title level={3} className='signup-title'>Sign Up</Title>

        <Form.Item
        name="first_name"
        label="First Name"
        rules={[
        {
        required: true,
        message: 'First Name is Required',
        },
        ]}
        >
        <Input/>
        
        </Form.Item>

        <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
        {
        required: true,
        message: 'Last Name is Required',
        },
        ]}
        >
        <Input/>
        </Form.Item>

        <Form.Item
        name="mobile_number"
        label="Mobile Number"
        rules={[
        {
        required: true,
        message: 'Mobile Number is Required',
        },
        ]}
        >
        <Input/>
        </Form.Item>

        <Form.Item
        name="email"
        label="E-mail"
        rules={[
        {
        type: 'email',
        message: 'The input is not valid E-mail!',
        },
        {
        required: true,
        message: 'Please input your E-mail!',
        },
        ]}
        >
        <Input />
        </Form.Item>

        <Form.Item
        name="password"
        label="Password"
        rules={[
        {
        required: true,
        message: 'Please input your password!',
        },
        ]}
        hasFeedback
        >
        <Input type='password'/>
        </Form.Item>

        <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
        {
        required: true,
        message: 'Please confirm your password!',
        },
        ({ getFieldValue }) => ({
        validator(_, value) {
        if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
        }

        return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
        }),
        ]}
        >
        <Input type='password'/>
        </Form.Item>

        <Form.Item
        name='should'
        valuePropName="checked"
        rules={[
        {
        validator: (_, value) =>
        value ? Promise.resolve() : Promise.reject(new Error('Should accept terms of use and privacy policy')),
        },
        ]}
        >
        <Checkbox>
        I accept the <Link to='/login'>Terms of Use</Link> and  <Link to='/login'>Privacy Policy</Link>
        </Checkbox>
        </Form.Item>
        <Form.Item >
        <Button type="primary" htmlType="submit" loading={isSigningUp}>
            {isSigningUp ? 'Signing Up' : 'Sign Up'}
        </Button>
        </Form.Item>
        </Form>
    </main>
    )
}