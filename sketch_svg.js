
var A = {r: 100, l: 400, cx: 200, cy: 500, incr: 0.0066};
var B = {r: 150, l: 600, cx: 700, cy: 550, incr: 0.02};
var sliders = {};
var l = 0;
var c1  = '#FF007F';
var c2 = '#4266f6';
var bg = false; 
let cvs;

var sent = "CODING FOR ARTISTS"
function setup() {

  cvs = SVG().addTo('main').size(windowWidth, windowWidth); //set canvas to window size;
  background(255);
  frameRate(1000);

  //create sliders and checkbox to allow user to adust pintograph
  var slider_pos = {x: width - 200, y:30};
  for(let key in A){

    sliders[`A_${key}`] = makeSlider(A[key], 0, A[key] * 10, slider_pos, key);
    slider_pos.y +=30;
  }
  slider_pos.x +=100;
  slider_pos.y = 30;
  for(let key in B){
    sliders[`B_${key}`] = makeSlider(B[key], 0, B[key] * 10, slider_pos, key);
    slider_pos.y +=30;
  }
  fill(c1); 
  checkbox = createCheckbox('Background', false);
  checkbox.position(width-100, 200);
  noFill(); 
}

function draw() {
  //redraw background between frames depending on user preference
  checkbox.changed(function(){
    bg = checkbox.checked(); 
  });
  if(bg){background(255)};
  //grab values from sliders and label them
  var y = 25;
  for(let key in A){
    text(`${key} : ${A[key]}`, width -200, y);
    y+=30;
    let div;
    if(Number.isInteger(A[key]) == false){div = 10000;} else{div = 1;}
    A[key] = sliders[`A_${key}`].value()/div;
  }
  var y = 25;
  for(let key in B){
    text(`${key} : ${B[key]}`, width -100, y);
    y+=30;
    let div;
    if(Number.isInteger(B[key]) == false){div = 10000;} else{div = 1;}
    B[key] = sliders[`B_${key}`].value()/div;
  }

  var a, b, p, l_p;

  //if background, redraw every frame so far
  if(bg){
    f_min = 0; 
  } else {
    f_min = frameCount; 
  }


  for (var f = f_min; f <= frameCount; f++) {
    a = spin(f * A.incr, A.r, { x: A.cx, y: A.cy });
    b = spin(f* B.incr, B.r, { x: B.cx, y: B.cy }, false);
    p = penPoint(a, b, A.l, B.l);
    try{
      line(l_p.x, l_p.y, p.x, p.y);
    } catch { }
    l_p = p;
  }
  var clr = lerpColor(color(c1), color(c2), frameCount/2000)
  if(bg){ //BG version
    //draw wheels if background
    ellipse(A.cx, A.cy, A.r*2);
    ellipse(B.cx, B.cy, B.r*2);
    stroke(clr.levels[0], clr.levels[1], clr.levels[2]); //solid stroke
  }else{ //no bg version 
    stroke(clr.levels[0], clr.levels[1], clr.levels[2], 10);
  }

  //draw legs of pintograph
  cvs.line(a.x, a.y, p.x, p.y);
  cvs.line(b.x, b.y, p.x, p.y);
  //possibly add text
  // if (frameCount % 20 == 0) {
  //   var ltr = sent.charAt(l % sent.length);
  //   l++;
  // }


}

//function to make slider ot allow user to manipulate pintogaph parameters
function makeSlider(val, min, max, pos, name){
  if(Number.isInteger(val) == false){
    val*=10000;
    max*=10000;
  }
  slider = createSlider(min, max, val);
  slider.position(pos.x, pos.y);
  text(name, pos.x, pos.y+15)
  slider.style('width', '80px');
  return slider;
}

//returns distance between points a and b
function distance(a, b) {
  return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}

//function to spin circle
function spin(f, r, ctr) {
  var x = r * cos(f) + ctr.x;
  var y = r * sin(f) + ctr.y;
  return { x: x, y: y };
}

//derive pintograph point
function penPoint(a, b, A, B) {
  var c = a.x;
  var d = a.y;
  var e = b.x;
  var f = b.y;
  var x = (-4 * pow(A, 2) * c + 4 * e * pow(A, 2) + sqrt(pow((4 * pow(A, 2) * c - 4 * e * pow(A, 2) - 4 * pow(B, 2) * c +
    4 * e * pow(B, 2) -
    4 * pow(c, 3) + 4 * e * pow(c, 2) - 4 * c * pow(d, 2) + 8 * c * d * f -
    4 * c * pow(f, 2) + 4 * pow(e, 2) * c - 4 * e * pow(d, 2) + 8 * e * d * f -
    4 * e * pow(f, 2) - 4 * pow(e, 3)), 2) - 4 * (4 * pow(c, 2) - 8 * e * c +
      4 * pow(d, 2) - 8 * d * f + 4 * pow(f, 2) + 4 * pow(e, 2)) * (pow(A, 4) - 2 * pow(A, 2) * pow(B, 2) -
        2 * pow(A, 2) * pow(c, 2) - 2 * pow(A, 2) * pow(d, 2) + 4 * pow(A, 2) * d * f - 2 * pow(A, 2) * pow(f, 2) +
        2 * pow(e, 2) * pow(A, 2) + pow(B, 4) + 2 * pow(B, 2) * pow(c, 2) - 2 * pow(B, 2) * pow(d, 2) +
        4 * pow(B, 2) * d * f - 2 * pow(B, 2) * pow(f, 2) - 2 * pow(e, 2) * pow(B, 2) + pow(c, 4) + 2 * pow(c, 2) * pow(d, 2) -
        4 * pow(c, 2) * d * f + 2 * pow(c, 2) * pow(f, 2) - 2 * pow(e, 2) * pow(c, 2) + pow(d, 4) -
        4 * pow(d, 3) * f + 6 * pow(d, 2) * pow(f, 2) + 2 * pow(e, 2) * pow(d, 2) - 4 * d * pow(f, 3) -
        4 * pow(e, 2) * d * f + pow(f, 4) + 2 * pow(e, 2) * pow(f, 2) + pow(e, 4))) +
    4 * pow(B, 2) * c - 4 * e * pow(B, 2) + 4 * pow(c, 3) - 4 * e * pow(c, 2) + 4 * c * pow(d, 2) -
    8 * c * d * f + 4 * c * pow(f, 2) - 4 * pow(e, 2) * c +
    4 * e * pow(d, 2) - 8 * e * d * f + 4 * e * pow(f, 2) + 4 * pow(e, 3)) / (2 * (4 * pow(c, 2) - 8 * e * c +
      4 * pow(d, 2) - 8 * d * f +
      4 * pow(f, 2) + 4 * pow(e, 2)));



  var y = a.y - sqrt(A * A - a.x * a.x + 2 * a.x * x - x * x);
  return ({ x: x, y: y });
}

//from Wolphram Alpha

//x = (-4 A^2 c + 4 e A^2 + sqrt((4 A^2 c - 4 e A^2 - 4 B^2 c + 4 e B^2 - 4 c^3 + 4 e c^2 - 4 c d^2 + 8 c d f - 4 c f^2 + 4 e^2 c - 4 e d^2 + 8 e d f - 4 e f^2 - 4 e^3)^2 - 4 (4 c^2 - 8 e c + 4 d^2 - 8 d f + 4 f^2 + 4 e^2) (A^4 - 2 A^2 B^2 - 2 A^2 c^2 - 2 A^2 d^2 + 4 A^2 d f - 2 A^2 f^2 + 2 e^2 A^2 + B^4 + 2 B^2 c^2 - 2 B^2 d^2 + 4 B^2 d f - 2 B^2 f^2 - 2 e^2 B^2 + c^4 + 2 c^2 d^2 - 4 c^2 d f + 2 c^2 f^2 - 2 e^2 c^2 + d^4 - 4 d^3 f + 6 d^2 f^2 + 2 e^2 d^2 - 4 d f^3 - 4 e^2 d f + f^4 + 2 e^2 f^2 + e^4)) + 4 B^2 c - 4 e B^2 + 4 c^3 - 4 e c^2 + 4 c d^2 - 8 c d f + 4 c f^2 - 4 e^2 c + 4 e d^2 - 8 e d f + 4 e f^2 + 4 e^3)/(2 (4 c^2 - 8 e c + 4 d^2 - 8 d f + 4 f^2 + 4 e^2))