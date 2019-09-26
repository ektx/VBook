<template>
  <div class="vue-md-theme">
    <div class="group">
      <h1>黑白</h1>
      <p>白昼与暗夜模式效果。</p>
      <div class="color-list">
        <ul v-for="(item, key) in data" :key="key" :class="key">
          <li 
            v-for="color in item" 
            :key="color" 
            :style="getStyle(color)"
            @click="copyVarColor(color)"
          >
          </li>
        </ul>
      </div>
    </div>
    <div class="group">
      <h1>常用模块色</h1>
      <p>常用模块色基本不随系统变换颜色。</p>

      <div class="color-card-box">
        <div 
          class="color-card" 
          v-for="name in normalColor" 
          :key="name"
        >
          <div class="header" :style="getStyle(`--${name}`)">
            <h3>{{name}}</h3>
            <p>var(--{{name}})</p>
          </div>
          <ul class="footer">
            <li :style="getStyle(`--${name}Hover`)"></li>
            <li :style="getStyle(`--${name}Active`)"></li>
          </ul>
        </div>
      </div>
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
      grayArr: [],
      normalColor: [
        'link',
        'success',
        'warn',
        'error'
      ]
    };
  },
  mounted() {
    this.data = this.stripScript(this.js)
    this.getGrayList()
    this.data.light.unshift(...this.grayArr)
    this.data.dark.unshift(...this.grayArr)
    console.log(this.data)
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
    },

    getGrayList () {
      for (let i = 0; i < 100; i+= 5) {
        this.grayArr.push(`--gray${i}`)
      }
    },

    copyVarColor (color) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(color)
          .then(() => {
            console.log("Text copied to clipboard:", color);
          })
          .catch(err => {
            console.error(`Could not copy text: ${err}`);
          });
      } else {
        alert('升级你的浏览器！')
      }
    }
  }
};
</script>

<style lang="less">
.vue-md-theme {
  .color-list {
    display: flex;
    flex-direction: column;
    
    ul {
      display: flex;
      flex-direction: row;
      padding: 20px 30px;
      color: #333;

      li {
        flex: 1;
        height: 3em;
        font-size: 12px;
        cursor: pointer;
        border: 2px solid transparent;
        box-sizing: border-box;

        &:hover {
          border-color: var(--link);
        }
      }

      &.light {
        background: #fff;
      }

      &.dark {
        background: #000;
      }
    }
  }

  .color-card-box {
    display: flex;
  }

  .color-card {
    flex: 1;
    border-radius: 3px;
    overflow: hidden;

    .header {
      height: 70px;
      padding: 15px 20px;
      box-sizing: border-box;

      h3 {
        font-size: 16px;
        font-weight: 400;
        color: #fff;
        text-transform: capitalize;
        opacity: .8;
      }

      p {
        font-size: 12px;
        line-height: 18px;
        color: #FFF;
        opacity: .7;
      }
    }

    .footer {
      display: flex;
      height: 30px;

      li {
        flex: 1;
      }
    }

    & + .color-card {
      margin-left: 10px;
    }
  }
}
</style>