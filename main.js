const electron = require('electron')
const {app, BrowserWindow} = electron

const fs = require('fs')
const gm = require('gm');

app.on('ready', () => {
  let win = new BrowserWindow({width:800, height: 687})
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.openDevTools()
})

//TODO: fix degrees to gm hue value, currently only accurate for 0(css)=100(gm)
exports.saveImage = (filters, infile, outfile) => {
  gm(infile)
  .modulate(filters.brightness, filters.saturation, filters.hue%200+100)
  .stream(function (err, stdout, stderr) {
    var writeStream = fs.createWriteStream(outfile);
    stdout.pipe(writeStream);
  });
}
