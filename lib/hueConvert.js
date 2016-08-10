//       default
//    0    100     200 | gm command
//  -180    0      180 | gm equivalent
// 180..360 0      180 | CSS

//0   ->   0   -> 100
//180 ->   180 -> 200
//360 ->  -180 -> 0
//350 ->  -170 -> 9

//Take a CSS 0-360deg and return as 0-200 gm hue
module.exports =  function(CSSHue) {
  let gmHue = 100;
  if (CSSHue > 180) CSSHue = (CSSHue-180)*-1

  if (CSSHue < 0) {
    gmHue = CSSHue*-1
    gmHue /= 180 //percentagize
    gmHue *= 100 //unpercentagize
    gmHue = Math.round(gmHue)
  } else if (CSSHue > 0) {
    gmHue = CSSHue/180 //percentagize
    gmHue *= 100 //unpercentagize
    gmHue = Math.round(gmHue)
    gmHue += 100
  } else {
    gmHue = 100
  }
  return gmHue
}
