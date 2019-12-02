// https://github.com/anc95/inquirer-file-tree-selection
const chalk = require('chalk');
const cliCursor = require('cli-cursor');
const path = require('path');
const Base = require('inquirer/lib/prompts/base');
const observe = require('inquirer/lib/utils/events');
const Paginator = require('inquirer/lib/utils/paginator');
const {takeUntil, take, map} = require('rxjs/operators')
const dirFiles = require('./directoryFiles')

/**
 * type: string
 * onlyShowDir: boolean (default: false)
 */
class FileTreeSelectionPrompt extends Base {
  constructor(questions, rl, answers) {
    super(questions, rl, answers);

    this.setFileTree(path.resolve(process.cwd(), '.'))
    this.shownList = []

    this.opt = {
      ...{
        default: null,
        pageSize: 10,
        onlyShowDir: false
      },
      ...this.opt
    }

    // console.log(this.opt)

    // Make sure no default is set (so it won't be printed)
    this.opt.default = null
    this.opt.pageSize = 10

    this.paginator = new Paginator(this.screen);
  }
 
  /**
   * Start the Inquiry session
   * @param  {Function} cb  Callback when prompt is done
   * @return {this}
   */

  _run(cb) {
    this.done = cb;

    var events = observe(this.rl);

    events.keypress
      .pipe(takeUntil(events.line))
      .forEach(this.onKeypress.bind(this));

    events.line
      .pipe(
        take(1),
        map(this.getCurrentValue.bind(this))
      )
      .forEach(this.onSubmit.bind(this))

    cliCursor.hide();
    this.render();

    return this;
  }

  renderFileTree(root = this.fileTree, indent = 2) {
    const children = root || []
    let output = ''

    children.forEach(itemPath => {
      this.shownList.push(itemPath)

      let prefix = itemPath.isDir ? '+ ' : ''
      let showValue = ''

      if (itemPath === this.selected) {
        // 调整添加下划线与颜色来显示当前的选项
        showValue = chalk.cyan.underline(itemPath.name)
      } else {
        showValue = itemPath.name
      }

      output += ' '.repeat(prefix ? indent - 2: indent) + prefix + showValue + '\n'

    })

    return output
  }

  setFileTree (pathLike = process.cwd()) {
    let parentPath = path.join(pathLike, '../')
    this.fileTree = dirFiles(path.resolve(pathLike))

    this.fileTree.unshift({
      path: pathLike,
      isDir: false,
      special: true,
      name: '.(当前目录)'
    }, {
      path: parentPath,
      isDir: false,
      special: true,
      name: '..(上级目录)'
    })

    this.selected = this.fileTree[0]

  }

  /**
   * Render the prompt to screen
   * @return {FileTreeSelectionPrompt} self
   */

  render() {
    // Render question
    let message = this.getQuestion()

    message += chalk.dim('(使用上下箭头选择文件，使用Tab进入文件夹)')

    if (this.status === 'answered') {
      message += chalk.cyan(this.selected.path)
    }
    else {
      this.shownList = []
      const fileTreeStr = this.renderFileTree()

      message += '\n' + this.paginator.paginate(
        fileTreeStr + '----------------------------------', 
        this.shownList.indexOf(this.selected), 
        this.opt.pageSize
      )
    }

    this.screen.render(message);
  }

  /**
   * When user press `enter` key
   */

  onSubmit(value) {
    // console.log('>>>', value)
    // if (typeof this.opt.validate === 'function') {
    //   let validateResult = this.opt.validate(value)

    //   if (validateResult !== true) {
    //     console.log('eeee')
    //     this.render()
    //   }
    //   return
    // }
    this.status = 'answered';

    this.render();

    this.screen.done();
    cliCursor.show();
    // 调整提交完整的文件信息
    this.done(value);
  }

  moveselected(distance = 0) {
    const currentIndex = this.shownList.indexOf(this.selected)
    let index = currentIndex + distance

    if (index >= this.shownList.length) {
      index = 0
    }
    else if (index < 0) {
      index = this.shownList.length - 1
    }

    this.selected = this.shownList[index]

    this.render()
  }

  getCurrentValue() {
    return this.selected
  }

  /**
   * When user press a key
   */
  onUpKey() {
    this.moveselected(-1)
  }

  onDownKey() {
    this.moveselected(1)
  }

  onSpaceKey() {
    if (!this.selected.children) {
      return
    }

    this.selected.open = !this.selected.open
    this.render()
  }

  /**
   * 
   * @param {object} e {key: {name: string}, value: string}
   */
  onKeypress(e) {
    let keyName = (e.key && e.key.name) || undefined

    if (keyName === 'tab') {
      if (this.selected.isDir || this.selected.special) {
        this.setFileTree(this.selected.path)
        this.render()
      }
    } else if (keyName === 'down') {
      this.moveselected(1)
    } else if (keyName === 'up') {
      this.moveselected(-1)
    }
  }
}

module.exports = FileTreeSelectionPrompt;