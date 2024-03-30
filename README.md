# migi-cli

> A simple CLI tool to create a new project based on a template.

## Usage

Install `migi-cli` globally:

```bash
$ npm i @w2xi/migi-cli -g
```
 
Create an app interactively:

```bash
$ migi create <project-name>
```

or specify a template with `--template <available-template>`

```bash
$ migi create <project-name> --template <available-template>
```

List available templates:

```bash
$ migi list

  Migi available templates:

  nm - A template for creating a new npm module, preferred node-cli tools
  vue-erciyuan-admin - A template designed for those who love anime, based on Vue3 + Vite + UnoCSS
  
```

## Available Templates

- [nm](https://github.com/migi-templates/nm): nm - A template for creating a new npm module, preferred node-cli tools
- [vue-erciyuan-admin](https://github.com/migi-templates/vue-erciyuan-admin): A template designed for those who love anime, based on Vue3 + Vite +  UnoCSS

## Options

```bash
$ migi -h
Usage: migi <command> [options]

Migi CLI

Options:
  -V, --version          output the version number
  -h, --help             display help for command

Commands:
  list                   list available templates
  create <project-name>  create a new project
  help [command]         display help for command
```

## License

[MIT](./LICENSE)