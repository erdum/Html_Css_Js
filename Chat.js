let status = document.getElementById('status');
let text_bar = document.getElementById('text');
let send_btn = document.getElementById('send');
let wrapper = document.getElementById('test');
let password = window.prompt("Enter password: ");
let keyStatus = "0";
let vs = "0";
text_bar.addEventListener("focus", () => {
  keyStatus = "1";
});
text_bar.addEventListener("blur", () => {
  keyStatus = "0";
});

let inmsg = (text, time) => {
  let date = new Date();
  let ofs = date.getTimezoneOffset();
  ofs = ofs / 60;
  ofs = ofs * -1;
  let lh = String(Number(time.slice(4, 6)) + ofs);
  let lm = time.slice(6, 8);
  let lmo = dts(Number(time.slice(0, 2)));
  let ld = time.slice(2, 4);
  let div = document.createElement('div');
  let p = document.createElement('p');
  let small = document.createElement('small');
  p.innerHTML = text;
  small.innerHTML = lmo + '-' + ld + ' ' + lh + ':' + lm;
  div.appendChild(p);
  div.appendChild(small);
  div.setAttribute('class', 'inmsg');
  wrapper.appendChild(div);
};
let outmsg = (text, time) => {
  let date = new Date();
  let ofs = date.getTimezoneOffset();
  ofs = ofs / 60;
  ofs = ofs * -1;
  let lh = String(Number(time.slice(4, 6)) + ofs);
  let lm = time.slice(6, 8);
  let lmo = dts(Number(time.slice(0, 2)));
  let ld = time.slice(2, 4);
  let div = document.createElement('div');
  let p = document.createElement('p');
  let small = document.createElement('small');
  p.innerHTML = text;
  small.innerHTML = lmo + '-' + ld + ' ' + lh + ':' + lm;
  div.appendChild(p);
  div.appendChild(small);
  div.setAttribute('class', 'outmsg');
  wrapper.appendChild(div);
};
let updateFlag = (id) => {
  let update = new XMLHttpRequest();
  let url = "http://erdum.42web.io/update.php?id=" + id;
  update.open("GET", url, false);
  update.send();
  if (update.responseText != 'done') {
    window.alert("Flag not updated error occured");
  }
};
let display = (id) => {
  status.innerHTML = "loading...";
  let time = new Object();
  let statusData = new Object();
  let data;
  let currS;
  let statusJson = new Object();
  let getData = new XMLHttpRequest();
  let getStatus = new XMLHttpRequest();
  url = "http://erdum.42web.io/get.php?password=" + id;
  getData.open("GET", url, true);
  getData.onload = () => {
    if (getData.readyState === 4 && getData.status === 200) {
      status.innerHTML = "offline";
      if (getData.responseText != '') {
        let json = new Object();
        json = JSON.parse(getData.responseText);
        for (i in json.data) {
          if (json.data[i].sender_id == id) {
            outmsg(json.data[i].msg, json.data[i].date_time);
            updateFlag(json.data[i].id);
          } else {
            inmsg(json.data[i].msg, json.data[i].date_time);
            updateFlag(json.data[i].id);
          }
        }
      }
    }
  }
  getData.send();
  window.setInterval(() => {
    time = std();
    if (document.visibilityState == 'visible') {
      vs = '1';
    } else {
      vs = '0';
    }
    statusData.time = Number(time[4]);
    currS = Number(time[4]);
    statusData.ks = keyStatus;
    statusData.vs = vs;
    statusData.id = id;
    data = JSON.stringify(statusData);
    getData.open("GET", url, true);
    getStatus.open("GET", "http://erdum.42web.io/status.php?data=" + data, false);
    getData.onload = () => {
      if (getData.readyState === 4 && getData.status === 200) {
        if (getData.responseText != '') {
          let json = new Object();
          json = JSON.parse(getData.responseText);
          for (i in json.data) {
            if (json.data[i].sender_id != id && json.data[i].r_check == '1') {
              inmsg(json.data[i].msg, json.data[i].date_time);
              updateFlag(json.data[i].id);
            }
          }
        }
      }
    }
    getStatus.send();
    getData.send();
    if (getStatus.responseText != '') {
      statusJson = JSON.parse(getStatus.responseText);
      if (statusJson.vs == '1' && ((currS - statusJson.time) >= 0 && (currS - statusJson.time) <= 2)) {
        if (statusJson.ks == '1') {
          status.innerHTML = "typing...";
        } else {
          status.innerHTML = "online";
        }
      } else {
        status.innerHTML = "offline";
      }
    }
  }, 1000);
};
let dts = (d) => {
  switch (d) {
    case 00:
      return "Jan";
      break;
    case 01:
      return "Feb";
      break;
    case 02:
      return "Mar";
      break;
    case 03:
      return "Apr";
      break;
    case 04:
      return "May";
      break;
    case 05:
      return "Jun";
      break;
    case 06:
      return "Jul";
      break;
    case 07:
      return "Aug";
      break;
    case 08:
      return "Sep";
      break;
    case 09:
      return "Oct";
      break;
    case 10:
      return "Nov";
      break;
    case 11:
      return "Dec";
      break;
  }
};
let std = () => {
  let date = new Date();
  let utcH = String(date.getUTCHours());
  let utcM = String(date.getUTCMinutes());
  let utcS = String(date.getUTCSeconds());
  let utcMo = String(date.getUTCMonth());
  let utcD = String(date.getUTCDate());
  let data = new Object();
  if (utcH.length == 1) {
    data[0] = '0' + utcH;
  } else {
    data[0] = utcH;
  }
  if (utcM.length == 1) {
    data[1] = '0' + utcM;
  } else {
    data[1] = utcM;
  }
  if (utcS.length == 1) {
    data[4] = '0' + utcS;
  } else {
    data[4] = utcS;
  }
  if (utcMo.length == 1) {
    data[2] = '0' + utcMo;
  } else {
    data[2] = utcMo;
  }
  if (utcD.length == 1) {
    data[3] = '0' + utcD;
  } else {
    data[3] = utcD;
  }
  return data;
};
let sendMsg = (id) => {
  if (text_bar.value != "") {
    let data = new Object();
    let dates = std();
    data.msg = text_bar.value;
    let utch = dates[0];
    let utcm = dates[1];
    let utcmo = dates[2];
    let utcd = dates[3];
    data.date = utcmo + utcd + utch + utcm;
    data.sender = id;
    data.r = "1";
    jsonData = JSON.stringify(data);
    let sendData = new XMLHttpRequest();
    let url = "http://erdum.42web.io/send.php?password=" + id + "&jsonData=" + jsonData;
    sendData.open("GET", url, false);
    sendData.send();
    if (sendData.responseText == "done") {
      text_bar.value = "";
      outmsg(data.msg, data.date);
    } else {
      window.alert(sendData.responseText);
    }
  }
};
if (password == "Erdum") {
  const myId = "M";
  display(myId);
  send_btn.addEventListener("click", () => {
    sendMsg(myId);
  });
} else if (password == "Other") {
  const myId = "S";
  display(myId);
  send_btn.addEventListener("click", () => {
    sendMsg(myId);
  });
} else {
  window.alert("Wrong password,\nreload page to login again !");
}