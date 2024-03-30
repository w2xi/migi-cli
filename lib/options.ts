import type { AnswerOptions, ExtraOptions } from './types'
import getGitUser from './git-user'

export default function getOptions(answers: AnswerOptions, options: ExtraOptions) {
  const user = getGitUser()
  const year = new Date().getFullYear()

  setDefault(answers, 'name', options.projectName)
  setDefault(answers, 'author', user.author)
  setDefault(answers, 'email', user.email)
  setDefault(answers, 'year', year.toString())
  
  return answers
}

function setDefault(answer: AnswerOptions, key: string, value: string) {
  if (!answer[key]) {
    answer[key] = value
  }
}