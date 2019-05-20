## Tegaki Service

Application has been bootstrapped using [Express Generator](https://expressjs.com/en/starter/generator.html)

Image resize and conversion is done using [Sharp Library](https://www.npmjs.com/package/sharp)

Worker job queue has been created using [Kue.JS](https://github.com/Automattic/kue)

Error responses created using [Express Boom](https://www.npmjs.com/package/express-boom)

Promise Library [Bluebird](http://bluebirdjs.com/docs/getting-started.html)

Process manager for node application [PM2](http://pm2.keymetrics.io/)

### Known Issues
Sharp library mentioned above has been used for image manipulation. Currently works for jpeg/jpg to png conversion and resize only. I have not looked further to rectify this issue.

### Testing
Tested on Ubuntu 18.04

Tests have been written using [Mocha](https://mochajs.org/)

HTTP assertions using [Supertest](https://github.com/visionmedia/supertest)

Test stubs using [Sinon JS](https://sinonjs.org/)


### Usage
`docker-compose up`

This step:
1. Builds the images
2. Installs npm packages
3. Runs the tests
4. Launches the two services: app (Express server) and imageWorker (Processes jobs in queue)

`npm install && npm run test`

Runs the tests for application

`npm install && npm run lint`

Lints the code. eslint-config-google configuration has been extended.

#### Endpoints
`GET /image/:id/thumbnail` Request PNG thumbnail version of an image

`POST /image/` Sumbit an image for processing to PNG thumbnail

Full API Docs for routes can be found at `routes/images.js`

