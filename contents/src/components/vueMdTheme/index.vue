<template>
  <div class="vue-md-theme">
    <h1>vue theme</h1>
    <div class="color-list">
      <ul v-for="(item, key) in data" :key="key" :class="key">
        <li v-for="color in item" :key="color" :style="getStyle(color)">
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
export default {
  name: "vue-md-theme",
  props: {
    js: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    this.data = this.stripScript(this.js)
  },
  methods: {
    // 获取 script 部分内容
    stripScript(content) {
      let result = content.match(/<(script)>([\s\S]+)<\/\1>/);
      result = result && result[2] ? result[2].trim() : "";

      if (result) {
        return Function(`return ${result}`)();
      } else {
        return {}
      }
    },

    getStyle (val) {
      return {
        backgroundColor: `var(${val})`
      }
    }
  }
};
</script>

<style lang="less">
.vue-md-theme {
  .color-list {
    display: flex;
    
    ul {
      padding: 20px 30px;
      color: #333;

      li {
        height: 3em;
        width: 5em;
        font-size: 12px;
        padding: 0 20px;
      }

      &.light {
        background: #fff;
      }

      &.dark {
        background: #000;
      }
    }
  }
}
</style>