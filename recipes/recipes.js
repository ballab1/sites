var RECIPE_HEIGHT = 290;
var RECIPE_WIDTH = 290;
var RECIPE_JSON = 'recipes.json';

var displayJSON;
var orgJSON;


function buildMenu(parent, hash, mtype) {
  var adata = fixRef(hash);
  for (var idx in adata) {
    var key = adata[idx];
    var txt = document.createTextNode(key);

    var btn = document.createElement('a');
    btn.href = 'javascript:void(0)';
    btn.class = 'btn';
    btn.mtype = mtype;
    btn.addEventListener('click', categoryClick, false);

    btn.appendChild(txt);
    parent.appendChild(btn);
  }
}

function categoryClick() {
  var text = this.innerText;
  var mtype = this.mtype;

  var json = [];
  for (var i = 0; i < displayJSON.length; i++) {
    var item = displayJSON[i];
    if ( mtype == 'category' && item.category == text)
        json.push(item);
    else if ( mtype == 'course' && item.course == text)
        json.push(item);
    else if ( mtype == 'cuisine' && item.cuisine == text)
        json.push(item);
  }

  displayRecipes(json);
}

function categories() {

  var control = document.getElementById('control')
  control.innerHTML = '';
  control.addEventListener('mouseover', menuShow, false);
  control.addEventListener('mouseout', menuHide, true);

  var summary = createSummary(control);
  var menu = createMenu(control);
}

function createMenu(parent) {

  var row = _div(parent, 'sidenav');
  row.id = 'menu';

  var course = { "other":0 };
  var cuisine = { "other":0 };
  var category = { "other":0 };
  for (var item of displayJSON) {
    incRef(course, item.course);
    incRef(cuisine, item.cuisine);
    incRef(category, item.category);
  }

  if (displayJSON != orgJSON)
    menuReset(row);
  buildMenu(row, cuisine, 'cuisine');
  spacer(row);
  buildMenu(row, course, 'course');
  spacer(row);
  buildMenu(row, category, 'category');

  row.style.height = "0px";
  return row;
}

function createSummary(parent) {

  var summary = _div(parent, 'summary');
  summary.id = 'summary';

  var box = _div(summary, 'row center');
  var txt = document.createTextNode('showing ' + displayJSON.length);
  txt.className = 'center summary';
  box.appendChild(txt);

  box = _div(summary, 'row center');
  txt = document.createTextNode('menus');
  txt.className = 'center summary';
  box.appendChild(txt);

  box = _div(summary, 'row center');
  txt = document.createTextNode('out of ' + orgJSON.length);
  txt.className = 'center summary';
  box.appendChild(txt);
  return summary
}

function displayRecipes(json) {
  var recipes = document.getElementById('recipes');
  recipes.innerHTML = '';
  var old = document.getElementById('main');
  if (old)
    recipes.removeChild( old );

  var table = _div(recipes, 'table center');
  table.id = 'main';
  table.style.width = '100%';

  for (var i = 0; i < json.length;) {
    var row = _div(table, 'row');

    var remainingWidth = this.outerWidth;
    var cols = 0;
    while (i < json.length) {
      remainingWidth -= showRecipe(row, json[i++]);
      if (++cols > 2 && remainingWidth < RECIPE_WIDTH)
        break;
    }
  }
  displayJSON = json
  categories();
}

function _div(parent, cName) {
  var div = document.createElement('div');
  div.className = cName;
  parent.appendChild(div);
  return div
}

function fixRef(amap) {
  var adata = [];
  for (var item in amap) {
    if (amap[item])
       adata.push(item);
  }
  return adata.sort();
}

function getIndexJsonCB ()  {
  if (this.readyState != 4)
    return;
  if (this.status == 200) {
    orgJSON = JSON.parse(this.responseText);
    orgJSON = orgJSON.sort(function(a, b) {
      if (a.text < b.text)
        return -1;
      if (a.text > b.text)
        return 1;
      return 0;
    });
    resetDisplay();
  }
  else {
    document.getElementById('x1').innerHTML = 'There was an issue loading the recipie index file: ' +  RECIPE_JSON;
  }
}

function init() {
  document.getElementById('recipes').innerHTML = 'Loading ...';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = getIndexJsonCB;
  xhttp.open("GET", RECIPE_JSON, true);
  xhttp.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  xhttp.send();
}

function incRef(amap,anitem) {
  if (amap[anitem])
    amap[anitem]++
  else
    amap[anitem] = 1
}

function menuHide() {
  var menu = document.getElementById('menu')
  if (menu)
    menu.style.height = "0px";
}

function menuReset(parent) {
  var txt = document.createTextNode('Reset');

  var btn = document.createElement('a');
  btn.id = 'reset';
  btn.href = 'javascript:void(0)';
  btn.class = 'btn';
  btn.addEventListener('click', resetDisplay, false);
  btn.appendChild(txt);
  parent.appendChild(btn);

  spacer(btn);
  btn.style.height = (displayJSON == orgJSON) ? "0px" : "12px";
}

function menuShow() {
  var menu = document.getElementById('menu')
  if (menu)
    menu.style.height = "auto";
}

function resetDisplay() {
  displayRecipes(orgJSON);
}

function showRecipe(parent, item) {
  var img = document.createElement('img');
  img.src = item.image;
  img.alt = item.text;
  img.width = RECIPE_WIDTH;
  img.height = RECIPE_HEIGHT;

  var a = document.createElement('a');
  a.href = item.file;
  a.title = item.text + '\n  category: ' + item.category + '\n  course: ' + item.course + '\n  cuisine: ' + item.cuisine;
  a.appendChild(img);

  var txt = document.createTextNode(item.text);
  var p = document.createElement('p');
  p.appendChild(txt);
  a.appendChild(p);

  var div = _div(parent, 'box recipe');
  div.appendChild(a);

  return RECIPE_WIDTH;
}

function spacer(parent) {
  var vspace = _div(parent, 'row vspace');
  vspace.style.width = '100%';
  return vspace;
}
