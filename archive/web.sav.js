var MENUREF_HEIGHT = 55;  // 57
var MENUREF_WIDTH = 180;  // 156
var MENUREF_JSON_FILE = 'web.json';
var K8S_JSON_FILE = 'services_ips.json';

var MENU_JSON = null;
var K8S_IPS_JSON = null;


function btnClick() {
  if (this.html == '#') {
    if (K8S_IPS_JSON) {
      K8S_IPS_JSON.forEach((item) => {
        if (this.id == item.title)
          this.html = (item.port == 443) ? 'https://' + item.host : 'http://' + item.host + ':' + item.port;
      });
    }
  }
  if (this.html && this.html != '#')
    window.open(this.html,'_self');
}

function displayBtns() {
  if (! MENU_JSON)
      return;
  var refs = document.getElementById('menulinks');
  refs.innerHTML = '';
  var old = document.getElementById('main');
  if (old)
    refs.removeChild( old );

  var table = _div(refs, 'table center');
  table.id = 'main';
  table.style.width = '100%';
  spacer(table);

  var row = newRow(table);
  eolSPacer(row);
  MENU_JSON.forEach((item) => {
    if (item.break) {
        eolSPacer(row);
        spacer(table);
        row = newRow(table);
        eolSPacer(row);
    }
    else {
        showBtn(row, item);
	}
  });
  eolSPacer(row);
}

function _div(parent, cName) {
  var div = document.createElement('div');
  div.className = cName;
  parent.appendChild(div);
  return div;
}

function eolSPacer(row) {
  var s = _div(row, '');
  s.style.width = 'auto';
}

function getIndexJsonCB ()  {
  if (this.readyState != 4)
    return;
  if (this.status == 200) {
    MENU_JSON = JSON.parse(this.responseText);
    displayBtns();
  }
  else {
    document.getElementById('x1').innerHTML = 'There was an issue loading the recipie index file: ' + MENUREF_JSON_FILE;
  }
}

function getServicesJsonCB ()  {
  if (this.readyState != 4) return;
  if (this.status == 200) {
    K8S_IPS_JSON = JSON.parse(this.responseText);
  }
  else {
    document.getElementById('services_ips').innerHTML = 'There was an issue loading the service_ips JSON: ' + K8S_JSON_FILE;
  }
}

function init() {
  document.getElementById('menulinks').innerHTML = 'Loading ...';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = getIndexJsonCB;
  xhttp.open("GET", MENUREF_JSON_FILE, true);
  xhttp.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  xhttp.send();

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = getServicesJsonCB;
  xhttp.open("GET", K8S_JSON_FILE, true);
  xhttp.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  xhttp.send();
}

function incRef(amap,anitem) {
  if (amap[anitem])
    amap[anitem]++
  else
    amap[anitem] = 1
}

function newRow(table) {
  var outer = _div(table, 'row center');
  var t = _div(outer, 'table center');
  t.style.width = 'auto';
  return _div(t, 'row center');
}

function showBtn(parent, item) {
  var div = _div(parent, 'btn');
  div.style.height = MENUREF_HEIGHT+'px';
  div.style.width = MENUREF_WIDTH+'px';
  div.addEventListener('click', btnClick, false);
  div.html = item.ref;
  if (item.id)
    div.id = item.id;

  var title = item.text;
  var brk = title.indexOf(': ');

  var txt = title.substr(0,brk+1);
  div.appendChild(document.createTextNode(txt));
  div.appendChild(document.createElement('br'));
  txt = title.substr(brk+2);
  div.appendChild(document.createTextNode(txt));

  return MENUREF_WIDTH;
}

function spacer(parent) {
  var vspace = _div(parent, 'row vspace');
  vspace.style.width = '100%';
  return vspace;
}
