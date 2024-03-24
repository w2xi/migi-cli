export default async function fetchTemplates() {
  return new Promise((resolve, reject) => {
    fetch('https://api.github.com/users/migi-templates/repos')
    .then(res => res.json())
    .then(res => {
      if (Array.isArray(res)) {
        resolve(res)
      } else {
        reject(res.message)
      }
    }).catch(err => {
      reject(err)
    })
  })
}