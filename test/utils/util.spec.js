const expect = require('chai').expect;
const path = require('path');
const util = require('../../utils/util');

describe('Util service', () => {
  it('should get upload path', () => {
    expect(util.getUploadPath('a', 'jpg')).to.equal(
      `${process.cwd()}${path.sep}public${path.sep}images${path.sep}a.jpg`
    );
  });

  it('should get resized image path', () => {
    expect(util.getUploadResizedPath('a')).to.equal(
      `${process.cwd()}${path.sep}public${path.sep}images${path.sep}resized${path.sep}a.png`
    );
  });

  it('should get file download url', () => {
    expect(util.getFileDownloadPath('a')).to.equal(`localhost:3000/images/resized/a.png`);
  });
});
