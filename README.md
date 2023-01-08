# Pantex

An [express.js](https://expressjs.com/) server written in [typescript](https://www.typescriptlang.org/) to convert documents using [pandoc](https://pandoc.org/) and [latex](https://www.latex-project.org/).

## Running locally

You need `pandoc` and `pdflatex` installed on your machine.

```sh
npm run dev
# or nodemon
npm run dev:watch
```

or build and run :

```
npm run build
npm start
```

## Docker

```sh
docker build -t . pantex
docker run --rm -it -p 5001:5001/tcp pantex:latest
```
