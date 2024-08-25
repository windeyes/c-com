<template>
    <div :style="comStyle" :class="`chen-icon-${type}`">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {iconProps} from './icon'
// 此处的name直接决定了.vue文件中使用哪个标签名
defineOptions({
    name:'CIcon'
})
const props = defineProps(iconProps)
const comStyle = computed(()=>{
    return {
        ...(props.color ? {color:props.color}:{}),
        ...(props.size ? {fontSize:props.size+'px'}:{}),
    }
})
</script>

<style scoped>

</style>