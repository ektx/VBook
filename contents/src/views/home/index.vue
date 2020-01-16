<template>
  <div class="home-view">
    <header>
      <div class="logo-box">
        <img v-if="logoUrl" :src="logoUrl" />
        <h1>{{info.title || 'VBook'}}</h1>
      </div>
      <div class="search-box">
        <!-- <input type="text"> -->
      </div>
      <div class="toggle-theme-box">
        <i @click="toggleThemeEvt"></i>
      </div>
    </header>
    <section class="content">
      <aside>
        <Navs :value="aside" @change="changeEvt" />
      </aside>
      <main>
        <MarkdownIt :value="inner" />
      </main>
    </section>
  </div>
</template>

<script>
import MarkdownIt from "../../components/vueMdDemo";
import Navs from "../../components/navs";
import info from "../../../index.js";

export default {
  name: "home",
  components: {
    MarkdownIt,
    Navs
  },
  data() {
    return {
      inner: "# VBook\n请选择菜单内容",
      navs: [],
      info
    };
  },
  computed: {
    aside() {
      return this.info.aside || [];
    },
    logoUrl() {
      if (Reflect.has(this.info, "logo")) {
        return this.info.logo;
      } else {
        return "/logo.svg";
      }
    }
  },
  methods: {
    changeEvt(nav) {
      if ("file" in nav) this.getFile(nav.file);
    },

    getFile(file) {
      this.inner = "";

      this.$axios({
        url: `${file}.md`,
        method: "GET"
      }).then(res => {
        this.inner = this.safeStr(res.data);
      });
    },

    safeStr(str) {
      let result = "";
      let leftCode = "{".charCodeAt(0);

      for (let i = 0, l = str.length; i < l; ) {
        if (
          str[i].charCodeAt(0) === leftCode &&
          str[i + 1].charCodeAt(0) === leftCode &&
          str[i + 2].charCodeAt(0) !== leftCode
        ) {
          result += "&#123;&#123;";
          i += 2;
        } else {
          result += str[i];
          i++;
        }
      }

      return result;
    },

    toggleThemeEvt() {
      document.querySelector("#app").classList.toggle("dark-scheme");
    }
  }
};
</script>

<style lang="less" scoped>
.home-view {
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 30px;
    background: #fff;
    border-bottom: 1px solid var(--gray85);
    transition: 
      background-color 0.3s ease-in-out,
      border-color .3s ease-in-out;

    @supports (backdrop-filter: blur(5px)) {
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(5px);
    }

    .DARK_header {
      background-color: var(--gray85);
      @supports (backdrop-filter: blur(5px)) {
        background-color: rgba(33, 33, 33, 0.8);
        backdrop-filter: blur(5px);
        border-bottom: transparent;
      }
    }

    .dark-scheme & {
      .DARK_header;
    }

    @media (prefers-color-scheme: dark) {
      .DARK_header;
    }

    .toggle-theme-box {
      i {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 100%;
        cursor: pointer;
        background-color: var(--gray20);
      }
    }
  }

  .logo-box {
    flex: 1;

    img {
      display: inline-block;
      width: 24px;
      margin: 0 10px 0 0;
      vertical-align: top;
    }
    h1 {
      display: inline-block;
      color: var(--gray10);
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    & > aside {
      padding: 80px 0 20px;
      height: 100vh;
      width: 300px;
      overflow: auto;
      box-sizing: border-box;
    }

    & > main {
      flex: 1;
      height: 100vh;
      padding: 60px 20px 20px;
      overflow: auto;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }
  }
}
</style>
