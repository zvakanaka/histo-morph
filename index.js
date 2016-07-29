//access to main.js functions for saving and what-not
const remote = require('electron').remote
const main = remote.require('./main.js')

const {dialog} = require('electron').remote

var filters = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hue: 0,
  invert: 0,
  opacity: 100,
  saturation: 100,
  sepia: 0
}

function getFilters(img) {
  console.log(img.style.webkitFilter);
}

function setFilters() {
  let img = document.getElementById('imgToMorph')
  let updatedFilters = `blur(${filters.blur}px) brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hue}deg) invert(${filters.invert}%) opacity(${filters.opacity}%) saturate(${filters.saturation}%) sepia(${filters.sepia}%)`
  img.style.webkitFilter = updatedFilters
}

//open dialog

var openButton = document.getElementById('buttonOpen')
openButton.addEventListener("click", function() {
  dialog.showOpenDialog({properties: ['openFile']}, function(openfile) {
    let img = document.getElementById('imgToMorph')
    img.src = openfile
  })
})

//slider listeners
var brightnessSlider = document.getElementById('sliderBrightness')
brightnessSlider.addEventListener("change", function() {
  let brightnessVal = brightnessSlider.value
  filters.brightness = Number(brightnessVal)
  setFilters()
  console.log(`brightness(${brightnessVal}%)`);
})

var hueSlider = document.getElementById('sliderHue')
hueSlider.addEventListener("change", function() {
  let hueVal = Number(hueSlider.value)
  filters.hue = Number(hueVal)
  setFilters()
  console.log(`hue-rotate(${hueVal}deg) => ${hueVal}`);
})

var saturateSlider = document.getElementById('sliderSaturate')
saturateSlider.addEventListener("change", function() {
  let satVal = saturateSlider.value;
  filters.saturation = Number(satVal)
  setFilters()
  console.log(`saturate(${satVal}%)`);
})

var saveButton = document.getElementById('buttonSave')
saveButton.addEventListener("click", function() {
  let img = document.getElementById('imgToMorph')
  main.saveImage(filters, img.src, `${__dirname}/out.jpg`)
})

var saveAsButton = document.getElementById('buttonSaveAs')
saveAsButton.addEventListener("click", function() {
  dialog.showSaveDialog({defaultPath: `${__dirname}/out.jpg`}, function(outfile) {
    main.saveImage(filters, `${__dirname}/img/milkyway.jpg`, outfile)
  })
})
