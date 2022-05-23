import { unstable_HistoryRouter as HistoryRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import { history } from './utils/history'
import GeekLayout from '@/pages/Layout'
import Login from '@/pages/Login'
import { AuthComponent } from './components/AuthComponent'
import './App.css'
import Publish from './pages/Publish'
import Home from './pages/Home'
import Article from './pages/Article'

function App () {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件的关系 */}
          {/* Layout需要鉴权处理 */}
          <Route path='login' element={<Login />}></Route>
          {/* 这里的Layout一定不能写死 要根据是否登陆进行判断 */}
          <Route path='/' element={
            <AuthComponent>
              <GeekLayout />
            </AuthComponent>
          }>
            <Route index element={<Home />}></Route>
            <Route path='article' element={<Article />}></Route>
            <Route path='publish' element={<Publish />}></Route>
          </Route>
        </Routes>
      </div>
    </HistoryRouter>
  )
}

export default App
