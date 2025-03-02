import React, { useEffect } from "react";
import { useParams } from 'react-router-dom'
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Title from 'antd/lib/typography/Title'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import './index.scss'
import moment from 'moment'

export default function ResetPassword(){
    const params = useParams()

  async function onSubmit(values) {

    values.id = params.user_id;

    const sent_time = moment.unix(params.sent_time)

    const hours_ellapse = moment.duration(moment().diff(sent_time)).asMinutes()

    const TWENTY_FOUR_HOURS = 1440
    const isResetPasswordRequestReachMoreThan24Hours = hours_ellapse >= TWENTY_FOUR_HOURS

    if(isResetPasswordRequestReachMoreThan24Hours){
      message.warning('This link is expired! Please request another password reset link.')
    } else {
      const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`resetpassword/${params.user_id}`, values)
      const data = await response.data
      message.success(data.message)
      form.resetFields()
    }

   
   }
   
   const [form] = Form.useForm()
 
    return (
        <main className="reset-password">
          <Form form={form} onFinish={onSubmit} hideRequiredMark scrollToFirstError layout="vertical">
          <Title level={3} className='reset-password-title'>Reset Password</Title>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Password is Required',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Confirm Password is Required',
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
            <Input.Password />
          </Form.Item>

          <Form.Item className="reset-password-btns">
            <Button htmlType="submit" type='primary'>Submit</Button>
            <Button>Cancel</Button>
          </Form.Item>

        </Form>
        </main>
    )
}