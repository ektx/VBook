<script>
import mkIt from 'markdown-it'
import hljs from 'highlight.js'
import mkItContainer from 'markdown-it-container'
import 'highlight.js/styles/atom-one-light.css'
import demo from '../demo'

export default {
    name: 'v-markdown-it',
    components: {
        demo
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data () {
        let md = new mkIt({
            highlight (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str, true).value
                    } catch (__) {}
                }
                return ''
            }
        }).use(mkItContainer, 'demo', {
            validate (params) {
                return params.trim() === 'demo'
            },
            render (tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    return `<demo>`
                }
                return `</demo>`
            }
        })
        return {
            md
        }
    },
    computed: {
        HTML () {
            let html = `<div class="markdown-it-com">${this.md.render(this.value)}</div>`
            let {render, staticRenderFns} = this.$compile(html)

            // staticRenderFns belong into $options, 
            // appearantly
            this.$options.staticRenderFns = []
            
            // clean the cache of static elements
            // this is a cache with the results from the staticRenderFns
            this._staticTrees = []
            
            // Fill it with the new staticRenderFns
            for (let i in staticRenderFns) {
                //staticRenderFns.push(res.staticRenderFns[i]);
                this.$options.staticRenderFns.push(staticRenderFns[i])
            } 

            return render
        }
    },
    render (h) {
        return this.HTML()
    }
}
</script>

<style>

</style>
