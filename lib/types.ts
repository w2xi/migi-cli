export type AnswerOptions = {
  name: string
  author?: string
  email?: string
  description?: string
  packageManager?: 'npm' | 'yarn' | 'pnpm' | false
  template?: string
  year?: number
}

export type ExtraOptions = {
  projectName: string
}

export type Options = {
  template: string
  offline: boolean
}

export type GitHubRepo = {
  name: string
  description: string
}
