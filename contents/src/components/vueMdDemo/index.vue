<script>
import mkIt from "markdown-it";
import Prism from "prismjs"
import mkItContainer from "markdown-it-container";
import mkItSub from "markdown-it-sub";
import mkItSup from "markdown-it-sup";
import mkItIns from "markdown-it-ins";
import mkItToc from "./md-toc.js";
import mkItVue from "./md-vue.js";
import demo from "../vueMdBoard";
import demoTheme from "../vueMdTheme";
import 'prismjs/themes/prism.css'

export default {
  name: "v-markdown-it",
  components: {
    demo,
    demoTheme
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    let md = new mkIt({
      linkify: true,
      html: true,
      typographer: true,
      highlight(str, lang) {
        if (lang) {
          try {
            let code = Prism.highlight(str, Prism.languages[lang], lang)

            code = code.replace(/<[^>]+>&amp;#123;/g, '<span>{')

            return `<pre class="language-${lang}"><code>${code}</code></pre>`
          } catch (__) {}
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
      }
    })
      .use(mkItVue)
      .use(mkItContainer, "warning", {
        validate(params) {
          return params.trim() === "warning";
        },
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return `<div class="vbook-warning-box">`;
          }
          return `</div>`;
        }
      })
      .use(mkItContainer, "error", {
        validate(params) {
          return params.trim() === "error";
        },
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return `<div class="vbook-error-box">`;
          }
          return `</div>`;
        }
      })
      .use(mkItToc, {
        anchorLinkSymbol: ""
      })
      .use(mkItSub)
      .use(mkItSup)
      .use(mkItIns);

    return {
      md
    };
  },
  computed: {
    HTML() {
      let html = `<div class="markdown-it-com">${this.md.render(this.value)}</div>`;

      html = html.replace('<p><ul class="markdownIt-TOC">', '<ul class="markdownIt-TOC">')

      let { render, staticRenderFns } = this.$compile(html);

      // staticRenderFns belong into $options,
      // appearantly
      this.$options.staticRenderFns = [];

      // clean the cache of static elements
      // this is a cache with the results from the staticRenderFns
      this._staticTrees = [];

      // Fill it with the new staticRenderFns
      for (let i in staticRenderFns) {
        //staticRenderFns.push(res.staticRenderFns[i]);
        this.$options.staticRenderFns.push(staticRenderFns[i]);
      }

      return render;
    }
  },
  render(h) {
    return this.HTML();
  }
};
</script>

<style lang="less">
@import url("./layout.less");
</style>