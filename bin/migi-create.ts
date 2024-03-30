#!/usr/bin/env node

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
import getOptions from '../lib/options'
import fetchTemplates from '../lib/fetch-templates'
import { setPromptDefault } from '../lib/ask'
import type { AnswerOptions, GitHubRepo, Options } from '../lib/types'

const download = promisify(require('download-git-repo'))
const program = new Command()

program
  .name('migi')
  .usage('create <project-name>')
  .option('--template <tpl>', 'template for the project')
  .option('--offline', 'use cached template')
  .parse(process.argv)

function help() {
  if (program.args.length < 1) return program.help()
}
help()

const args = program.args
const options = program.opts() as Options
const projectName = args[0]
let template = options.template
const destination = path.resolve(projectName || '.')
const cacheDir = `.migi-templates`
// `~/{cacheDir}`
const cacheTemplatesPath = path.join(homedir(), cacheDir)

if (options.offline) {
  const userRelativePath = `~/${cacheDir}/${template}`
  console.log(`> Use cached template at ${chalk.yellow(userRelativePath)}`)
}

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
  const answers: AnswerOptions = Object.create(null)
  if (
    !options.offline &&
    !options.template &&
    args.length === 1
  ) {
    await fetchTemplates().then(async (res: GitHubRepo[])=> {
      await inquirer.prompt([
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
      ]).then(result => {
        Object.assign(answers, result)
      })
    }).catch(err => {
      console.log('Failed to fetch template list: ' + chalk.red(err.toString()))
      process.exit()
    })
  }

  setPromptDefault('name', projectName)

  ask().then(result => {
    Object.assign(answers, result)
    const opts = getOptions(answers, { projectName })

    console.log(opts)

    downloadAndGenerate(opts)
  })
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate(answers: AnswerOptions) {
  template = template || answers.template
  const officialTemplate = 'migi-templates/' + template
  const templatePath = path.join(cacheTemplatesPath, template)
  const spinner = ora('downloading template...')

  if (options.offline && fse.pathExistsSync(templatePath)) {
    generate(templatePath, destination, answers)
  } else {
    spinner.start()
    download(officialTemplate, templatePath, { clone: false })
      .then(() => {
        console.log()
        spinner.succeed('Successful download template!')
        generate(templatePath, destination, answers)
      }).catch((err: Error) => {
        console.log()
        spinner.fail('Failed to download repo ' + officialTemplate + ': ' + err.message.trim())
        console.log()
      }).finally(() => {
        spinner.stop()
      })
  }
}