<template>
    <div>
        <amap 
            vid="amap"
            class="amap"
            v-model="mapObj"
            :mapKey="config.mapKey" 
            :mapVersion="config.mapVersion"
            :style="config.style"
            :center="config.center"
            :mapStyle="config.mapStyle"
            :zoom="config.zoom"
            :zooms="config.zooms"
            :features="config.features"
            ref="map"
            @zoomstart="mapZoomstart"
            @zoomend="mapZoomend"
            @zoomchange="mapZoomchange"
        >
            <!-- 多边形 -->
            <amap-polygon
                v-if="polygonDatas"
                v-for="(polygon, index) of polygonDatas" 
                :key="`polygon_${polygon.region_id}${index}`"
                :path="polygon.coordinates"
                :ref="`polygon_${polygon.region_id}`"
                :extData="polygon"
                :fillColor="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].fillColor != `undefined` ? polygonDyeingArr[index].fillColor : polygonNormal.fillColor"
                :fillOpacity="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].fillOpacity != `undefined` ? polygonDyeingArr[index].fillOpacity : polygonNormal.fillOpacity"
                :strokeColor="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].strokeColor != `undefined` ? polygonDyeingArr[index].strokeColor : polygonNormal.strokeColor"
                :strokeOpacity="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].strokeOpacity != `undefined` ? polygonDyeingArr[index].strokeOpacity : polygonNormal.strokeOpacity"
                :strokeWeight="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].strokeWeight != `undefined` ? polygonDyeingArr[index].strokeWeight : polygonNormal.strokeWeight"
                :strokeStyle="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].strokeStyle != `undefined` ? polygonDyeingArr[index].strokeStyle : polygonNormal.strokeStyle"
                :draggable="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].draggable != `undefined` ? polygonDyeingArr[index].draggable : polygonNormal.draggable"
                :bubble="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].bubble != `undefined` ? polygonDyeingArr[index].bubble : polygonNormal.bubble"
                :zIndex="polygonDyeingArr.hasOwnProperty(index) && typeof polygonDyeingArr[index].zIndex != `undefined` ? polygonDyeingArr[index].zIndex : polygonNormal.zIndex"
                
                @click="polygonClick"
                @mouseover="polygonMouseover"
                @mouseout="polygonMouseout"
                                
            >
            </amap-polygon>
            
            <!-- 纯文本标记 -->
            <amap-text
                v-if="polygonDatas"
                v-for="(polygon, index) in polygonDatas" 
                :key="`text_${polygon.region_id}${index}`"
                :ref="`text_${polygon.region_id}`"

                :text="polygon.name"
                :position="polygon.center_point"
                :extData="polygon"
                
                :topWhenClick="textStyles.topWhenClick"
                :bubble="textStyles.bubble"
                :autoRotation="textStyles.autoRotation"
                :textAlign="textStyles.textAlign"
                :verticalAlign="textStyles.verticalAlign"
                :offset="textStyles.offset"
                :draggable="textStyles.draggable"
                :raiseOnDrag="textStyles.raiseOnDrag"
                :cursor="textStyles.cursor"
                :visible="textStyles.visible"
                :zIndex="textStyles.zIndex"
                :angle="textStyles.angle"
                :animation="textStyles.animation"
                :shadow="textStyles.shadow"
                :title="textStyles.title"
                :clickable="textStyles.clickable"
                :textStyle="textStyles.textStyle"

                @click="textClick"
                @dblclick="textDblclick"
                @mouseover="textMouseover"
                @mouseout="textMouseout"
                @rightclick="textRightclick"
                @mousedown="textmousedown"
                @mouseup="textMouseup"
                @touchstart="textTouchstart"
                @touchmove="textTouchmove"
                @touchend="textTouchend"

            >
            </amap-text>

            <!-- 海量点 -->
            <amap-pointsimplifier
                :pointData="pointDatas"
                :autoSetFitView="pointAutoSetFitView"
                @pointClick="pointClick"
                @pointMouseover="pointMouseover"
            >
            </amap-pointsimplifier>

            <!-- 卫星图层 -->
            <amap-satellite
                :isShow="satelliteIsShow"
            >
            </amap-satellite>


            <slot></slot>
        </amap>
    </div>
</template>
<script>

export default {
    name:"bs-amap",
    data:function(){
        return {
            mapObj : null,
            config : {},

            // 多边形
            polygonDatas : [],      // 多边形数据
            polygonDyeingArr : [],  // 地图多边形染色数据
            childPolygonDatas : null,

            // 纯文本标记
            textStyles : [],        // 纯文本标签样式
            
            chooseRegion : null,
            mapHierarchyData : {},  // 地图zoom层级对应数据，用于上钻操作
            lastZoom : Number,
            currZoom : Number,
            drillRegion : "",

            // 海量点数据
            pointDatas : [],

            // 卫星图层是否显示
            // satelliteIsShow : false,    
        }
    },
    props:{
        mapConfig : {
            type : Object,
            required : false,
            default : () => {
                return {}
            }
        },
        region_id : {
            type : String,
            required : false,
            default : ""
        },
        polygons : {
            type : Array,
            required : true,
            default : () => {
                return [];
            }
        },
        basePolygons : {
            type : Array,
            required : true,
            default : () => {
                return [];
            }
        },

        polygonNormal :{
            type : Object,
            required: false,
            default: () => {
                return {};
            } 
        },
        polygonDefault :{
            type : Object,
            required: false,
            default: () => {
                return {};
            } 
        },
        polygonHighlight :{
            type : Object,
            required: false,
            default: () => {
                return {};
            } 
        },
        polygonHover :{
            type : Object,
            required: false,
            default: () => {
                return {};
            } 
        },

        polygonDyeing: {
            type : Array,
            required: false,
            default: () => {
                return [];
            }
        },

        polygonSelect: {
            type : Boolean,
            required: false,
            default: false
        },



        textStyle : {
            type : Object,
            required: false,
            default: () => {
                return {};
            }
        },
        
        pointData: {
            type : Array,
            required: false,
            default: () => {
                return [];
            }
        },

        pointAutoSetFitView: {
            type : Boolean,
            required : false,
            default : false
        },
        
        satelliteIsShow: {
            type : Boolean,
            required: false,
            default: false
        },
    },
    created(){
        this.initMapConfig();
    },
    mounted(){
        let self = this;
        // step 1 注册鼠标滚动
        this.windowAddMouseWheel();

        // step 2 赋值多边形数据给地图组件
        this.polygonDatas = this.polygons;

        // step 3 赋值多边形样式
        this.polygonStyles = this.polygonStyle;

        // step 4 赋值多边形染色数据
        this.polygonDyeingArr = this.polygonDyeing;
        
        this.textStyles = this.textStyle;

        // step 4 判断是否已经实例化地图，并赋值对应层级数据给变量
        if(this.polygons && this.mapObj){
            self.assignMapHierarchy(this.polygons);
        }

    },

    watch:{
        polygons:{
            handler( newValue, oldValue ) {
                let self = this;
                // step 1 给多边形数据赋新数据
                self.polygonDatas = newValue;
                // console.log(newValue);
                
                if( self.polygonDatas.length  === 0 ){
                    // self.mapObj.clearMap();
                    let polygons = this.$refs.map.$$getAllOverlays( 'polygon' );
                    let texts = this.$refs.map.$$getAllOverlays( 'text' );
                    polygons.forEach ( function ( polygon, key ) {
                        self.mapObj.remove([polygon,texts[key]]);
                    });
                    return false;
                }

                if( !this.mapObj ){
                    return false;
                }

                // step 2 判断所有多边形父级ID是否是项目ID，移除父级非项目ID的多边形
                let polygons = this.$refs.map.$$getAllOverlays( 'polygon' );
                let texts = this.$refs.map.$$getAllOverlays( 'text' );
                polygons.forEach ( function ( polygon, key ) {
                    if( polygon.getExtData().parent_id != self.region_id ){
                        self.mapObj.remove([polygon,texts[key]]);
                    }
                });

                // step 3 将新数据赋值给当前层级
                self.assignMapHierarchy(newValue);

            },

            deep: true
        },
        polygonDyeing () {
            let self = this;
            self.polygonDyeingArr = self.polygonDyeing;
        },

        pointData(){
            this.pointDatas = this.pointData;
        },

        mapObj () {

        }
    },
    beforeUpdate(){
    },
    updated(){
        let self = this;
    },

    methods:{
        initMapConfig(){
            let mapConfig = {
                mapKey : this.mapConfig.mapKey || "4ffc625a75655e729a54f31f72362368",
                mapVersion : this.mapConfig.mapVersion || "1.4.10",
                center : this.mapConfig.center,
                mapStyle : this.mapConfig.mapStyle,
                features : this.mapConfig.features || ['bg','point'],
                zoom : this.mapConfig.zoom,
                zooms : this.mapConfig.zooms,
                resizeEnable : this.mapConfig.resizeEnable,
                style : this.mapConfig.style || {width:'1920px',height:'1080px'}
            }
            this.config = mapConfig;
        },

        checkPolygonSelectState () {
            /* let self = this;
            if( self.polygonSelect  === true ){
                return false;
            } */
        },

        /**
         * 地图操作事件
         */
        mapZoomstart ( component ) {
            this.lastZoom = component.$$getZoom();
        },
        mapZoomend ( component ) {
        },
        mapZoomchange ( component ) {
            let self = this;
            let zoom = self.mapObj.getZoom();
            if(zoom > this.config.zoom){
                self.restorePolygon();
            }
        },
        
        /*
         * 多边形点击事件
         */
        polygonClick( component ){
            let self = this;
            let polygon = component.polygon;

            // step 1 提交自定义事件给父组件
            self.$emit('polygonClick', component);

            // step 2 自适应层级显示最佳效果
            self.$refs.map.$$setFitView(polygon)            

            if( self.checkPolygonSelectState() === false) {
                return false;
            };

            // step 3 下钻 提交当前ID给父组件获取数据，监听并执行下钻
            let region_id = component.extData.region_id
            this.chooseRegion = region_id;
            self.$emit('getChildPolygon', region_id);


            // 判断初始层级是否存在数据，如果尚未存在数据，则赋值
            if(typeof self.mapHierarchyData[self.config.zoom] == 'undefined'){
                self.assignMapHierarchy(self.basePolygons, self.config.zoom);
            }
        },
        polygonMouseover( component ) {
            let self = this;
            self.$emit('polygonMouseover', component);
            
            let polygon = component.polygon;
            self.setPolygonStyle( polygon, self.polygonHover );
                        
        },
        polygonMouseout( component ) {
            let self = this;
            self.$emit('polygonMouseout', component);
            
            let polygon = component.polygon;
            self.setPolygonStyle( polygon, self.polygonDefault );
        },

        /**
         * 纯文本标签点击事件
         */
        textClick ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textClick', component);
            let textMarker = component.textMarker;
            let extData = textMarker.getExtData();

            let polygonComponent = self.$refs['polygon_'+extData.region_id][0];
            let polygon = polygonComponent.polygon;
            self.setPolygonStyle(polygon, self.polygonHighlight );

            let allPolygon = self.mapObj.getAllOverlays('polygon')
            allPolygon.forEach( function( item, key ) {
                if( item != polygon){
                    if( self.polygonDyeingArr.hasOwnProperty( key ) && typeof self.polygonDyeingArr[ key ]){
                        self.setPolygonStyle(item, self.polygonDyeingArr[ key ]);
                    }else{
                        self.setPolygonStyle(item, self.polygonNormal);
                    }
                }
            })


        },
        textDblclick ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textDblclick', component);
        },
        textMouseover ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textMouseover', component);
        },
        textMouseout ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textMouseout', component);
        },
        textRightclick ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textRightclick', component);
        },
        textmousedown ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textmousedown', component);
        },
        textMouseup ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textMouseup', component);
        },
        textTouchstart ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textTouchstart', component);
        },
        textTouchmove ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textTouchmove', component);
        },
        textTouchend ( component ) {
            let self = this;
            // step 1 提交自定义事件给父组件
            self.$emit('textTouchend', component);
        },


        /**
         * 海量点点击事件
         */
        pointClick( value ) {
            let self = this;
            self.$emit('pointClick', value);
            
        },
        pointMouseover( value ) {

        },

        /**
         * 设置多边形样式
         * @param polygon Object 多边形对象
         * @param type String 需要设置的颜色类型
         * @param options Object 自定义options
         */
        setPolygonStyle(polygon, options={}){
            let self = this;
            if( Object.keys( options ).length > 0 )
            {
                polygon.setOptions( options );
                return false;
            }
            /* if(typeof self.polygonStyle[type] === 'undefined') return;
            polygon.setOptions(self.polygonStyle[type]); */
        },

        /**
         * windows鼠标滚轮事件
         */
        windowAddMouseWheel() {
            let self = this;
            var scrollFunc = function (e) {
                e = e || window.event;
                if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
                    if (e.wheelDelta > 0) { //当滑轮向上滚动时
                        // alert("滑轮向上滚动");
                        // console.log(self.mapObj.getZoom());
                    }
                    if (e.wheelDelta < 0) { //当滑轮向下滚动时
                        if(self.mapObj.getZoom() == self.config.zoom){
                            self.restorePolygon();
                        }
                    }
                } else if (e.detail) {  //Firefox滑轮事件
                    if (e.detail> 0) { //当滑轮向上滚动时
                        // alert("滑轮向上滚动");
                    }
                    if (e.detail< 0) { //当滑轮向下滚动时
                        if(self.mapObj.getZoom() == self.config.zoom){
                            self.restorePolygon();
                        }
                    }
                }
            };

            //给页面绑定滑轮滚动事件
            if (this.$el.addEventListener) {
                this.$el.addEventListener('DOMMouseScroll', scrollFunc, false);
            }
            //滚动滑轮触发scrollFunc方法
            this.$el.onmousewheel = this.$el.onmousewheel = scrollFunc;
        },

        /**
         * 恢复多边形
         */
        restorePolygon () {
            let self = this;
            
            if( self.checkPolygonSelectState() === false) {
                return false;
            };

            let zoom = self.mapObj.getZoom();
            let allPolygon = self.mapObj.getAllOverlays('polygon')
            let allText = self.mapObj.getAllOverlays('text')

            /**
             * step 1 判断是缩小还是放大
             * 当前层级小于上次层级 缩小
             * 当前层级大于上次层级 放大
             * 当前层级等于页面初始层级 触发该操作即为缩小，清除非基础多边形
             */
            if(zoom < self.lastZoom)
            {
                // 缩小
                // step 1 移除大于当前层级的所有数据
                for( let key in self.mapHierarchyData) {
                    if(key > zoom){
                        self.mapHierarchyData[key].forEach( function( item, m ) {
                            // 判断层级数据中是否包含基础数据，不包含的予以移除
                            if( !self.basePolygons.includes( item )){
                                allPolygon.forEach( function( polygon, n ) {
                                    if( polygon.getExtData().region_id == item.region_id ){
                                        self.mapObj.remove([polygon,allText[n]]);
                                    }
                                } )
                            }
                        } )
                        self.mapHierarchyData[key] = [];
                    }
                }

                // step 2 将当前层级数据赋值给多边形组件
                self.polygonDatas = self.mapHierarchyData[zoom];

            }
            
            if( zoom == self.config.zoom ) {
                let allPolygon = self.mapObj.getAllOverlays('polygon');
                let allText = self.mapObj.getAllOverlays('text');
                
                if( typeof self.mapHierarchyData[zoom] == 'undefined'){
                    return
                }
                self.mapHierarchyData[zoom].forEach( function ( item, key ) {
                    if( !self.basePolygons.includes( item )) {
                        allPolygon.forEach( function( polygon, n ) {
                            if( polygon.getExtData().region_id == item.region_id ){
                                self.mapObj.remove([polygon,allText[n]]);
                            }
                        } )

                    }
                })
                self.mapHierarchyData[zoom] = self.basePolygons;
                self.polygonDatas = self.mapHierarchyData[zoom];
            }
           
        },
        /**
         * 给地图显示层级赋值
         */
        assignMapHierarchy(value, zoom = null){
            let self = this;
            if(zoom == null){
                zoom = self.mapObj.getZoom();
            }
            self.mapHierarchyData = {...self.mapHierarchyData, ...{[zoom] : value}}
        },

    }

}
</script>
