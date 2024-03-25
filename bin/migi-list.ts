#!/usr/bin/env node

import chalk from 'chalk'
import fetchTemplates from '../lib/fetch-templates'
import type { GitHubRepo } from '../lib/types'

/**
 * Padding.
 */

console.log()
process.on('exit', () => {
  console.log()
})

/**
 * List all available repos.
 */

fetchTemplates().then((res: GitHubRepo[]) => {
  console.log('  Migi available templates:')
  console.log()
  res.forEach(repo => {
    console.log(
      '  ' + chalk.blue(repo.name) +
      ' - ' + repo.description)
  })
}).catch(err => {
  console.log('Failed to fetch template list: ' + chalk.red(err.toString()))
  process.exit(1)
})