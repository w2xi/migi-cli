#!/usr/bin/env node

import chalk from 'chalk'

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

fetch('https://api.github.com/users/migi-templates/repos')
  .then(res => res.json())
  .then(res => {
    if (Array.isArray(res)) {
      console.log('  Migi available templates:')
      console.log()
      res.forEach(repo => {
        console.log(
          '  ' + chalk.yellow('★') +
          '  ' + chalk.blue(repo.name) +
          ' - ' + repo.description)
      })
    } else {
      console.error(res.message)
    }
  }).catch(err => {
    console.log()
    console.error(err)
    process.exit(1)
  })