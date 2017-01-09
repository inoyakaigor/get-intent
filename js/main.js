function ajax(url) {
  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });
}

function resolve(data) {
  return window.ee.emit('repos.add', JSON.parse(data).slice(0, 50));
}

window.addEventListener('scroll', function(e) {
  var body = document.body, docEl = document.documentElement;
  scrollHeight = Math.max(
    body.scrollHeight, docEl.scrollHeight,
    body.offsetHeight, docEl.offsetHeight,
    body.clientHeight, docEl.clientHeight
  );

  if(window.pageYOffset == scrollHeight - docEl.clientHeight) {
    window.ee.emit('repos.get');
  }
});

window.addEventListener('DOMContentLoaded', function() {
  window.ee && window.ee.emit('repos.get');
});