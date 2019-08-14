<template>
    <ul class="navs-com">
        <li v-for="nav in data" :key="nav.label">
            <div 
                :class="['nav-header', {'active-link': nav.active}, {'is-link': !nav.children}]" 
                @click="clickEvt(nav)"
            >
                <i v-for="i in level" :key="i"></i>
                {{nav.label}}
            </div>
            <div class="nav-children" v-if="nav.children">
                <nav-list :data="nav.children" :level="level+1"/>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'nav-list',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        // 当前层级
        level: {
            type: Number,
            default: 1
        }
    },
    mounted () {
        // 如果本地有保存之前的菜单
        if (localStorage.currentNav) {
            let localNav = JSON.parse(localStorage.currentNav)

            this.data.forEach(nav => {
                if (
                    nav.label === localNav.label &&
                    nav.file === localNav.file
                ) {
                    this.clickEvt(nav)
                }
            }) 
        }
    },
    inject: [
        'emitParent',
        'setCurrentNav'
    ],
    methods: {
        /**
         * 点击事件
         * 
         * @param {Object} nav 点击的菜单
         */
        clickEvt (nav) {
            // 如果有文件 
            if ('file' in nav) {
                this.setCurrentNav(nav)
            }
            // 通知父级更新菜单
            this.emitParent(nav)
        }
    }
}
</script>
<style lang="less">
.navs-com {
    font-size: 14px;

    .nav-header {
        color: #aaa;
        line-height: 2.5em;
        border-left: 3px solid transparent;
        background-color: transparent;
        pointer-events: none;

        &.is-link {
            color: #333;
            cursor: pointer;
            pointer-events: auto;
            transition: color .35s ease-in-out;
       
            &.active-link {
                font-weight: bold;
                color: #42b983;
                border-left-color: #42b983;
            }

            &:hover {
                color: #42b983;
            }
        }


        i {
            display: inline-block;
            width: 1em;
            height: 1em;
        }
    }
}
</style>

