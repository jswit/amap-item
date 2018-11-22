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