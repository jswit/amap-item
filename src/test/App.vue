<template>
    <div id="app">
        <bs-amap
            :region_id="region_id"
            :mapConfig="mapConfig"
            :polygons="polygons"
            :basePolygons="basePolygons"
            :polygonStyle="polygonStyle"

            @getChildPolygon="getChildPolygon"
            @getOwnPolygon="getOwnPolygon"
        ></bs-amap>
    </div>
</template>

<script>
import Vue from "vue";
import BsAmap from "../index.js"
Vue.use(BsAmap);

import axios from 'axios'
axios.defaults.withCredentials = true;

export default {
    name: 'app',
    data:function(){
        return {
            region_id: "5ba09b3e2ac44c33a81771ff",
            mapConfig : null,
            polygons : [],
            basePolygons: [],
            polygonStyle : null,
            childPolygons : null,
            polygonStore : {},  // 多边形数据存储
        }
    },
    created(){
        this.mapConfig = {
            features : ['bg'],
            zoom : 10,
            zooms: [10,16],
            center : [120.643809, 29.776266 ],
            isRetainBasePolygon : true,
        };

        this.polygonStyle = {
            "normal": {
                "strokeStyle": "solid",
                "strokeColor": "#3366cc",
                "strokeOpacity": 1,
                "strokeWeight": 1,
                "zIndex": 112,
                "bubble": true
            },
            "highlight": {
                "strokeStyle": "solid",
                "strokeColor": "#50E3C2",
                "strokeOpacity": 1,
                "strokeWeight": 2,
                "fillColor": "#50E3C2",
                "fillOpacity": 0.4,
                "zIndex": 114,
                "bubble": true

            },
            "hover": {
                "strokeStyle": "dashed",
                "strokeColor": "#F5A623",
                "strokeOpacity": 1,
                "strokeWeight": 4,
                "zIndex": 110,
                "bubble": true

            },
            "default": {
                "strokeStyle": "solid",
                "strokeColor": "#3366cc",
                "strokeOpacity": 1,
                "strokeWeight": 1,
                "zIndex": 112,
                "bubble": true

            }
        }
    },
    async mounted(){
        this.basePolygons = this.polygons = await this.getPolygonData(this.region_id);
    },
    
    methods:{
        /**
         * 获取地图边界数据
         * @param area_number 地区编号 例：571
         * @param type 
         */
        async getPolygonData(region_id,type='child'){
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
         * 
         */
        async getChildPolygon( region_id ){
            let childPolygons = await this.getPolygonData(region_id, "child");
            if( Object.keys(childPolygons).length === 0 ){
                return false;
            }
            this.polygons = [ ...this.basePolygons, ...childPolygons ];
        },
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
