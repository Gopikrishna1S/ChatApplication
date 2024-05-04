
fetch('http://localhost:2000/fetchMsg')
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        addMsg(data)
    })
    .catch((e)=>{
        console.error(e)
    })

const addMsg = (data) => {
    const container = document.querySelector('.data')
    for (var i = 0; i < data.length; i++) {
        const div = document.createElement("div")
        div.innerHTML =  data[i].userName + ': ' + data[i].message
        container.appendChild(div)
    }
}

