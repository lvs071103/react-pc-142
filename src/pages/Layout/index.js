import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const GeekLayout = () => {
  const { pathname } = useLocation()
  // console.log(pathname)
  const { userStore, loginStore, channelStore } = useStore()
  // 获取用衣数据民
  useEffect(() => {
    try {
      userStore.getUserInfo()
      channelStore.loadChannelList()
    } catch { }
  }, [userStore, channelStore])

  // function getItem (label, key, icon, children, type) {
  //   return {
  //     key,
  //     icon,
  //     children,
  //     label,
  //     type,
  //   }
  // }
  // const items = [
  //   getItem(<Link to={'/'}>数据概览</Link>, '/', <HomeOutlined />),
  //   getItem(<Link to={'/article'}>内容管理</Link>, '/article', <DiffOutlined />),
  //   getItem(<Link to={'/publish'}>发布文章</Link>, '/publish', <EditOutlined />),
  // ]

  const items = [
    { label: <Link to={'/'}>数据概览</Link>, key: '/', icon: <HomeOutlined /> },
    { label: <Link to={'/article'}>内容管理</Link>, key: '/article', icon: <DiffOutlined /> },
    { label: <Link to={'/publish'}>发布文章</Link>, key: '/publish', icon: <EditOutlined /> }
  ]
  // 确定退出
  const navigate = useNavigate()
  const onLogout = () => {
    // 退出登陆 删除token 跳回到登录
    loginStore.loginOut()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={onLogout}
              title="是否确认退出？"
              okText="退出"
              cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          {/* 高亮原理：  
          defaultSelectedKeys===key 
          获取当前激活的path路径 ？
          */}
          <Menu
            mode="inline"
            theme="dark"
            // defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          >
            {/* <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to={'/'}>数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to={'/article'}>内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to={'./publish'}>发布文章</Link>
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)