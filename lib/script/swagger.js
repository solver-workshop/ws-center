'use strict'
const path = require('path')
const fs = require('fs')
const swaggerJSDoc = require('swagger-jsdoc')
const glob = require('glob')
const pkg = require('../package')

const apis = glob.sync(path.join(__dirname, '../lib/api/*.js'))
const defs = glob.sync(path.join(__dirname, '../lib/model/schema/*.js'))

if (!fs.existsSync(path.join(__dirname, '../public'))) {
  fs.mkdirSync(path.join(__dirname, '../public'))
}
const outputPath = path.join(__dirname, '../public/swagger.json')

const options = {
  definition: {
    info: {
      title: pkg.name,
      version: pkg.version,
      description: pkg.description
    }
  },
  apis: apis.concat(defs)
}

const swaggerSpec = swaggerJSDoc(options)

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec))

console.log(`=> ${outputPath}`)
