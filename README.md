## bs-amap 地图逻辑层

#### 示例

```vue
npm install @xinguang-data/bs-amap
```
```vue
import bsAmap from '@xinguang-data/bs-amap'
import vue from 'vue'
vue.use( bsAmap );

<bs-amap
    :region_id=""
    :mapConfig=""
    :polygons=""
    :basePolygons=""
    :polygonNormal=""
	:polygonDefault=""
    :polygonHighlight=""
    :polygonHover=""
    :polygonDyeing=""
	:textStyle=""
	:pointData=""
    :satelliteIsShow=""
>
```

#### 更新记录

------

v0.0.1

- 初始化项目

v0.0.2

- 修改组件props接收多边形样式参数限制
- 修复多边形多选功能
- 修复没有多边形数据情况时，地图显示出现的问题
- 修复使用海量点默认自适应点显示范围问题

v0.0.3

- 修复地图层级缩放时当前层级无数据展示方式
- 修复纯文本标签样式参数
- 删除标签点击操作响应的事件，仅提供纯文本标签事件接口给外部
- 删除多边形点击操作多余事件接口

v0.0.4

- 增加热力图模块

v0.0.5

- package 依赖包更新