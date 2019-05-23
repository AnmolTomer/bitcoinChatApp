function onDOMLoaded(){
    // starting time loop for home page
    timeLoop()


// Instantiating client side socket.io and connecting to our node socket
let socket = io.connect()

// add event listeners

addEventListeners(socket)

// unhide homepage div (Single Page App( (SPA)

render(window.location.hash);

// clear session storage in case of browser refresh
sessionStorage.clear()

// end onDOMLoaded
}

//****************************START EVENT LISTENERS************************************************
function addEventListeners(socket)
//  #1 REGULAR EVENT HANDLERS

// EVENT LISTENER FOR USER LOGIN (click)
const btn_go = document.getElementById("go_btn")
btn_go.addEventListener("click", (e)=>{
    e.preventDefault()

    if(sessionStorage.userName){
        alert(sessionStorage.userName + ' is already logged in via this window')
        return;
    }
    //get uName from uname-input
    let unameText = document.getElementById("uname_input").value

    $.ajax({
        type: "POST",
        url: "/",
        contentType: "application/json",
        data: JSON.stringify( {userName: unameText}),
        success:(data) =>{
            if(data !="")
                {
                    let obj = JSON.parse(data);
                    if (obj.error){
                        alert(obj.error);
                    }else{
                        //update sessionStorage to reflect user is logged in
                        sessionStorage.userName = obj.userName;
                        sessionStorage.fName = obj.fName;
                        sessionStorage.lName = obj.lName;
                        //personalize page
                        updatePage(obj);

                        //*****COMMUNICATE NEW USER TO SERVER VIA WEBSOCKET*****
                        socket.emit('newUserToServer', obj.userName);
                    }
                } //end if(data !=
            }
        })
    })//end handler
    //--------------------------------------------

//----------------------------
//Event listener for message submit (submit)
    document.getElementById("messageForm").addEventListener('submit',(e)=>{
        e.preventDefault()
        // check if user is logged in..if ok then send msg else tell Please login if you wish to chat alert
        if(sessionStorage.userName == undefined){
            alert("Please login if you wish to chat.")
        }else{
            //*****COMMUNICATE NEW MESSAGE TO SERVER VIA WEBSOCKET*****
            let txtArea_msg = document.getElementById('message');
            socket.emit('msgObjectToServer', {userName: sessionStorage.userName, msg: txtArea_msg.value});
            //clear textArea
            txtArea_msg.value = "";
        }

    })
//------------------------------------