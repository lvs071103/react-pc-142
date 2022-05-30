// 封装图表bar组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

function echartInit (node, xData, yData, title) {
  // 绘制图表
  const myChart = echarts.init(node)
  myChart.setOption({
    title: {
      text: title
    },
    tooltip: {},
    xAxis: {
      data: xData
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: yData
      }
    ]
  })
}

function Bar ({ title, xData, yData, style }) {
  const domRef = useRef(null)
  // 执行这个初始化的函数
  // 1. 先不考虑传参问题  静态数据渲染到页面中
  // 2. 把那些用户可能定制的参数 抽象props (1.定制大小 2.data 以及说明文字)
  useEffect(() => {
    echartInit(domRef.current, xData, yData, title)
  }, [xData, yData, title])

  return (
    <div>
      {/* 准备一个挂载节点 */}
      <div ref={domRef} style={style}></div>
    </div>
  )
}

export default Bar