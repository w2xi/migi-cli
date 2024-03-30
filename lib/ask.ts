import inquirer from "inquirer";

export const prompts = {
  name: {
    name: "name",
    type: "string",
    required: true,
    message: "Project name",
  },
  version: {
    name: 'version',
    type: 'string',
    required: false,
    message: 'Project version',
    default: '0.0.1'
  },
  description: {
    name: "description",
    type: "string",
    required: false,
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

export default function ask() {
  return inquirer.prompt(Object.values(prompts)).then((answers) => {
    return { ...answers }
  })
}
