var model = require('./model');

var catsById = model.catsById;
var depts = model.depts;
var cats = model.cats;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;

//TODO: move to util file
function hexToRgbArray(hex) {
  hex = Math.floor( hex );

  return [
        ( hex >> 16 & 255 ) / 255,
        ( hex >> 8 & 255 ) / 255,
        ( hex & 255 ) / 255
    ];

}


//var textObjects = require('./textItems').objects;


var states = {};
//var textKeys = Object.keys(textObjects);





// *********************
//   Make each state...
//   Every state has:
//      1)  array of focis (points where balls gravitate towards)
//      2)  array of nodes, that correspond to balls and indicate which foci they are linked to
//      3)  array of text objects that
//   It's probably a good idea to makes states immutable, meaning they don't include functions
//   or refernces to other objects, which is why the nodes refernce the focis by numeric id
//   not actual refernces.
// *********************

/*states.empty = {
    focis: [],
    nodes: [],
    text: []
  };
*/

states.wholeCity = function() {

  // state
  var foci = {
    x: 0,
    y: 0,
    distSq: model.totalBudget * 0.0000035
  };

  var state = {
    focis: [foci],
    nodes: [],
    text: ['phillyTotal'],
    camPos:{
      x:0,
      y:0,
      z:300
    },
  };

  nodes.forEach(function(node,i){
    state.nodes.push({
      foci:foci,
      nid: i,
      color: hexToRgbArray(0x333333)
    });
  });

  return state;

}();




states.deptByCat = function() {
  // state
  var state = {
    focis: [],
    nodes: [],
    text: [],
    camPos:{
      x:0,
      y:0,
      z:450
    },
  };



  var deptFoci = []; //for this state, assigns a foci to each dept

  cats.forEach(function(cat) {
    cat.depts.sort(function(a, b) {
      return b.t - a.t;
    });
    yC = 100;
    cat.depts.forEach(function(dept) {

      state.text.push('dept_t_' + dept.did);
      state.text.push('dept_n_' + dept.did);


      var foci = {
        x: cat.x,
        y: yC,
        distSq: dept.t * 0.0000035,
        did: dept.did

      };


      state.focis.push(foci);
      deptFoci[dept.did] = foci;
      yC -= Math.sqrt(dept.t) * 0.0035 + 30;
    });
  });

  nodes.forEach(function(node, i) {
    state.nodes.push({
      nid: i,
      foci: deptFoci[node.did],
      color: hexToRgbArray(depts[node.did].cat.color)
    });
  });

  return state;
}();

states.catTotals = function() {
  // state
  var state = {
    focis: [],
    nodes: [],
    text: [],
    camPos:{
      x:0,
      y:0,
      z:450
    },
  };

  var catFoci = []; //for this state, assigns a foci to each dept

  cats.forEach(function(cat) {

    state.text.push('cat_t_' + cat.cid);
    state.text.push('cat_n_' + cat.cid);

    var foci = {
        x: cat.x,
        y: 10,
        distSq: cat.t * 0.0000035,
        cid: cat.cid

      };
      state.focis.push(foci);
      catFoci[cat.cid] = foci;

      //temp
      /*if (textObjects['cat_t_' + cat.cid]){
        textObjects['cat_t_' + cat.cid].position.x = cat.x;
        textObjects['cat_t_' + cat.cid].position.y = 10;
        textObjects['cat_n_' + cat.cid].position.x = cat.x;
        textObjects['cat_n_' + cat.cid].position.y = 10;

      }
      */
  });

  nodes.forEach(function(node, i) {
    state.nodes.push({
      nid: i,
      foci: catFoci[depts[node.did].cat.cid],
      color: hexToRgbArray(depts[node.did].cat.color)
    });
  });

  return state;
}();


module.exports = states;
