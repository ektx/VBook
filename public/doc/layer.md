# Layer 弹层

## 这是说明1
::: demo 
```html
<template>
    <button @click="open = !open">Open Layer</button>
    <vc-layer :show.sync="open"></vc-layer>
</template>

<script>
export default {
    data() {
        return {
            open: false
        }
    }
};
</script>
```
:::

## 这是说明2

::: demo
```html
<template>
    <button @click="open = !open">Open Layer2</button>
    <vc-layer :show.sync="open"></vc-layer>
</template>

<script>
export default {
    data() {
        return {
            open: false
        }
    }
};
</script>
```
:::

## 这是说明3

::: demo
```html
<template>
    <button @click="open = !open">Open Layer3</button>
    <vc-layer :show.sync="open"></vc-layer>
</template>

<script>
export default {
    data() {
        return {
            open: false
        }
    }
};
</script>
```
:::