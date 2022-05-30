import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'
// import RichEditor from '@/hooks/editorState'
// import React from "react"
// import { Editor, EditorState } from "draft-js"
// import "draft-js/dist/Draft.css"

const { Option } = Select

const Publish = () => {
  const { channelStore } = useStore()
  // 存放上传图片的列表
  const [fileList, setFileList] = useState()
  // 使用useRef声明一个暂存仓库
  const cacheImageList = useRef()
  // 上传
  const onUploadChange = info => {
    const fileList = info.fileList.map(file => {
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 上传中时， 不做处理
      return file
    })
    console.log(fileList)
    // 采取受控的写法：在最后一次log里面有response
    // 最终react state fileList中存放的数据有response.data.url
    setFileList(fileList)
    cacheImageList.current = fileList
  }
  // 切换图片类型
  const [imageCount, setImageCount] = useState(1)
  const radioChange = (e) => {
    // console.log(e.target.value)
    // 使用原始数据作为判断条件 不采取经过useState方法修改之后的数据
    // useState修改之后的数据 无法同步获取修改之后的新值
    const rawValue = e.target.value
    setImageCount(rawValue)
    // 从仓库里面取对应的图片数量，用来渲染图片列表的fileList
    // 通过调用setFileList
    if (rawValue === 1) {
      const img = cacheImageList.current ? cacheImageList.current[0] : []
      setFileList([img])
    } else if (rawValue === 3) {
      setFileList(cacheImageList.current)
    }
  }

  // 初始化useNaviage
  const navigate = useNavigate()

  // 提交表单
  const onFinish = async (values) => {
    console.log(values)
    // 数据的二次处理 重点处理cover字段
    const { channel_id, content, title, type } = values
    console.log(content)
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (articleId) {
      // 请求编辑接口
      await http.put(`/mp/articles/${articleId}?draft=false`, params)
    } else {
      // 新增接口
      await http.post('/mp/articles?draft=false', params)
    }
    // 跳转 提示用户
    navigate('/article')
    message.success(`${articleId ? '更新成功' : '发布成功'}`)
  }

  // 编辑功能
  const [params] = useSearchParams()
  const articleId = params.get('id')
  // console.log('route: ', articleId)
  // 数据回填 id调用接口， 1.表单回填 2.暂存列表 3.upload组件fileList需要回填
  const form = useRef(null)
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${articleId}`)
      // console.log(res)
      // 表单数据回填 实例方法
      const { cover, ...formValue } = res.data
      form.current.setFieldsValue({ ...formValue, type: cover.type })
      // 调用setFileList方法回填upload
      const imageList = cover.images.map(url => ({ url }))
      setFileList(imageList)
      setImageCount(cover.type)
      // 暂存列表
      cacheImageList.current = imageList
    }
    // 必须是编辑状态 教程可以发送请求
    if (articleId) {
      loadDetail()
      // console.log(form.current)
    }
  }, [articleId])

  // draft.js
  // const [editorState, setEditorState] = React.useState(() =>
  //   EditorState.createEmpty()
  // )

  // const editor = React.useRef(null)
  // function focusEditor () {
  //   editor.current.focus()
  // }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? '编辑' : '发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ content: '' }}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imageCount > 1}
                maxCount={imageCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          {/* 这里是富文本组件 已经被Form.Item控制 */}
          {/* 它的输入内容会在onFinished回调中收集起来 */}
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              theme='snow'
              className='publish-quill'
            />
            {/* <div
              style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
              onClick={focusEditor}
            >
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Write something!"
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
              />
            </div> */}
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? '更新' : '发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)