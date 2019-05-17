const kue = require('kue');
const path = require('path');
const {expect} = require('chai');
const {stub, assert, match} = require('sinon');
const redis = require('redis');
const request = require('supertest');

const logger = require('../../utils/logger');
const loggerErrorStub = stub(logger, 'error');

const redisStubCreateClientStub = stub(redis, 'createClient');
const redisClientSetAsyncStub = stub().resolves();
const redisClientGetAsyncStub = stub().resolves('longurl');
redisStubCreateClientStub.returns({
  getAsync: redisClientGetAsyncStub,
  setAsync: redisClientSetAsyncStub,
});

const kueCreateQueueStub = stub(kue, 'createQueue');
const queue = require('../../services/queue');
const queueCreateJobStub = stub(queue, 'createJob');
const app = require('../../app');

describe('Images API', () => {
  describe('GET /image/:id/thumbnail', () => {
    it('should return url to given image id', done => {
      request(app)
        .get('/image/uniqueId/thumbnail')
        .end((err, res) => {
          if (err) {
            throw err;
          };
          expect(res.status).to.equal(200);
          expect(res.body.url).to.equal('longurl');

          assert.calledWith(redisClientGetAsyncStub, 'uniqueId');
          done();
        });
    });
  });

  describe('POST /image', () => {
    const imagePath = `${process.cwd()}${path.sep}test${path.sep}routes${path.sep}img${path.sep}cat.jpeg`;

    it('should return id of image', done => {
      request(app)
        .post('/image')
        .attach('image', imagePath)
        .end((err, res) => {
          if (err) {
            throw err;
          };
          expect(res.status).to.equal(200);
          expect(res.body.id).to.be.a('string');

          assert.calledWith(queueCreateJobStub, match.string, 'jpeg');
          assert.calledWith(redisClientSetAsyncStub, match.string, '');
          done();
        });
    });

    it('should return 400 if image not attached', done => {
      request(app)
        .post('/image')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please attach an image');
          done();
        });
    });

    it('should return 500 if createJob fails', done => {
      queueCreateJobStub.rejects(new Error());
      request(app)
        .post('/image')
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done();
        });
    });
  });

  after(() => {
    redisStubCreateClientStub.restore();
    kueCreateQueueStub.restore();
    queueCreateJobStub.restore();
    loggerErrorStub.restore();
  });
});
