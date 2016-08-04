//access to main.js functions for saving and what-not
const remote = require('electron').remote
const main = remote.require('./main.js')
const {dialog} = require('electron').remote

const filterNames = ['brightness', 'hue', 'saturation',
                     'blur', 'grayscale', 'invert', 'opacity', 'sepia']
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
//clone default filters by value
var filters = JSON.parse(JSON.stringify(defaultFilters))//mutable to track slider states

function getFilters(img) {
  console.log(img.style.webkitFilter);
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

//*** slider listeners ***
//update values live:http://stackoverflow.com/a/37623959/4151489
function onRangeChange(r,f) {
  var n,c,m;
  r.addEventListener("input",function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c;});
  r.addEventListener("change",function(e){if(!n)f(e);});
}

//set up for sliders to update filter array
filterNames.forEach(function(filterName) {
  let filterSlider = document.getElementById('slider-'+filterName)
  onRangeChange(filterSlider, function() {
    let filterVal = filterSlider.value
    filters[`${filterName}`] = Number(filterVal)
    setFilters()
    console.log(`${filterName}(${filterVal})`);
  });
});
//*** end slider listeners ***

//*** file dialogs ***
var openButton = document.getElementById('button-open')
openButton.addEventListener("click", function() {
  dialog.showOpenDialog({properties: ['openFile']}, function(openfile) {
    let img = document.getElementById('img-to-morph')
    img.src = openfile
  })
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
