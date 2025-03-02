import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Title from 'antd/lib/typography/Title'
import Button from '../shared/Button'
import Input from '../shared/Input'
import { login } from '../../states/auth/actions';
import './index.scss'

export default function Login(){
    const navigate = useNavigate()

   const dispatch = useDispatch()
 
   const {isLoggingIn, isLoginRejected} = useSelector(state => state.auth)
 
   function onSubmit(credentials) {
    credentials.email = credentials.email.trim() 
    dispatch(login(credentials, navigate))
   }
   
   const [form] = Form.useForm()
 
    return (
        <main className="login">
          <Form form={form} onFinish={onSubmit} hideRequiredMark scrollToFirstError>
          <Title level={3} className='login-title'>Log In</Title>
          {isLoginRejected && <span className="invalid-credential">Invalid Credential</span>}
          <Form.Item
          name="email"
          rules={[{ required: true, message: "Email Required" }]}
          >
          <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
          name="password"
          rules={[{ required: true, message: "Password Required" }]}
          >
          <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item>
          <Button className='btn-login' htmlType="submit" type='primary' loading={isLoggingIn} block>Login</Button>
          <Link to='/forgot-password'>Forgot Password?</Link>
          <span className="signup">New to App? <Link to='/signup'>Sign up</Link></span>
          </Form.Item>
          <Form.Item>
          </Form.Item>
        </Form>
        </main>
    )
}