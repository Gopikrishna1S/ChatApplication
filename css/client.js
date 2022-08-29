const socket = io('http://localhost:2000')

const form = document.getElementById('send-container')
const msgInput = document.getElementById('msgInput')
const msgContainer = document.querySelector('.container')

const addToChatBox = (msg, position) => {
    const msgElement = document.createElement('div')
    msgElement.innerText = msg
    msgElement.classList.add('msg')
    msgElement.classList.add(position)
    msgContainer.append(msgElement)
}


form.addEventListener ('submit', e => {
    e.preventDefault()
    const message = msgInput.value
    socket.emit('send-msg', message)
    addToChatBox(`You: ${message}`, 'right')
    msgInput.value = ''
})

const enterName = () => {
    const userName = prompt('Enter your name')
    if (userName === null || userName === ""){
        enterName()
    }
    return userName
}

userName = enterName()

socket.emit('new-user-joined', userName) 


socket.on('user-joined', name=>{
    addToChatBox(`${name} joined the chat`, "center")
})

socket.on('receive-msg', data => {
    addToChatBox(`${data.name}: ${data.message}`, 'left')
})

socket.on('user-disconnected', data => {
    addToChatBox(`${data} left the chat`, 'center')
})