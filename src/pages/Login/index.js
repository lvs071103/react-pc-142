import { Button } from 'antd'
import { Card, Form, Input, Checkbox } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'

function Login () {
  // 成功
  function onFinish (values) {
    console.log(values)
    // values：放置的是所有表单项中用户输入的内容
    // todo: 登陆
  }
  // 失败
  // const onFinishFailed = (errorInfo) => {
  //   console.log("Failed:", errorInfo)
  // }
  return (
    <div className='login'>
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登陆表单 */}
        <Form
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            password: '123456'
          }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号',
                validateTrigger: 'onBlur'
              },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
              { len: 6, message: '密码需6个字符', validateTrigger: 'onBlur' },
            ]}
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item>
            {/* 渲染Button组件为submit按钮 */}
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login