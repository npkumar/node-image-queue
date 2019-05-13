const sharp = require('sharp');

return sharp('/home/KWJP.KEYWORDSINTL.COM/nkumar/Pictures/minion.jpg')
.resize({ width: 100, height: 100 })
.toFile('output')
.then(data => {
  console.log(data);
  // 100 pixels wide, auto-scaled height
})
.catch(err => {
  console.log('err')
  console.log(err)
});