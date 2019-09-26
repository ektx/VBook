<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import url('./assets/css/reset-1.5.0.css');
@import url('./assets/css/theme.less');
// 这里可以添加你使用库的未编译样式
@import url('../../src/styles/index.less');

html {
  background-color: var(--gray100);
}

#app {
  transition: background-color .4s ease-in-out;
}
.dark {
  background-color: var(--gray80);
}
</style>
