const shell = require('shelljs')
const packageInfo = require('./package.json')
const BUILD_FINISHED = 'success Published'
const NEXUS = 'nexus' // 仓库地址一
const SNIOPA = 'sniopa' // 仓库地址二
const args = process.argv
/**
 * @description 异步队列
 */
class Scheduler {
  constructor(limit) {
    this.queue = []
    this.maxCount = limit
    this.runCounts = 0
  }

  add(userName, passWord, registry, email = 'email@ingeek.com') {
    const promiseCreator = () => {
      return new Promise((resolve) => {
        const inputArray = [`${userName}\n`, `${passWord}\n`, `${email}\n`]
        const child = shell.exec(`npm login --registry=${registry}`, { async: true })
        const publishFun = () => {
          const publishChild = shell.exec(`yarn publish --registry=${registry} --new-version ${packageInfo.version}`, { async: true })
          publishChild.stdout.on('data', (data) => {
            if (data.includes(BUILD_FINISHED))
              resolve()
          })
        }
        child.stdout.on('data', () => {
          const cmd = inputArray.shift()
          if (cmd) {
            shell.echo('input' + cmd)
            child.stdin.write(cmd)
          } else {
            publishFun()
            child.stdin.end()
          }
        })
      })
    }
    this.queue.push(promiseCreator)
  }

  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request()
    }
  }

  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return
    }
    this.runCounts++
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--
        this.request()
      })
  }
}
const scheduler = new Scheduler(1)
if (args[2]) {
  if (args[2] === SNIOPA) {
    scheduler.add('账户', '密码', '地址')
  } else if (args[2] === NEXUS) {
    scheduler.add('账户', '密码', '地址')
  } else {
    console.warn('---命令出错,请检查后重新输入---')
    process.exit(1)
  }
} else {
  scheduler.add('账户', '密码', '地址')
  scheduler.add('账户', '密码', '地址')
}
scheduler.taskStart()
