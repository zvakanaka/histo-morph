'use strict';
//access to main.js functions for saving and what-not
var isElectron = window && window.process && window.process.type;

if (isElectron) {
  //console.log('Electron is ', window.process.type);
  const remote = require('electron').remote
  const main = remote.require('./main.js')
  const dialog = require('electron').remote.dialog
  const clipboard = require('electron').clipboard
} else {
  console.log('Load scripts here');
}

const filterNames = ['brightness', 'hue', 'saturation',
                     'blur', 'grayscale', 'invert',
                     'opacity', 'sepia']
const defaultFilters = {
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

function getDefaultFilters() {
  return JSON.parse(JSON.stringify(defaultFilters))
}
//clone default filters by value
var filters = getDefaultFilters()

function getFilters(img) {
  return `${img.style.webkitFilter};`
}

function setFilters() {
  let img = document.getElementById('img-to-morph')
  let updatedFilters = `blur(${filters.blur}px) brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hue}deg) invert(${filters.invert}%) opacity(${filters.opacity}%) saturate(${filters.saturation}%) sepia(${filters.sepia}%)`
  img.style.webkitFilter = updatedFilters
}
//reset filters array AND slider values
function resetFilters() {
  let img = document.getElementById('img-to-morph')
  filters = JSON.parse(JSON.stringify(defaultFilters))
  setFilters()
  //reset slider values
  filterNames.forEach(function(filterName) {
    let filterSlider = document.getElementById('slider-'+filterName)
    filterSlider.value = filters[`${filterName}`]
  })
}

var resetFiltersButton = document.getElementById('button-reset-filters')
resetFiltersButton.addEventListener("click", function() {
  resetFilters()
})

const copyCssButton = document.getElementById('button-copy-css')
copyCssButton.addEventListener('click', function () {
  let img = document.getElementById('img-to-morph')
  clipboard.writeText(`-webkit-filter: ${getFilters(img)}`)
})

//*** slider listeners ***
// update slider values live. source:http://stackoverflow.com/a/37623959/4151489
function onRangeChange(r,f) {
  var n,c,m;
  r.addEventListener("input",function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c;});
  r.addEventListener("change",function(e){if(!n)f(e);});
}

function updateSlider(slider, filterName) {
    let value = slider.getValue();

    filters[`${filterName}`] = Number(value)
    setFilters()
    console.log(`${filterName}(${value})`);
};

//setup for sliders to update filter array
filterNames.forEach(function(filterName) {
  let slider = new Slider('#slider-'+filterName, {
    formatter: function(value) {
      return 'Current value: ' + value;
    }
  });
  slider.on('slide', function(){
    updateSlider(slider, filterName);
  });
  slider.on('change', function(){
    updateSlider(slider, filterName);
  });
});
//*** end slider listeners ***

//*** file dialogs ***
var openButton = document.getElementById('button-open')
openButton.addEventListener("click", function() {
  if (isElectron) {
    dialog.showOpenDialog({properties: ['openFile']}, function(openfile) {
      let img = document.getElementById('img-to-morph')
      img.src = openfile
    })
  }
})

var saveButton = document.getElementById('button-save')
saveButton.addEventListener("click", function() {
  let img = document.getElementById('img-to-morph')
  main.saveImage(filters, img.src, `${__dirname}/out.jpg`)
})

var saveAsButton = document.getElementById('button-save-as')
saveAsButton.addEventListener("click", function() {
  dialog.showSaveDialog({defaultPath: `${__dirname}/out.jpg`}, function(outfile) {
    let img = document.getElementById('img-to-morph')
    main.saveImage(filters, img.src, outfile)
  })
})
//*** end file dialogs ***
