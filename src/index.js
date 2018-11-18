import Vue from 'vue';
import BsComAMap from '@xinguang-data/bs-com-amap';
Vue.use(BsComAMap);

import bsAmap from './lib/components/bs-amap.vue';


let components = [
    bsAmap,
];

let BsAmap = {
}

BsAmap.install = Vue => {
    if ( BsAmap.installed ) return;

    components.map( cmp => {
        // register components;
        Vue.component( cmp.name, cmp );
    } )
}

export default BsAmap;