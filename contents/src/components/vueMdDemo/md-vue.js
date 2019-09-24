export default function vue_plugin(md, name, options) {

    function render (tokens, idx, opts, env, self) {
        if (tokens[idx].nesting === 1) {
            tokens[idx].attrPush(['xml', tokens[idx].$template])
            tokens[idx].attrPush(['js', tokens[idx].$js])
            tokens[idx].attrPush(['css', tokens[idx].$css])
            tokens[idx].attrPush(['key', Date.now()])

            return self.renderToken(tokens, idx, opts, env, self) 
        } else {
            
            return self.renderToken(tokens, idx, opts, env, self)
        }
    }

    function container (state, startLine, endLine, slient) {
        let start = state.bMarks[startLine] + state.tShift[startLine]
        let demoStr = state.src.slice(state.bMarks[startLine], state.eMarks[startLine])
        let max = state.eMarks[startLine]
        let auto_closed = false
        
        if (!demoStr.startsWith('::: demo')) {
            return false
        }

        if (slient) { return true }

        // 查找 block 结束位置
        let nextLine = startLine
        let temStart = startLine
        let temEnd = startLine
        let jsStart = startLine
        let jsEnd = startLine
        let cssStart = startLine
        let cssEnd = startLine

        for (;;) {
            nextLine++
            // 在文档与父级结束时 需要自动结束循环
            if (nextLine >= endLine) {
                break
            }

            start = state.bMarks[nextLine] + state.tShift[nextLine]
            max = state.eMarks[nextLine]

            
            if (start < max && state.sCount[nextLine] < state.blkIndent) {
                break
            }
            
            // 过滤那些非从行头开始的内容
            // ::: demo > ok
            //     :::: demo > pass
            if (state.sCount[nextLine] - state.blkIndent >= 4) {
                continue
            }

            if (state.src.slice(start, max).length < 3) {
                continue
            }

            let str = state.src.slice(start, max)
            
            switch (true) {
                case str === '<template>':
                    // 必须开始标签小于结束标签
                    // 防止多个 template 时无法正确取值
                    if (temStart <= temEnd) {
                        temStart = nextLine
                    }
                    break
                case str === '</template>':
                    temEnd = nextLine
                    break
                case str.startsWith('<script'):
                    jsStart = nextLine
                    break
                case str === '</script>':
                    jsEnd = nextLine
                    break
                case str.startsWith('<style'):
                    cssStart = nextLine
                    break
                case str === '</style>':
                    cssEnd = nextLine
            }

            // console.log(`start: ${start} max: ${max}`)
            // console.log('text:', state.src.slice(start, max))
            // console.log('sCount', state.sCount[nextLine])
            // console.log('blkIndent', state.blkIndent)

            if (state.src.slice(start, max) === ':::') {
                auto_closed = true
                break
            }
        }
        
        let old_parent = state.parentType
        let old_line_max = state.lineMax
        let token = state.push('vue-code_open', 'demo', 1)

        token.markup = ':::'
        token.content = state.src.slice(
            state.bMarks[startLine +1],
            state.bMarks[nextLine]
        )
        token.$template = state.src.slice(
            state.bMarks[temStart], 
            state.bMarks[temEnd +1]
        )
        token.$js = state.src.slice(
            state.bMarks[jsStart],
            state.bMarks[jsEnd +1]
        )
        token.$css = state.src.slice(
            state.bMarks[cssStart],
            state.bMarks[cssEnd +1]
        )
        token.map = [startLine, nextLine]
        token.info = 'demo'
        token.block = true

        state.md.block.tokenize(state, startLine + 1, nextLine)
        
        token = state.push('vue-code_close', 'demo', -1)
        token.markup = ':::'
        token.block = true
        state.parentType = old_parent
        state.lineMax = old_line_max
        state.line = nextLine + (auto_closed ? 1 : 0)

        return true
    }

    md.block.ruler.before('fence', 'container_vue', container)
    md.renderer.rules['vue-code_open'] = render
    md.renderer.rules['vue-code_close'] = render
}