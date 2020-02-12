<template>
  <h1>测试 Props Object 生成</h1>
</template>

<script>
export default {
  props: {
    // 单行注释测试
    data: {
      type: Object,
      default: () => ({})
    },
    // 多行注释测试
    // 
    // 这是第二行注释
    column: {
      type: [String, Number],
      default: 1
    },
    /**
     * 复杂注释
     * @resolve [{
     *    label: {String|function} 标题
     *    key: {String} 引用字段
     *    display: {['block'|'inherit']} 是否为块状元素【不建议使用classes】
     *      - inherit 默认
     *      - block 单行
     *    classes: {'block'|'textoverflow'} 设置样式名
     *    mark: {Object} 提示内容
     *      - width: {String} 设置宽度，如 => {'100px'},
     *      - inner: {String} 需要显示内容
     *    fun: {Function} 调用方法，给方法提供(data, item)，需要返回一个字符串显示内容
     *    prefix: {String} 标题前缀
     *    suffix: {String} 标题后缀
     *    hide: {boolean|function({value: string, data: this.data, item})} 隐藏与显示
     *    slot: {string} 插槽模式，定义一个插槽的名称，调用时提供{data, value, index}
     *      - data {Object} this.data的数据
     *      - value {Format Key} format中对应key的值
     *      - index {Number} 当前索引
     * }]
     */
    format: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    getInner (item, data) {
      return item.fun 
        ? item.fun(data, item) 
        : data[item.key] ? data[item.key] : this.defaultVal
    },

    getLabel (item) {
      if (typeof item.label === 'function') {
        return item.label(item, this.data)
      } else {
        return item.label
      }
    },
    
    /**
     * 返回是否显示
     * getShow (): boolean
     */
    getShow (item) {
      if (item.hide) {
        if (typeof item.hide === 'function') {
          return item.hide({
            value: this.data[item.key], 
            data: this.data, 
            item
          })
        } else {
          return item.hide
        }
      } else {
        return  true
      }
    }
  }
}
</script>
