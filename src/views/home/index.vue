<template>
    <div class="home-view">
        <header>

        </header>
        <main>
            <MarkdownIt :value="inner"/>
        </main>
    </div>
</template>

<script>
import MarkdownIt from '@/components/markdownIt'

export default {
    name: "home",
    components: {
        MarkdownIt
    },
    data() {
        return {
            inner: '# hello'
        }
    },
    mounted () {
        this.$axios({
            url: '/doc/layer.md',
            method: 'GET'
        }).then(res => {
            this.inner = res.data
        })
    },
    methods: {
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
        height: 60px;
        background: #fff;
        border-bottom: 1px solid #ddd;

        @supports (backdrop-filter: blur(5px)) {
            background-color: rgba(255, 255, 255, .7);
            backdrop-filter: blur(5px);
        }
    }

    & > main {
        margin: 60px 0 0;
    }
}
</style>
