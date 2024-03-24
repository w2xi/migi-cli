import type { AnswerOptions, ExtraOptions } from './types'
import getUser from './git-user'

export default function mergeOptions(answers: AnswerOptions, options: ExtraOptions) {
  const user = getUser()
  const year = new Date().getFullYear()

  if (!answers.name) {
    answers.name = options.projectName
  }
  if (!answers.author) {
    answers.author = user.author
  }
  if (!answers.email) {
    answers.email = user.email
  }
  answers.year = year

  return answers
}