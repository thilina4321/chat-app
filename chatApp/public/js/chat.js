const socket = io();
const { name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
let userId;

//elements
$form = document.querySelector("#form");
$msg = document.querySelector("#msg");
$btnSend = document.querySelector("#btnSend");
$btnLocation = document.querySelector("#btnLocation");
$messages = document.querySelector("#messages");

//templates
$messagesTemplateSameUser = document.querySelector("#messagesSameUser-template")
  .innerHTML;
$messagesTemplateOtherUser = document.querySelector(
  "#messagesOtherUser-template"
).innerHTML;
$locationTemplateSame = document.querySelector("#location-template-same").innerHTML;
$locationTemplateOther = document.querySelector("#location-template-other").innerHTML;
$roomDataTemplate = document.querySelector("#room-template").innerHTML;

let messageScrollTop = 0;

const autoScroll = () => {
  //new message
  const newMessage = $messages.lastElementChild;
  // new message height with margin
  const newMsgStyle = getComputedStyle(newMessage);
  const marginHeight = parseInt(newMsgStyle.marginBottom);
  const newMsgHeight = newMessage.offsetHeight + marginHeight;

  //visible height
  const visibleHeight = $messages.offsetHeight;
  // container height
  const containerHeight = $messages.scrollHeight;

  // my position
  const myPosition = $messages.offsetHeight + $messages.scrollTop;

  if (containerHeight - newMsgHeight * 2 <= myPosition) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (msg, userName, id) => {
  let html;
  if (id == this.userId) {
    html = Mustache.render($messagesTemplateSameUser, {
      userName: userName,
      messages: msg.text,
      createdAt: moment(msg.createdAt).format("h:mm a"),
    });
  } else {
    html = Mustache.render($messagesTemplateOtherUser, {
      userName: userName,
      messages: msg.text,
      createdAt: moment(msg.createdAt).format("h:mm a"),
    });
  }

  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", (room, users) => {
  console.log(room);
  console.log(users);
  const html = Mustache.render($roomDataTemplate, {
    roomName: room,
    users: users,
  });

  document.querySelector("#chat__sidebar").innerHTML = html;
});

socket.on("sendLocation", (url, userName, id) => {
  let html;
  if (id == this.userId) {
    html = Mustache.render($locationTemplateSame, {
      location: url.url,
      userName:userName,
      createdAt: moment(url.createdAt).format("h:mm a"),
    });
  } else {
    html = Mustache.render($locationTemplateOther, {
        location: url.url,
        userName:userName,
        createdAt: moment(url.createdAt).format("h:mm a"),
      });
  }
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
  console.log(url);
});

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();

  $btnSend.setAttribute("disabled", "disabled");
  // let msge = document.querySelector('#msg')
  let msge = e.target.msg.value;

  socket.emit("send", msge, (m) => {
    $btnSend.removeAttribute("disabled");
    $msg.value = "";
    $msg.focus();
    console.log(m);
  });
});

document.querySelector("#btnLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Browser not support");
  }

  $btnLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);

    socket.emit(
      "location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location shared");
        $btnLocation.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { name, room }, (error, id) => {
  if (error) {
    alert(error);
    location.href = "/";
  } else {
    this.userId = id;
  }
});
