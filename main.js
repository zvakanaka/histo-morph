const electron = require('electron')
const {app, BrowserWindow} = electron
const getGmHue = require('./lib/hueConvert.js')

const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true});

app.on('ready', () => {
  let win = new BrowserWindow({width:800, height: 695})
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.openDevTools()
})

exports.saveImage = (filters, infile, outfile) => {
  gm(infile)
  .modulate(filters.brightness, filters.saturation, getGmHue(filters.hue))
  .stream(function (err, stdout, stderr) {
    if (!err) {
      var writeStream = fs.createWriteStream(outfile);
      stdout.pipe(writeStream);
    } else {
      console.log(err);
    }
  });
}
