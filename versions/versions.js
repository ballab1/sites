var VERSION_JSON = 'versions.json';

var orgJSON;

function displayVersions(json) {
  var x1 = document.getElementById('x1');
  x1.innerHTML = '';
  var table = document.createElement('div');
  table.className = 'table center';
  table.id = 'main';
  var old = document.getElementById('main');
  if (old)
    x1.removeChild( old );
  x1.appendChild( table );

  for (var i = 0; i < json.length;) {
    var row = document.createElement('div');
    row.className = 'row';
    table.appendChild(row);
    showVersion(json[i++], row);
  }
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
    displayVersions(orgJSON);
  }
  else {
    document.getElementById('x1').innerHTML = 'There was an issue loading the recipie index file: ' + VERSION_JSON;
  }
}

function getLatest() {
}

function getLatestRelease(url) {

  return null;
}

function init() {
  document.getElementById('x1').innerHTML = 'Loading ...';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = getIndexJsonCB;
  xhttp.open("GET", VERSION_JSON, true);
  xhttp.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  xhttp.send();
}

function showVersion(item, parent) {

  var div = document.createElement('div');
  div.className = 'box left';
  var a = document.createElement('a');
  a.href = item.url;
  a.title = item.name;
  a.appendChild( document.createTextNode(item.name) );
  div.appendChild(a);
  parent.appendChild(div);

  div = document.createElement('div');
  div.className = 'box wspace';
  parent.appendChild(div);


  div = document.createElement('div');
  div.className = 'box version';
  txt = document.createTextNode(item.version);
  div.appendChild(txt);
  parent.appendChild(div);


  div = document.createElement('div');
  div.className = 'box version';

  var id;
  var release = getLatestRelease(item.url);
  if (release) {
       id = document.createElement('a');
       id.href = item.url;
       id.title = release;
       id.appendChild( document.createTextNode(release) );
  }
  else {
      id = document.createTextNode(' ');
  }
  div.appendChild(id);
  parent.appendChild(div);


  div = document.createElement('div');
  div.className = 'box wspace';
  parent.appendChild(div);


  div = document.createElement('div');
  div.className = 'box wspace';
  parent.appendChild(div);


  div = document.createElement('div');
  div.className = 'box left';
  id = document.createTextNode(item.id);
  div.appendChild(id);
  parent.appendChild(div);
}
