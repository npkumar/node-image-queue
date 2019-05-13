const sharp = require('sharp');

return sharp('./uploads/c0dc42c5551242d7c7578a7a57e2b1ee')
.resize({ width: 100, height: 100 })
.toFile('ouput.jpg')
.then(data => {
  console.log(data);
  // 100 pixels wide, auto-scaled height
})
.catch(err => {
  console.log('err')
  console.log(err)
});