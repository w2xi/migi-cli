import inquirer from "inquirer";

const questions = [
  {
    name: "name",
    type: "string",
    required: true,
    message: "Project name",
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
  {
    name: "pm",
    type: "list",
    message: "Install dependencies?",
    choices: [
      {
        name: "npm",
        value: "npm",
      },
      {
        name: "yarn",
        value: "yarn",
      },
      {
        name: 'pnpm',
        value: 'pnpm',
      },
      {
        name: "No, I will handle that myself",
        value: false,
        short: "no",
      },
    ],
  },
]

export default function ask() {
  return inquirer.prompt(questions).then((answers) => {
    return { ...answers }
  })
}
