import React, { useEffect } from "react";
// import { useNavigate } from 'react-router-dom'
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Title from 'antd/lib/typography/Title'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import './index.scss'

export default function ForgotPassword(){
    // const navigate = useNavigate()

   async function onSubmit(values) {
    values.email = values.email.trim() 

      try {
            
      const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('sendForgotPasswordEmail', values)
      const data = await response.data

      if(data === 'Email not exist'){

        form.setFields([{ name: 'email', errors: ['Your email address is not registered.']}])

      } else {
        message.success('Please check your email for password reset link.')
        form.resetFields()

      }

      } catch (error) {
        form.setFields([{ name: 'email', errors: ['Your email address is not registered.']}])
      }
   }
   
   const [form] = Form.useForm()
 
    return (
        <main className="forgot-password">
          <Form form={form} onFinish={onSubmit} hideRequiredMark scrollToFirstError>
          <Title level={3} className='forgot-password-title'>Forgot Password</Title>

          <Form.Item
          name="email"
          rules={[{ required: true, message: "Email Required" }]}
          >
          <Input placeholder="Email" />
          </Form.Item>

          <Form.Item className="forgot-password-btns">
          <Button htmlType="submit" type='primary'>Submit</Button>
          <Button>Cancel</Button>
          </Form.Item>

        </Form>
        </main>
    )
}