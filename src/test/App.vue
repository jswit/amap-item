<template>
    <div id="app">
        <bs-amap
            :region_id="region_id"
            :mapConfig="mapConfig"
            :polygons="polygons"
            :basePolygons="basePolygons"
            
            :polygonNormal="polygonNormal"
            :polygonDefault="polygonDefault"
            :polygonHighlight="polygonHighlight"
            :polygonHover="polygonHover"

            
            :polygonDyeing="polygonDyeing"

            :textStyle="textStyle"

            :pointData="sceneData"
            :satelliteIsShow="satelliteIsShow"

            @getChildPolygon="getChildPolygon"
            @getOwnPolygon="getOwnPolygon"
        >

            <c-window
                :style="{ zIndex : 999 }"
                :title="`场景展示`"
                
            >
                <c-switch 
                    :value="satelliteIsShow"
                    @input="satelliteIsSwitch"
                ></c-switch>
                
            </c-window>
        
        </bs-amap>
        
    </div>
</template>

<script>
import Vue from "vue";
import BsAmap from "../index.js"
import cmps from '@xinguang-data/bs-com-common'
Vue.use(BsAmap);
Vue.use(cmps);

import axios from 'axios'
axios.defaults.withCredentials = true;

export default {
    name: 'app',
    data:function(){
        return {
            // 基础变量
            region_id: "5ba09b3e2ac44c33a81771ff",  // 项目区域ID
            mapConfig : null,   // 地图配置

            // 多边形变量
            polygons : [],      // 所有多边形数据
            basePolygons: [],   // 初始多边形

            polygonNormal : {},
            polygonDefault : {},
            polygonHighlight : {},
            polygonHover : {},

            polygonStore : {},  // 多边形数据存储
            polygonDyeing : [], // 多边形染色数据

            // 纯文本标注变量
            textStyle : {},


            sceneStore : {},    // 场景数据存储
            sceneData : null,
            sceneSwitch : false,

            // 卫星显示开关
            satelliteIsShow : false,    // 是否显示卫星图层
        }
    },
    created(){
        this.mapConfig = {
            features : ['bg'],
            zoom : 10,
            zooms: [10,18],
            center : [120.643809, 29.776266 ],
            isRetainBasePolygon : true,
        };

        this.polygonNormal = {
            "strokeStyle": "solid",
            "strokeColor": "#129999",
            "strokeOpacity": 1,
            "strokeWeight": 1,
            "fillColor": "",
            "fillOpacity": 0.15,
            "zIndex": 112,
            "bubble": true
        };
        this.polygonDefault = {
            "strokeStyle": "solid",
            "strokeColor": "#129999",
            "strokeOpacity": 1,
            "strokeWeight": 1,
            "zIndex": 112,
            "bubble": true
        };
        this.polygonHighlight = {
            "strokeStyle": "solid",
            "strokeColor": "#129999",
            "strokeOpacity": 1,
            "strokeWeight": 2,
            "fillColor": "#129999",
            "fillOpacity": 0.4,
            "zIndex": 114,
            "bubble": true
        };
        this.polygonHover = {
            "strokeStyle": "dashed",
            "strokeColor": "#F19349",
            "strokeOpacity": 1,
            "strokeWeight": 4,
            "zIndex": 115,
            "bubble": true
        };

        let polygonDyeing = [
            {
                fillColor : "red",
            },
            {
                fillColor : "blue",
            },
            {
                fillColor : "green",
            },
            {
                fillColor : "yellow",
            },
            {
                fillColor : "black",
            },
            {
                fillColor : "red",
            },
        ];
        // this.polygonDyeing = polygonDyeing;
        
    },
    async mounted(){
        this.basePolygons = this.polygons = await this.getPolygonData(this.region_id);
    },
    
    methods:{
        async satelliteIsSwitch ( value ) {

            console.log(value);
            this.satelliteIsShow = value;
            /* this.sceneSwitch = value;
            if(value == true) {
                this.sceneData = await this.getSceneData(this.region_id, ['5bd2b7b82ac44c5d84e411c3', '5bd2b7b82ac44c5d84e411c4'])
            }else{
                this.sceneData = [];
            } */
        },
        
        /**
         * 获取场景类型
         */
        async getSceneType ( ) {
            let self = this;
            let url = 'http://vpn.zhaohu.co:2009/scene-type';
            let result = null;

            await axios.get( url ).then ( response => {
                let res = response.data.data
                result = res;
            }).catch(error=>{

            }).finally(()=>{});

            return result;
        },
        
        /**
         * 获取场景海量点数据
         */
        async getSceneData( region_id, scene_id) {
            let self = this;
            let url = 'http://vpn.zhaohu.co:2009/scene_data/query'
            let result = null;

            await axios.get( url, {
                params : {
                    region_id : region_id,
                    scene_id : scene_id
                },
            }).then ( response => {
                let res = response.data.data
                result = res;
            }).catch(error=>{

            }).finally(()=>{});

            return result;
        },

        /**
         * 获取地图边界数据
         * @param area_number 地区编号 例：571
         * @param type 
         */
        async getPolygonData( region_id, type='child' ){
            let self = this;
            let url = 'http://vpn.zhaohu.co:2009/border/find_new_child_regions?region_id='+region_id
            let result = null;
            if ( self.polygonStore.hasOwnProperty(region_id) === true) {
                if(type == 'child'){
                    result = this.polygonStore[region_id].child_borders
                }
                if(type == 'own'){
                    result = this.polygonStore[region_id].own_border;
                }
                return result;
            }

            await axios.get( url ).then ( response => {
                let res = response.data.data
                self.polygonStore = {...self.polygonStore, ...{[region_id] : res }};
                if(type == 'child'){
                    result = res.child_borders
                }
                if(type == 'own'){
                    result = res.own_border;
                }
            }).catch(error=>{

            }).finally(()=>{});

            return result;
        },

        /**
         * 获取区域下级多边形数据
         * @param region_id 区域ID
         */
        async getChildPolygon( region_id ){
            let childPolygons = await this.getPolygonData(region_id, "child");
            if( Object.keys(childPolygons).length === 0 ){
                return false;
            }
            this.polygons = [ ...this.basePolygons, ...childPolygons ];
        },
        
        /**
         * 获取区域自己多边形数据
         * @param region_id 区域ID
         */
        async getOwnPolygon( region_id ){
            /* let ownPolygon =  await this.getPolygonData(region_id, "own");
            if( Object.keys(ownPolygon).length === 0 ){
                return false;
            }
            this.polygons = [ ...this.basePolygons, ...ownPolygon ]; */

        },
    },
    computed:{
        changePolygon(){
        }
    },

}
</script>

<style>
*{
  margin:0;
  padding:0;
}
</style>
