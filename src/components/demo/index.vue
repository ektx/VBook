<template>
    <div class="demo-com">
        <div class="display-box"></div>
        <div class="source-box">
            <div class="source-box--main" :style="style">
                <slot/>
            </div>
            <div class="source-box--footer" @click="show = !show">
                <span>查看代码</span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'demo-com',
    props: {
        xml: {
            type: String,
            default: ''
        },
        js: {
            type: String,
            default: ''
        },
        css: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            show: false,
            style: {
                height: 0
            },
            codeEl: null
        }
    },
    watch: {
        show (val) {
            if (val) {
                let h = this.codeEl.scrollHeight
                this.style.height = h + 'px'
            } else {
                let h = this.codeEl.scrollHeight
                this.style.height = `${h}px`

                requestAnimationFrame(() => {
                    this.style.height = 0
                })
            }
        }
    },
    computed: {
        html () {
            return this.xml.replace(/&#123;/g, '{')
        }
    },
    mounted () {
        this.codeEl = this.$el.querySelector('.source-box--main')
        this.codeEl.addEventListener('transitionend', this.removeStyle)

        this.init()
    },
    methods: {
        // 获取 script 部分内容
        stripScript (content) {
            let result = content.match(/<(script)>([\s\S]+)<\/\1>/)
            result = result && result[2] ? result[2].trim() : ''

            if (result) {
                return Function(`return ${result.substr(15)}`)()
            } else {
                return {}
            }
        },
        // 获取样式内容
        stripStyle (content) {
            let result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/)
            return result && result[2] ? result[2].trim() : ''
        },
        // 获取 template 内容
        stripTemplate(content) {
            content = content.trim()
            if (!content) {
                return content
            }
            content = content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim()

            return content.replace(/template>/g, 'div>')
        },

        init () {
            let { data } = this.stripScript( this.js )

            let Com = Vue.extend({
                template: this.stripTemplate( this.html ),
                data
            })

            // https://cn.vuejs.org/v2/api/#vm-mount
            // 渲染文档后
            let component = new Com().$mount()
            // 挂载
            this.$el.querySelector('.display-box').appendChild(component.$el)
        },

        removeStyle () {
            if (this.show) this.style.height = ''
        }
    },
    destroyed () {
        this.codeEl.removeEventListener('transitionend', this.removeStyle)
    }
}
</script>

<style lang="less">
.demo-com {
    margin: 2em 0;
    border-radius: 3px;
    border: 1px solid #ddd;

    .display-box {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .source-box {
        .source-box--main {
            overflow: hidden;
            background-color: #fafafa;
            transition: height .35s ease-in-out;

            pre, code {
                background: transparent;
            }
        }

        .source-box--footer {
            margin-top: -1px;
            font-size: 12px;
            color: #666;
            line-height: 3em;
            text-align: center;
            border-top: 1px solid #ddd;
            transition: color .3s ease-in-out;
            cursor: pointer;

            &:hover {
                color: #09f;
            }
        }

        blockquote {
            margin: 10px;
            padding: 5px 10px;
            background: #fff;
            border-radius: 3px;
            border: 1px solid #eee;
        }
    }
}
</style>
