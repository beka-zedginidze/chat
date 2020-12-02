const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const typing = document.getAnimations('typing');
const msgInput = document.getElementById('msg');
const btn = document.getElementById('btn');
const div1 = document.getElementById('typing');
const username1 = document.getElementById('username')

// Get username and room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log(username, room);

const socket = io();

//join chatRoom

socket.emit('joinRoom', {username, room})

// Get room and users

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUserName(users);
})

//Message form server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

})


// message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    
    const msg = e.target.elements.msg.value;

    //Emit message to the server
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();


});

//typing

msgInput.addEventListener('keypress', function() {
    socket.emit('typing', username)
});


//Output msg to DOM

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div1.innerHTML = '';
    div.innerHTML = `	<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

   

}

//Add room name to DOM

function outputRoomName(room) {
    roomName.innerText = room;

}

//Add user to DOM

function outputUserName(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}

socket.on('typing', function(data){
    div1.innerHTML = '<p><em>' + data + ' is typing a message... </em></p>';
    document.querySelector('.chat-messages').appendChild(div1);
  
});
