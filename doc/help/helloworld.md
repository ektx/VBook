# Vue 基础

::: demo

> 注意：目前样式不支持预处理器哟！

```html
<template>
    <div>
        <h1 class="my-class">{{msg}}</h1>
        <input type="text" v-model="msg">
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: 'hello world!'
        }
    }
}
</script>

<style>
.my-class {
    color: red;
}
</style>
```
:::

