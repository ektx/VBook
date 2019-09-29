<template>
    <div class="demo-com">
        <div class="display-box"></div>
        <div class="source-box">
            <div class="source-box--main" :style="style">
                <slot/>
            </div>
            <div class="source-box--footer" @click="show = !show">
                <span>{{ show ? '收起' : '查看代码'}}</span>
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
                return {
                    data () {
                        return {}
                    },
                    watch: {},
                    methods: {},
                    mounted () {}
                }
            }
        },
        // 获取样式内容
        setStyle () {
            let cssInner = this.css.match(/<(style)\s*>([\s\S]+)<\/\1>/)
            cssInner = cssInner && cssInner[2] ? 
                cssInner[2].trim() : ''

            let style = document.createElement('style')
            this.$el.appendChild(style)

            style.type = 'text/css'
            style.appendChild(
                document.createTextNode(cssInner)
            )

            // return result && result[2] ? result[2].trim() : ''
        },
        // 获取 template 内容
        stripTemplate(content) {
            content = content.trim()
            if (!content) {
                return content
            }
            content = content.replace(/<(script|style)[\s\S]+<\/\1>/g, '')
            content = content.split('\n')
            // 除去前后 template
            content = content.slice(1, content.length-1)

            return `<div>${content.join('')}</div>`
        },

        init () {
            let { data, methods, mounted, watch } = this.stripScript( this.js )
            let template = this.stripTemplate( this.html )

            let Com = Vue.extend({
                router: this.$router,
                template,
                data,
                watch,
                methods,
                mounted
            })


            // https://cn.vuejs.org/v2/api/#vm-mount
            // 渲染文档后
            let component = new Com().$mount()
            // 挂载
            this.$el.querySelector('.display-box').appendChild(component.$el)

            this.setStyle()
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
    border: 1px solid var(--gray75);
    transition: border-color .3s ease-in-out;

    .display-box {
        padding: 10px;
        border-radius: 3px 3px 0 0;
        border-bottom: 1px solid var(--gray75);
        background-color: #fff;
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
            position: sticky;
            bottom: -20px;
            margin-top: -1px;
            font-size: 12px;
            color: #666;
            line-height: 3em;
            text-align: center;
            border-top: 1px solid var(--gray75);
            background-color: #fff;
            border-radius: 0 0 3px 3px;
            cursor: pointer;
            transition: 
                color .3s ease-in-out,
                background-color .3s ease-in-out;

            .DARK_source-box--footer {
                color: #aaa;
                background-color: var(--gray75);
            }

            .dark-scheme & {
                .DARK_source-box--footer
            }

            @media (prefers-color-scheme: dark) {
                .DARK_source-box--footer
            }

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
