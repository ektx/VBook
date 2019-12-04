const path = require('path')
const chalk = require('chalk')
const cliCursor = require('cli-cursor')
const Base = require('inquirer/lib/prompts/base')
const Paginator = require('inquirer/lib/utils/paginator')
const observe = require('inquirer/lib/utils/events')
const {takeUntil, map, take} = require('rxjs/operators')
const dirFiles = require('./directoryFiles')

function mask(input, maskChar) {
  input = String(input);
  maskChar = typeof maskChar === 'string' ? maskChar : '*';
  if (input.length === 0) {
    return '';
  }

  return new Array(input.length + 1).join(maskChar);
}

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

    // Make sure no default is set (so it won't be printed)
    this.opt.default = null
    this.opt.pageSize = 10

    this.paginator = new Paginator(this.screen);
  }

  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {this}
   */

  _run(cb) {
    this.done = cb;

    var events = observe(this.rl);

    // Once user confirm (enter key)
    var submit = events.line
      .pipe(map(this.filterInput.bind(this)))

    var validation = this.handleSubmitEvents(submit);
    validation.success.forEach(this.onEnd.bind(this));
    validation.error.forEach(this.onError.bind(this));

    events.keypress
      .pipe(takeUntil(validation.success))
      .forEach(this.onKeypress.bind(this));

    cliCursor.hide()
    this.render()

    return this
  }

  /**
   * Render the prompt to screen
   * @return {FileTreeSelectionPrompt} self
   */

  render(error) {
    // console.trace(error)
    var message = this.getQuestion();
    var bottomContent = '';

    if (this.status === 'answered') {
      message += chalk.cyan(this.selected.path)
    } else {
      message += chalk.dim('(使用上下箭头选择文件，使用Tab进入文件夹)')

      this.shownList = []
      const fileTreeStr = this.renderFileTree()

      message += '\n' + this.paginator.paginate(
        fileTreeStr + '----------------------------------', 
        this.shownList.indexOf(this.selected), 
        this.opt.pageSize
      )
    }

    if (error) {
      bottomContent = '\n' + chalk.red('❌ ') + error;
    }

    this.screen.render(message, bottomContent);
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
   * When user press `enter` key
   */

  filterInput () {
    return this.selected.path
  }

  onEnd(state) {
    console.log('End:', state)
    this.status = 'answered';
    this.answer = state.value;

    // Re-render prompt
    // this.render();

    this.screen.done();
    this.done(state.value);
  }

  onError(state) {
    console.log('Error:', state)
    this.render(state.isValid);
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
