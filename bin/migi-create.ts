#!/usr/env/bin node

import { Command } from 'commander'
import { promisify } from "util"
import inquirer from 'inquirer'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { homedir } from 'os'
import ora from 'ora'
import ask from '../lib/ask'

const download = promisify(require('download-git-repo'))

const program = new Command()

program
  .name('migi')
  .usage('create <project-name>')
  .option('--template', 'template for the project')

function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

const options = program.args

console.log(options)

const projectName = options[0]
const template = options[1]

const destination = path.resolve(projectName || '.')
const downloadPath = path.join(homedir(), '.migi-templates')

if (existsSync(destination)) {
  inquirer.prompt([
    {
      type: 'confirm',
      message: 'Target directory exists. Continue?',
      name: 'ok'
    }
  ]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(console.error)
} else {
  run()
}

function run() {
  ask().then(answers => {
    console.log(answers)
    const officialTemplate = 'migi-templates/' + template
    downloadAndGenerate(officialTemplate)
  })
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate (officialTemplate: string) {
  const spinner = ora('downloading template...')
  spinner.start()
  // 将模板下载到本地 (~/.migi-templates)
  download(officialTemplate, downloadPath, { clone: false })
    .then(() => {
      spinner.succeed('Successful download template!')
      // ...
    }).catch((err: Error) => {
      spinner.fail('Failed to download repo ' + officialTemplate + ': ' + err.message.trim())
    }).finally(() => {
      spinner.stop()
    })
}