<template>
    <div class="home-view">
        <header>
            <div class="logo-box">
                <img src="/logo.svg" alt="VBook">
                <h1>VBook</h1>
            </div>
            <div class="search-box">
                <input type="text">
            </div>
        </header>
        <section class="content">
            <aside>
                <Navs :value="navs" @change="changeEvt"/>
            </aside>
            <main>
                <MarkdownIt :value="inner"/>
            </main>
        </section>
    </div>
</template>

<script>
import MarkdownIt from '@/components/markdownIt'
import Navs from '@/components/navs'
import navs from '@/navs.js'

export default {
    name: "home",
    components: {
        MarkdownIt,
        Navs
    },
    data() {
        return {
            inner: '# VBook\n请选择菜单内容',
            navs
        }
    },
    mounted () {
        
    },
    methods: {
        changeEvt (nav) {
            if ('file' in nav)
                this.getFile(nav.file)
        },

        getFile (file) {
            this.$axios({
                url: `/${file}.md`,
                method: 'GET'
            }).then(res => {
                this.inner = this.safeStr( res.data )
            })
        },

        safeStr (str) {
            let result = ''
            let leftCode = '{'.charCodeAt(0)
            
            for (let i = 0, l = str.length; i < l;) {
                if (
                    str[i].charCodeAt(0) === leftCode &&
                    str[i +1].charCodeAt(0) === leftCode &&
                    str[i +2].charCodeAt(0) !== leftCode
                ) {
                    result += '&#123;&#123;'
                    i += 2
                } else {
                    result += str[i]
                    i++
                }
            }

            return result
        }
    }
};
</script>

<style lang="less">
.home-view {
    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        height: 60px;
        padding: 0 30px;
        background: #fff;
        border-bottom: 1px solid #ddd;

        @supports (backdrop-filter: blur(5px)) {
            background-color: rgba(255, 255, 255, .7);
            backdrop-filter: blur(5px);
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
            color: #273849;
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
