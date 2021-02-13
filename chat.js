let status = document.getElementById("status");
var text_bar = document.getElementById('text');
var send_btn = document.getElementById('send');
var wrapper = document.getElementById('test');
var base = "http://erdum.42web.io";
var ks = "hide";
let inmsg = (text, time) => {
  let date = new Date();
  let ofs = date.getTimezoneOffset();
  ofs = ofs / 60;
  ofs = ofs * -1;
  if (Number(time.slice(4, 6)) >= 19) {
    var lh = '0' + String(Number(time.slice(4, 6)) - 19);
  } else {
    var lh = String(Number(time.slice(4, 6)) + ofs);
  }
  let lm = time.slice(6, 8);
  let lmo = String(Number(time.slice(0, 2)) + 1);
  let ld = time.slice(2, 4);
  let div = document.createElement('div');
  let p = document.createElement('p');
  let small = document.createElement('small');
  p.innerHTML = text;
  small.innerHTML = lmo + '/' + ld + ' ' + lh + ':' + lm;
  div.appendChild(p);
  div.appendChild(small);
  div.setAttribute('class', 'inmsg');
  wrapper.appendChild(div);
}
let outmsg = (text, time) => {
  let date = new Date();
  let ofs = date.getTimezoneOffset();
  ofs = ofs / 60;
  ofs = ofs * -1;
  if (Number(time.slice(4, 6)) >= 19) {
    var lh = '0' + String(Number(time.slice(4, 6)) - 19);
  } else {
    var lh = String(Number(time.slice(4, 6)) + ofs);
  }
  let lm = time.slice(6, 8);
  let lmo = String(Number(time.slice(0, 2)) + 1);
  let ld = time.slice(2, 4);
  let div = document.createElement('div');
  let p = document.createElement('p');
  let small = document.createElement('small');
  p.innerHTML = text;
  small.innerHTML = lmo + '/' + ld + ' ' + lh + ':' + lm;
  div.appendChild(p);
  div.appendChild(small);
  div.setAttribute('class', 'outmsg');
  wrapper.appendChild(div);
}
let updateFlag = (id) => {
  fetch(base+"/update.php?id="+id)
  .then(response => response.text())
  .then((response) => {
    if (response != "done") {
      alert("Error");
      location.reload();
    }
  });
}
let dateToString = (date) => {
  date = String(date);
  if (date.length == 1) {
    return '0' + date;
  } else {
    return date;
  }
}
let sendMsg = (id) => {
  if (text_bar.value != "") {
    let date = new Date();
    var data = {};
    data.msg = text_bar.value;
    data.date = dateToString(date.getMonth()) + dateToString(date.getDate()) + dateToString(date.getUTCHours()) + dateToString(date.getUTCMinutes());
    data.sender = id;
    data.r = '1';
    let json = JSON.stringify(data);
    fetch(base+"/send.php?password="+id+"&jsonData="+json)
    .then(response => response.text())
    .then(response => {
      if (response == "done") {
        outmsg(data.msg, data.date);
        text_bar.value = "";
      } else {
        alert("Error\nFailed to send message");
      }
    });
  }
}
let display = (id) => {
  var jsonData = {};
  status.innerHTML = "loading...";
  fetch(base+"/get.php")
  .then(response => response.json())
  .then(data => {
    status.innerHTML = "offline";
    if (data.st == "Found") {
      for (let i in data.data) {
        if (data.data[i].sender_id == id) {
          outmsg(data.data[i].msg, data.data[i].date_time);
        } else {
          inmsg(data.data[i].msg, data.data[i].date_time);
          updateFlag(data.data[i].id);
        }
      }
    }
  });
  setInterval(() => {
    fetch(base+"/get.php")
    .then(response => response.json())
    .then(data => {
      for (let i in data.data) {
        if (data.data[i].sender_id != id && data.data[i].r_check == '1') {
          inmsg(data.data[i].msg, data.data[i].date_time);
          updateFlag(data.data[i].id);
        }
      }
    });
    let time = new Date();
    jsonData.vs = document.visibilityState;
    jsonData.ks = ks;
    jsonData.onTime = time.getUTCSeconds();
    jsonData.id = id;
    let jsonStr = JSON.stringify(jsonData);
    document.cookie = id+"="+jsonStr;
    fetch(base+"/status.php?id="+id)
    .then(response => response.json())
    .then(data => {
      if (data.vs == "visible" && (jsonData.onTime - Number(data.onTime)) <= 4) {
        if (data.ks == "show") {
          status.innerHTML = "typing...";
        } else {
          status.innerHTML = "online";
        }
      } else {
        status.innerHTML = "offline";
      }
    });
  }, 1000);
}

text_bar.addEventListener("focus", () => {
  ks = "show";
});
text_bar.addEventListener("blur", () => {
  ks = "hide";
});
let password = window.prompt("Enter password: ");
if (password == "erdum") {
  const myId = "M";
  display(myId);
  send_btn.addEventListener("click", () => {
    sendMsg(myId);
  });
  var onEnter = () => {
    sendMsg(myId);
  }
} else if (password == "other") {
  const myId = "S";
  display(myId);
  send_btn.addEventListener("click", () => {
    sendMsg(myId);
  });
  var onEnter = () => {
    sendMsg(myId);
  }
} else {
  window.alert("Wrong password,\nreload page to login again !");
  document.body.style.display = "none";
}