import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'

function App () {
  return (
    // 路由配置

    <BrowserRouter>
      <div className="App">

        <Routes>
          {/* 创建路由path和组件的关系 */}
          <Route path='login' element={<Login />}></Route>
          <Route path='/' element={<Layout />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
