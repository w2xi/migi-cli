#!/usr/env/bin node

import { Command } from 'commander'
import { promisify } from "util"
import { homedir } from 'node:os'
import inquirer from 'inquirer'
import fse from 'fs-extra'
import path from 'node:path'
import ora from 'ora'
import chalk from 'chalk'
import ask from '../lib/ask'
import generate from '../lib/generate'
import mergeOptions from '../lib/merge-options'
import fetchTemplates from '../lib/fetch-templates'
import type { AnswerOptions, GitHubRepo } from '../lib/types'
import { questions, unshiftQuestion } from '../lib/ask'

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
const projectName = options[0]
let template = options[1]
const destination = path.resolve(projectName || '.')
const localTemplatePath = path.join(homedir(), '.migi-templates')

if (fse.pathExistsSync(destination)) {
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

async function run() {
  if (options.length === 1) {
    await fetchTemplates().then((res: GitHubRepo[])=> {
      unshiftQuestion(
        {
          type: 'list',
          name: 'template',
          message: 'Select a template:',
          choices: res.map((repo: GitHubRepo) => {
            return { 
              name: repo.name, 
              value: repo.name,
              description: repo.description
            }
          })
        }
      )
    }).catch(err => {
      console.log('Failed to fetch template list: ' + chalk.red(err.toString()))
      process.exit()
    })
  }
  ask().then(answers => {
    mergeOptions(answers, {
      projectName,
    })
    template = template || answers.template
    const officialTemplate = 'migi-templates/' + template
    downloadAndGenerate(officialTemplate, answers)
  })
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate (officialTemplate: string, answers: AnswerOptions) {
  const saveTemplatePath = path.join(localTemplatePath, template)
  const spinner = ora('downloading template...')
  
  if (fse.pathExistsSync(saveTemplatePath)) {
    generate(saveTemplatePath, destination, answers)
  } else {
    spinner.start()
    // download a template to a local directory located at `~/.migi-templates`
    download(officialTemplate, saveTemplatePath, { clone: false })
      .then(() => {
        console.log()
        spinner.succeed('Successful download template!')
        generate(saveTemplatePath, destination, answers)
      }).catch((err: Error) => {
        console.log()
        spinner.fail('Failed to download repo ' + officialTemplate + ': ' + err.message.trim())
        console.log()
      }).finally(() => {
        spinner.stop()
      })
  }
}