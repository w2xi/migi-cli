export type AnswerOptions = {
  name: string
  author?: string
  email?: string
  description?: string
  packageManager?: 'npm' | 'yarn' | 'pnpm' | false
  year?: number
}

export type ExtraOptions = {
  projectName: string
}