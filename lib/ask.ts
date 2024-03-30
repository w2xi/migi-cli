import inquirer from "inquirer"
import validatePkgName from "validate-npm-package-name"
import type { Question } from "inquirer"

export const prompts: Record<string, Question> = {
  name: {
    name: "name",
    type: "string",
    message: "Project name",
  },
  version: {
    name: 'version',
    type: 'string',
    message: 'Project version',
    default: '0.0.1'
  },
  description: {
    name: "description",
    type: "string",
    message: "Project description",
  },
  author: {
    name: "author",
    type: "string",
    message: "Author",
  },
}

export function setPromptDefault(name: string, value: string) {
  const prompt = prompts[name]
  if (prompt) {
    prompt.default = value
  }
}

export function setValidateName() {
  const name = prompts.name
  const customValidate = name.validate
  name.validate = (name: string) => {
    if (!name) {
      return 'Project name is required'
    }
    const its = validatePkgName(name)
    if (!its.validForNewPackages) {
      const errors = (its.errors || []).concat(its.warnings || [])
      return 'Sorry, ' + errors.join(' and ') + '.'
    }
    if (typeof customValidate === 'function') {
      return customValidate(name)
    }
    return true
  }
}

export default function ask() {
  return inquirer.prompt(Object.values(prompts)).then((answers) => {
    return { ...answers }
  })
}
