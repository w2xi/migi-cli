import inquirer from "inquirer";

export const questions = [
  {
    name: "name",
    type: "string",
    required: true,
    message: "Project name",
  },
  {
    name: 'version',
    type: 'string',
    required: false,
    message: 'Project version',
    default: '0.0.1'
  },
  {
    name: "description",
    type: "string",
    required: false,
    message: "Project description",
  },
  {
    name: "author",
    type: "string",
    message: "Author",
  },
]

export function unshiftQuestion(question) {
  questions.unshift(question)
}

export default function ask() {
  return inquirer.prompt(questions).then((answers) => {
    return { ...answers }
  })
}
