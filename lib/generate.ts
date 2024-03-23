import fg from 'fast-glob'
import ejs from 'ejs'
import fse from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import { AnswerOptions } from './types'
import { detectPackageManager } from './detect-pm'

const installDepCommand = {
  npm: 'npm install',
  yarn: 'yarn',
  pnpm: 'pnpm install',
}

export default async function generate(
  templateDir: string, 
  destination: string, 
  data: AnswerOptions
) {
  copy(templateDir, destination)
  renderEjs(destination, data)
    .then(async () => {
      removeTemplateDir(destination)

      const detectAgent = await detectPackageManager(destination) || 'npm'
      const [agent] = detectAgent.split('@')
      const projectName = path.basename(destination)
      
      console.log()
      console.log(chalk.green('Create app successfully!'))
      console.log()
      console.log(`Scaffolding project in ${destination}`)
      console.log()
      console.log('Done. Now run the following commands:')
      console.log()
      console.log(`  cd ${projectName}`)
      console.log(`  ${installDepCommand[agent]}`)
      console.log()
    }).catch((err) => {
      console.error(err)
      // remove the generated files
      fse.removeSync(destination)
    })
}

function renderEjs(dir: string, data: AnswerOptions) {
  // only render files in the template directory
  const templateDirInside = path.resolve(dir, 'template')

  if (!fse.pathExistsSync(templateDirInside)) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const files = fg.sync(
      '**/*', 
      { 
        cwd: templateDirInside,
        dot: true,
        ignore: ['**/node_modules/**'],
      }
    )
    Promise.all(
      files.map(file => { 
        const filepath = path.join(templateDirInside, file)
        return renderFile(filepath, data)
      })
    ).then(() => {
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

function renderFile(filepath: string, data: AnswerOptions) {
  const ext = path.extname(filepath)
  const filename = path.basename(filepath)

  if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, data, {}, (err, str) => {
      if (err) {
        reject(err)
      } else {
        const newFilepath = path.resolve(filepath, '../..', filename)
        fse.outputFileSync(newFilepath, str)
        resolve(newFilepath)
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

function removeTemplateDir(dir: string) {
  const templateDirInside = path.resolve(dir, 'template')
  if (fse.pathExistsSync(templateDirInside)) {
    fse.removeSync(templateDirInside)
  }
}