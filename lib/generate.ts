import fg from 'fast-glob'
import ejs from 'ejs'
import fse from 'fs-extra'
import chalk from 'chalk'
import path from 'path'

const installDepCommand = {
  npm: 'npm install',
  yarn: 'yarn',
  pnpm: 'pnpm install',
}

export default async function generate(templateDir: string, destination: string, data: any) {
  copy(templateDir, destination)
  renderEjs(destination, data)
    .then(() => {
      const { pm: packageManager } = data
      const projectName = path.basename(destination)
      
      console.log(chalk.green('Create app successfully!'))
      console.log()
      console.log(`    cd ${projectName}`)
      console.log(`    ${installDepCommand[packageManager]}`)
      console.log()
    }).catch((err) => {
      console.error(err)
    })
}

function renderEjs(dir: string, data: any) {
  return new Promise<void>((resolve, reject) => {
    const files = fg.sync(
      '**/*', 
      { 
        cwd: dir,
        dot: true,
        ignore: ['**/node_modules/**'],
      }
    )
    Promise.all(
      files.map(file => { 
        const filename = path.join(dir, file)
        return renderFile(filename, data)
      })
    ).then(() => {
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

function renderFile(filepath: string, data: any) {
  const ext = path.extname(filepath)

  if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, data, {}, (err, str) => {
      if (err) {
        reject(err)
      } else {
        fse.writeFileSync(filepath, str)
        resolve(filepath)
      }
    })
  })
}

function copy(from: string, to: string) {
  if (!fse.pathExistsSync(to)) {
    fse.copySync(from, to)
    return true
  }
}