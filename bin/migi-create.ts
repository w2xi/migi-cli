#!/usr/env/bin node

import { Command } from 'commander'

const program = new Command()

program
  .parse(process.argv)

const options = program.args

console.log(options)


