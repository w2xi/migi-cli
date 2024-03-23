import { execSync } from "node:child_process"

export default function getUser() {
  let author
  let email

  try {
    author = execSync('git config --get user.name')
    email = execSync('git config --get user.email')
  } catch (e) {}

  author = author ? author.toString().trim() : ''
  email = email ? email.toString().trim() : ''
  
  return {
    email,
    author
  }
}