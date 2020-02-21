<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import url('./assets/css/reset-1.5.0.css');
@import url('./assets/css/vtheme.less');

html {
  background-color: var(--gray100);
}

#app {
  transition: background-color .4s ease-in-out;
}
.dark-scheme {
  background-color: var(--gray80);
}
</style>
