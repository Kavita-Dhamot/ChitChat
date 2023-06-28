let connection;
let localMediaStream;
let remoteMediaStream;
let textChannelStream;
let conversation = [];
let exchange = [];
let exit = 0;

let mainContainer = document.getElementById('main-box');
let connectContainer = document.getElementById('connect-box');
let videoContainer = document.getElementById('video-box');

let localVideo = document.getElementById('local');
let remoteVideo = document.getElementById('remote');
let localScreenShare = document.getElementById('local-screen-share');
let remoteScreenShare = document.getElementById('remote-screen-share');

let createOfferAnswerButton = document.getElementById('create-offer-answer');
let sendMessageButton = document.getElementById('send-button');
let sendMessageTextArea = document.getElementById('send-message');
let offerAnswerBox = document.getElementById('answer-offer-box');
let submitButton = document.getElementById('submit');



let activeButtonColor = '#49B568';
let disabledButtonColor = '#121212';

let buttonPrimaryColorGreen = '#49B568';


const BUTTON_THEMES = {
    AUDIO_BACKGROUND_COLOR: [activeButtonColor, disabledButtonColor],
    VIDEO_BACKGROUND_COLOR: [activeButtonColor, disabledButtonColor],
    SCREEN_BACKGROUND_COLOR: [disabledButtonColor,activeButtonColor],
}


// Const UserName 
const localUserName = 'Me';
const remoteUserName = 'Remote';

const localUserLabels = [];
const RemoteUserLabels = [];


// Audio 
const localAudioButtons = ['audio-pause-button-home', 'audio-pause-button'];
const localAudioIcons = ['local-video-audio-icon', 'sample-video-audio-icon'];
const remoteAudioIcons = ['remote-video-audio-icon'];
const localScreenShareAudioIcons = ['local-screen-share-video-audio-icon'];
const remoteScreenShareAudioIcons = ['remote-screen-share-video-audio-icon'];


// Video  
const localVideos = ['local', 'sample-video'];
const remoteVideos = ['remote'];

// Main video 
const mainVideos = ['main-stream'];

const localVideoButtons = ['video-pause-button', 'video-pause-button-home'];



// Screen Share  
const screenShareButtons = ['screen-share-button'];
const localScreenShareVideos = ['local-screen-share'];
const remoteScreenShareVideos = ['remote-screen-share'];
const localScreenShareVideosContainer = ['local-screen-share-container'];
const remoteScreenShareVideosContainer = ['remote-screen-share-container'];

// Name 
const localVideosLabels = ['local-video-label', 'sample-video-label'];
const remoteVideosLabels = ['remote-video-label'];
const localScreenShareVideosLabels = ['local-screen-share-video-label'];
const remoteScreenShareVideosLabels = ['remote-screen-share-video-label'];





const MESSAGE_TYPE = {
    SYSTEM: 'SYSTEM',
    USER: 'USER'
}

const SYSTEM_MESSAGE = {
    SCREEN_SHARE_ENABLED: 'SCREEN_SHARE_ENABLED',
    SCREEN_SHARE_DISABLED: 'SCREEN_SHARE_DISABLED',

    VIDEO_ENABLED: 'VIDEO_ENABLED',
    VIDEO_DISABLED: 'VIDEO_DISABLED',

    AUDIO_ENABLED: 'AUDIO_ENABLED',
    AUDIO_DISABLED: 'AUDIO_DISABLED',

    REMOTE_EXIT_MEET: 'REMOTE_EXIT_MEET',
}

const setStream = (stream, subscribers) => {
    subscribers.forEach(subscriber => {
        document.getElementById(subscriber).srcObject = stream;
    })
}

const setLabel = (label, subscribers) => {
    subscribers.forEach(subscriber => {
        document.getElementById(subscriber).innerText = label;
    })
}


function getVisibleStream() {
       return 2 + ENABLED_STREAMS.LOCAL_SCREEN_SHARE_STREAM + ENABLED_STREAMS.REMOTE_SCREEN_SHARE_STREAM;
}


function handleView() {
    let count = getVisibleStream();
    console.log('Count',count);
    document.querySelectorAll('.video-element-container').forEach(item => {
        item.style.width = `${100 / count}%`
    })

    if (count > 2) {
        document.getElementById('video-box').style.height = `20vh`;
        document.querySelectorAll('.video-element-container').forEach(item => {
            item.style.width = `20vw`;
        });
        dispatch(DISPATCH_TYPE.SET_MAIN_VIDEO_STREAM,{
            stream:localVideo.srcObject,
        })
        dispatch(DISPATCH_TYPE.ENABLE_MAIN_VIDEO);
        document.getElementById('main-stream').style.height = `60vh`;
    }
    else {
        document.getElementById('video-box').style.height = `80vh`
        dispatch(DISPATCH_TYPE.DISABLE_MAIN_VIDEO);
    }


}



const toggleView = (shouldEnable, subscribers) => {
    subscribers.forEach(subscriber => {
        const elementClassList = document.getElementById(subscriber).classList;
        if(shouldEnable) {
            elementClassList.add('unhide');
            elementClassList.remove('hide');
        } else {
            elementClassList.add('hide');
            elementClassList.remove('unhide');
        }
    })
};

const toggleVideoStreams = (shouldEnable, streams) => {
    streams.forEach(stream => {
        const streamSrc = document.getElementById(stream).srcObject;
        if (streamSrc.getTracks()[1].enabled !== shouldEnable)
            streamSrc.getTracks()[1].enabled = !streamSrc.getTracks()[1].enabled;
    })
}

const toggleScreenShareStreams = (shouldEnable, streams) => {
    streams.forEach(stream => {
        const streamSrc = document.getElementById(stream).srcObject;
        if (streamSrc.getTracks()[0].enabled !== shouldEnable)
            streamSrc.getTracks()[0].enabled = !streamSrc.getTracks()[0].enabled;
    })

}

const toggleAudioStreams = (shouldEnable, streams) => {
    streams.forEach(stream => {
        const streamSrc = document.getElementById(stream).srcObject;
        if (streamSrc.getTracks()[0].enabled !== shouldEnable)
            streamSrc.getTracks()[0].enabled = !streamSrc.getTracks()[0].enabled;
    })
}

const toggleButtons = (shouldEnable, subscribers, themes) => {
    subscribers.forEach(subscriber => {
        document.getElementById(subscriber).style.backgroundColor = themes[Number(!shouldEnable)];
    })
}

const ENABLED_STREAMS = {
    LOCAL_SCREEN_SHARE_STREAM: false,
    REMOTE_SCREEN_SHARE_STREAM: false,
}


const toggleIcons = (shouldEnable, subscribers) => {
    subscribers.forEach(subscriber => {
        console.log('subscriber', document.getElementById(subscriber).src);
        document.getElementById(subscriber).src = shouldEnable ? "icons/audio.png" :"icons/audio-off.png" ;
    })
}

const DISPATCH_TYPE = {
    SET_LOCAL_STREAM: 'SET_LOCAL_STREAM',
    SET_REMOTE_STREAM: 'SET_REMOTE_STREAM',

    SET_LOCAL_STREAM_LABEL: 'SET_LOCAL_STREAM_LABEL',
    SET_REMOTE_STREAM_LABEL: 'SET_REMOTE_STREAM_LABEL',

    ENABLE_LOCAL_VIDEO_STREAM: 'ENABLE_LOCAL_VIDEO_STREAM',
    DISABLE_LOCAL_VIDEO_STREAM: 'DISABLE_LOCAL_VIDEO_STREAM',

    ENABLE_LOCAL_AUDIO_STREAM: 'ENABLE_LOCAL_AUDIO_STREAM',
    DISABLE_LOCAL_AUDIO_STREAM: 'DISABLE_LOCAL_AUDIO_STREAM',

    ENABLE_REMOTE_AUDIO_STREAM: 'ENABLE_LOCAL_AUDIO_STREAM',
    DISABLE_REMOTE_AUDIO_STREAM: 'DISABLE_LOCAL_AUDIO_STREAM',


    SET_LOCAL_SCREEN_SHARE_STREAM: 'SET_LOCAL_SCREEN_SHARE_STREAM',
    SET_LOCAL_SCREEN_SHARE_STREAM_LABEL: 'SET_LOCAL_SCREEN_SHARE_STREAM_LABEL',
    ENABLE_LOCAL_SCREEN_SHARE_STREAM: 'ENABLE_LOCAL_SCREEN_SHARE_STREAM',
    DISABLE_LOCAL_SCREEN_SHARE_STREAM: 'DISABLE_LOCAL_SCREEN_SHARE_STREAM',

    SET_REMOTE_SCREEN_SHARE_STREAM: 'SET_REMOTE_SCREEN_SHARE_STREAM',
    SET_REMOTE_SCREEN_SHARE_STREAM_LABEL: 'SET_REMOTE_SCREEN_SHARE_STREAM_LABEL',
    ENABLE_REMOTE_SCREEN_SHARE_STREAM: 'ENABLE_REMOTE_SCREEN_SHARE_STREAM',
    DISABLE_REMOTE_SCREEN_SHARE_STREAM: 'DISABLE_REMOTE_SCREEN_SHARE_STREAM',

    SET_MAIN_VIDEO_STREAM: 'SET_MAIN_VIDEO_STREAM',
    SET_MAIN_VIDEO_LABEL: 'SET_MAIN_VIDEO_LABEL',
    ENABLE_MAIN_VIDEO: 'ENABLE_MAIN_VIDEO',
    DISABLE_MAIN_VIDEO: 'DISABLE_MAIN_VIDEO',

}




const dispatch = (type, payload) => {
    console.log(type);
    switch (type) {
        case DISPATCH_TYPE.SET_LOCAL_STREAM: {
            setStream(payload.stream, localVideos)
            return;
        }
        case DISPATCH_TYPE.SET_REMOTE_STREAM: {
            setStream(payload.stream, remoteVideos);
            return;
        }
        case DISPATCH_TYPE.SET_LOCAL_STREAM_LABEL: {
            // setLabel(localUserName, localVideosLabels)
            return;
        }
        case DISPATCH_TYPE.SET_REMOTE_STREAM_LABEL: {
            // setLabel(remoteUserName, remoteVideosLabels)
            return;
        }
        case DISPATCH_TYPE.SET_LOCAL_SCREEN_SHARE_STREAM_LABEL: {
            // setLabel(localUserName+' Screen', localScreenShareVideosLabels)
            return;
        }
        case DISPATCH_TYPE.SET_REMOTE_SCREEN_SHARE_STREAM_LABEL: {
            // setLabel(remoteUserName+' Screen', remoteScreenShareVideosLabels)
            return;
        }
        case DISPATCH_TYPE.ENABLE_LOCAL_VIDEO_STREAM: {
            toggleVideoStreams(true, localVideos);
            toggleButtons(true, localVideoButtons, BUTTON_THEMES.VIDEO_BACKGROUND_COLOR)
            return;
        }
        case DISPATCH_TYPE.DISABLE_LOCAL_VIDEO_STREAM: {
            toggleVideoStreams(false, localVideos);
            toggleButtons(false, localVideoButtons, BUTTON_THEMES.VIDEO_BACKGROUND_COLOR)
            return;
        }
        case DISPATCH_TYPE.ENABLE_LOCAL_AUDIO_STREAM: {
            toggleAudioStreams(true, localVideos);
            toggleButtons(true, localAudioButtons, BUTTON_THEMES.AUDIO_BACKGROUND_COLOR);
            // toggleIcons(true,localAudioIcons);
            sentOverDataStream(MESSAGE_TYPE.SYSTEM, SYSTEM_MESSAGE.AUDIO_ENABLED);
            return;
        }
        case DISPATCH_TYPE.DISABLE_LOCAL_AUDIO_STREAM: {
            toggleAudioStreams(false, localVideos);
            toggleButtons(false, localAudioButtons, BUTTON_THEMES.AUDIO_BACKGROUND_COLOR);
            // toggleIcons(false,localAudioIcons);
            sentOverDataStream(MESSAGE_TYPE.SYSTEM, SYSTEM_MESSAGE.AUDIO_DISABLED);
            return;
        }
        case DISPATCH_TYPE.ENABLE_REMOTE_AUDIO_STREAM: {
            // toggleIcons(true,remoteAudioIcons);
            return;
        }
        case DISPATCH_TYPE.DISABLE_REMOTE_AUDIO_STREAM: {
            // toggleIcons(false,remoteAudioIcons);
            return;
        }
        case DISPATCH_TYPE.SET_LOCAL_SCREEN_SHARE_STREAM: {
            setStream(payload.stream, localScreenShareVideos);
            break;
        }
        case DISPATCH_TYPE.SET_REMOTE_SCREEN_SHARE_STREAM: {
            setStream(payload.stream, remoteScreenShareVideos);
            break;
        }
        case DISPATCH_TYPE.ENABLE_LOCAL_SCREEN_SHARE_STREAM: {
            toggleScreenShareStreams(true, localScreenShareVideos);
            toggleView(true, localScreenShareVideosContainer);
            toggleButtons(true, screenShareButtons, BUTTON_THEMES.SCREEN_BACKGROUND_COLOR);
            ENABLED_STREAMS.LOCAL_SCREEN_SHARE_STREAM = true;
            break;
        }
        case DISPATCH_TYPE.DISABLE_LOCAL_SCREEN_SHARE_STREAM: {
            toggleScreenShareStreams(false, localScreenShareVideos);
            toggleView(false, localScreenShareVideosContainer);
            toggleButtons(false, screenShareButtons, BUTTON_THEMES.SCREEN_BACKGROUND_COLOR);
            ENABLED_STREAMS.LOCAL_SCREEN_SHARE_STREAM = false;
            break;
        }
        case DISPATCH_TYPE.ENABLE_REMOTE_SCREEN_SHARE_STREAM: {
            toggleView(true, remoteScreenShareVideosContainer);
            ENABLED_STREAMS.REMOTE_SCREEN_SHARE_STREAM = true;
            break;
        }
        case DISPATCH_TYPE.DISABLE_REMOTE_SCREEN_SHARE_STREAM: {
            toggleView(false, remoteScreenShareVideosContainer);
            ENABLED_STREAMS.REMOTE_SCREEN_SHARE_STREAM = false;
            break;
        }
        case DISPATCH_TYPE.SET_MAIN_VIDEO_STREAM: {
            setStream(payload.stream, mainVideos);
            return;
        }
        case DISPATCH_TYPE.ENABLE_MAIN_VIDEO :{
            toggleView(true, mainVideos);
            return;
        }
        case DISPATCH_TYPE.DISABLE_MAIN_VIDEO :{
            toggleView(false, mainVideos);
            return;
        }
    }
    handleView();
}



let offerAnswerTextArea = document.getElementById('offer-answer-area');

let offer = { description: "", candidate: "" };
let answer = { description: "", candidate: "" };;
let isScreenShareEnabled = false;
let ssStreamTrack = [];
var arrayToStoreChunks = [];

function onSuccess() { };
function onError(error) { console.error(error); };
function encrypt(obj) { return JSON.stringify(obj); };
function decrypt(obj) { return JSON.parse(obj); }


let setupConnection = async () => {
    setupConnectView();
    startWebRTC();
}

let state = 0;
// let socket = io('http://127.0.0.1:8080/');// Uncomment this for socket
// socket.on('connect', () => { console.log(socket.id) });// Uncomment this for socket


function startWebRTC() {

    connection = new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            },
            {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
            },
            {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject",
            },
            {
                urls: "turn:openrelay.metered.ca:443?transport=tcp",
                username: "openrelayproject",
                credential: "openrelayproject",
            },
            {
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
            {
                url: 'turn:192.158.29.39:3478?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            },
            {
                url: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            },
            {
                url: 'turn:turn.bistri.com:80',
                credential: 'homeo',
                username: 'homeo'
            },
            {
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
            }
        ],
    });

    textChannelStream = connection.createDataChannel('dataChannel');

    connection.ondatachannel = e => {
        const receiveChannel = e.channel;
        receiveChannel.onmessage = event => {
            const payload = decrypt(event.data);
            console.log('$$',payload.message);
            if (payload.type == MESSAGE_TYPE.SYSTEM) {
                if (payload.message == SYSTEM_MESSAGE.SCREEN_SHARE_ENABLED) {
                    dispatch(DISPATCH_TYPE.ENABLE_REMOTE_SCREEN_SHARE_STREAM);
                }
                else if (payload.message == SYSTEM_MESSAGE.SCREEN_SHARE_DISABLED) {
                    dispatch(DISPATCH_TYPE.DISABLE_REMOTE_SCREEN_SHARE_STREAM);
                } else if (payload.message == SYSTEM_MESSAGE.REMOTE_EXIT_MEET) {
                    window.location.reload();
                } else if (payload.message == SYSTEM_MESSAGE.AUDIO_ENABLED) {
                    // dispatch(DISPATCH_TYPE.ENABLE_REMOTE_AUDIO_STREAM);
                }  else if (payload.message == SYSTEM_MESSAGE.AUDIO_DISABLED) {
                    // dispatch(DISPATCH_TYPE.DISABLE_REMOTE_AUDIO_STREAM);
                }
           }
            else
                addMessage(2, remoteUserName+': ' + payload.message);
        }
        receiveChannel.onopen = e => {
            startMeet();
        }

    }

    connection.onicecandidate = (event) => {
        if (event.candidate) {
            exchange.push(encrypt(event.candidate));
        }
    };

    
    // socket.on('message', (obj) => {// Uncomment this for socket
        document.getElementById('submit-offer-answer').addEventListener('click', function () { // Comment this for socket
        let obj = document.getElementById('offer-answer-area').value; // Comment this for socket
        let message = decrypt(obj);
        if (decrypt(message.description).type == 'offer' && state === 0) {
            state = 2;
            connection.setRemoteDescription(new RTCSessionDescription(decrypt(message.description)), () => {
                connection.createAnswer().then(handleLocalDescription).then(addIce(message.candidate));
                setTimeout(createIceAnswer, 1000);
            });
        }
        else if (decrypt(message.description).type == 'answer' && state === 1) {
            connection.setRemoteDescription(new RTCSessionDescription(decrypt(message.description)), () => {
                addIce(message.candidate);
            });

        }
    }
     )

    const createOfferAnswer = () => {
        state = 1;
        connection.createOffer().then(handleLocalDescription).catch(onError);
        setTimeout(createIceOffer, 1000);
    }

    createOfferAnswerButton.addEventListener('click', () => {
        createOfferAnswer();
    });



    let flg = 0;
    connection.ontrack = event => {
        const stream = event.streams[0];

        if (flg == 0) {
            dispatch(DISPATCH_TYPE.SET_REMOTE_STREAM, { stream });
            flg++;
        }
        else {
            dispatch(DISPATCH_TYPE.SET_REMOTE_SCREEN_SHARE_STREAM, { stream });
            dispatch(DISPATCH_TYPE.DISABLE_REMOTE_SCREEN_SHARE_STREAM);

        }
    };

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    }).then(stream => {
        dispatch(DISPATCH_TYPE.SET_LOCAL_STREAM, {
            stream
        });
       
        stream.getTracks().forEach(track => connection.addTrack(track, stream))

    }, onError);

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    }).then(stream => {

        stream.getTracks().forEach(track => { ssStreamTrack.push(connection.addTrack(track, stream)); })
        dispatch(DISPATCH_TYPE.SET_LOCAL_SCREEN_SHARE_STREAM, { stream });
        dispatch(DISPATCH_TYPE.DISABLE_LOCAL_SCREEN_SHARE_STREAM);

    }, onError);

    document.getElementById('screen-share-button').addEventListener('click', () => {
        if (!ENABLED_STREAMS.LOCAL_SCREEN_SHARE_STREAM) { // Local Screen Share is not active
            navigator.mediaDevices.getDisplayMedia().then(stream => {
                
                dispatch(DISPATCH_TYPE.SET_LOCAL_SCREEN_SHARE_STREAM, { stream });
                dispatch(DISPATCH_TYPE.ENABLE_LOCAL_SCREEN_SHARE_STREAM);

                localScreenShare.srcObject.oninactive = function () {
                    dispatch(DISPATCH_TYPE.DISABLE_LOCAL_SCREEN_SHARE_STREAM);
                    sentOverDataStream(MESSAGE_TYPE.SYSTEM, SYSTEM_MESSAGE.SCREEN_SHARE_DISABLED);
                }

                ssStreamTrack[0].replaceTrack(stream.getTracks()[0]);

                sentOverDataStream(MESSAGE_TYPE.SYSTEM, SYSTEM_MESSAGE.SCREEN_SHARE_ENABLED);

            }, onError);
        }
        else { // Local Screen Share is active
            // dispatch(DISPATCH_TYPE.DISABLE_LOCAL_SCREEN_SHARE_STREAM);
            // sentOverDataStream(MESSAGE_TYPE.SYSTEM, SYSTEM_MESSAGE.SCREEN_SHARE_DISABLED);
            // isScreenShareEnabled = false;

        }
    });





    document.getElementById('video-pause-button').addEventListener('click', () => {
        localVideo.srcObject.getTracks()[1].enabled ? dispatch(DISPATCH_TYPE.DISABLE_LOCAL_VIDEO_STREAM) : dispatch(DISPATCH_TYPE.ENABLE_LOCAL_VIDEO_STREAM);
    });


    document.getElementById('video-pause-button-home').addEventListener('click', () => {
        localVideo.srcObject.getTracks()[1].enabled ? dispatch(DISPATCH_TYPE.DISABLE_LOCAL_VIDEO_STREAM) : dispatch(DISPATCH_TYPE.ENABLE_LOCAL_VIDEO_STREAM);
    });


    document.getElementById('audio-pause-button').addEventListener('click', () => {
        localVideo.srcObject.getTracks()[0].enabled ? dispatch(DISPATCH_TYPE.DISABLE_LOCAL_AUDIO_STREAM) : dispatch(DISPATCH_TYPE.ENABLE_LOCAL_AUDIO_STREAM);
    });

    document.getElementById('audio-pause-button-home').addEventListener('click', () => {
        localVideo.srcObject.getTracks()[0].enabled ? dispatch(DISPATCH_TYPE.DISABLE_LOCAL_AUDIO_STREAM) : dispatch(DISPATCH_TYPE.ENABLE_LOCAL_AUDIO_STREAM);
    });

  

    function addIce(candidates) {
        let message = decrypt(candidates);
        message.forEach((item) => {
            let candidate = JSON.parse(item);
            connection.addIceCandidate(
                new RTCIceCandidate(candidate), onSuccess, onError
            );
        });

    }


    function createIceOffer() {
        offer.candidate = encrypt(exchange);
        document.getElementById('offer-answer-area').value = encrypt(offer);
        //socket.emit('message', encrypt(offer)); // Uncomment this for socket
    }

    function createIceAnswer() {
        answer.candidate = encrypt(exchange);
        // socket.emit('message', encrypt(answer)); // Uncomment this for socket // uncomment this for socket connection
        document.getElementById('offer-answer-area').value = encrypt(answer);
    }

    function handleLocalDescription(description) {
        connection.setLocalDescription(description);
        if (description.type === 'offer') {
            offer.description = encrypt(description);
        }
        else {
            answer.description = encrypt(description);
        }
    }


}



function videoEventListenersAdd() {
    // Event listener to pin each video
    const videoStreams = [...localVideos, ...remoteVideos, ...localScreenShareVideos, ...remoteScreenShareVideos]
    videoStreams.forEach((videoStream) => {
        document.getElementById(videoStream).addEventListener('click', () => {
            dispatch()
            document.getElementById('main-stream').srcObject = document.getElementById(videoStream).srcObject;
            dispatch(DISPATCH_TYPE.SET_MAIN_VIDEO_STREAM,{
                stream: document.getElementById(videoStream).srcObject
            });
        })
    })
}






function setupConnectView() {
    document.getElementById('video-box').style.display = 'none';
    document.getElementById('chat-box').style.display = 'none';
    document.getElementById('media-options-box').style.display = 'none';
    document.getElementsByTagName("BODY")[0].style.backgroundColor = '#202020';
    dispatch(DISPATCH_TYPE.SET_LOCAL_STREAM_LABEL);
    dispatch(DISPATCH_TYPE.SET_REMOTE_STREAM_LABEL);
    dispatch(DISPATCH_TYPE.SET_LOCAL_SCREEN_SHARE_STREAM_LABEL);
    dispatch(DISPATCH_TYPE.SET_REMOTE_SCREEN_SHARE_STREAM_LABEL);
}



function hideConnectView() {
    connectContainer.style.display = 'none';
}

function setupMeetView() {
    document.getElementById('video-box').style.display = 'flex';
    document.getElementById('chat-box').style.display = 'flex';
    document.getElementById('media-options-box').style.display = 'flex';

}




function startMeet() {
    hideConnectView();
    setupMeetView();
    videoEventListenersAdd();
    document.getElementsByTagName("BODY")[0].style.backgroundColor = '#121212';
    handleView();
}




// Chat Area 

function addMessage(a, message) {
    const chats = document.getElementById('all-chats-id');
    if (conversation.length == 0)
        chats.style.backgroundColor = 'transparent';
    conversation.push(message);
    if (a == 1)
        chats.innerHTML = chats.innerHTML + ` <p class="chats me" id = 'chatid${conversation.length}'>${message}</p>`;
    else
        chats.innerHTML = chats.innerHTML + ` <p class="chats sender" id = 'chatid${conversation.length}'>${message}</p>`;
    updateScroll();
}

function sentOverDataStream(type, message) {
    textChannelStream.send(encrypt({
        type: type,
        message: message
    }));
}

function onSend() {
    addMessage(1, "Me: " + sendMessageTextArea.value);
    sentOverDataStream(MESSAGE_TYPE.USER, sendMessageTextArea.value);
    sendMessageTextArea.value = "";
    document.activeElement.blur();

}

function updateScroll() {
    const chats = document.getElementById('all-chats-id');
    chats.scrollTop = chats.scrollHeight - chats.clientHeight;

}


sendMessageButton.addEventListener('click', onSend);
//window.addEventListener('resize', handleResponsive , true);
sendMessageTextArea.onkeypress = (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        onSend();
    }
};

setupConnection()


function isEllipsisActive(e) {
    return (e.offsetWidth < e.scrollWidth);
}



function handleResponsive(event) {
    // console.log(window.innerHeight + " " + window.innerWidth);
    // if(window.innerWidth<600)
    // {
    //     handleResponsiveOverflow();  
    // }
    // else 
    // {
    //     handleResponsiveUnderflow();
    // }
}

function handleResponsiveOverflow() {
    // console.log(offerAnswerBox.classList);
    offerAnswerBox.classList.remove('flexRow');
    offerAnswerBox.classList.add('flexCol');
    videoContainer.classList.remove('flexRow');
    videoContainer.classList.add('flexCol');

    localVideo.style.height = "auto";
    localVideo.style.width = "90vw";
    remoteVideo.style.height = "auto";
    remoteVideo.style.width = "90vw";

}

function handleResponsiveUnderflow() {
    offerAnswerBox.classList.remove('flexCol');
    offerAnswerBox.classList.add('flexRow');
    videoContainer.classList.add('flexRow');
    videoContainer.classList.remove('flexCol');

    localVideo.style.height = "50vh";
    localVideo.style.width = "45vw";
    remoteVideo.style.height = "50vh";
    remoteVideo.style.width = "45vw";
}
function hexToRGB(h) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }

    return "rgb(" + +r + ", " + +g + ", " + +b + ")";
}

function toggleMediaOptionButtonColor(element, enabled) {
    if (enabled) {
        element.style.backgroundColor = activeButtonColor;
    } else {
        element.style.backgroundColor = disabledButtonColor;

    }
}



window.addEventListener("beforeunload", function (e) {
    if(exit==0){
        sentOverDataStream(MESSAGE_TYPE.SYSTEM, SYSTEM_MESSAGE.REMOTE_EXIT_MEET);
        exit = 1;
    }
}, false);


document.getElementById('end-button').addEventListener('click',()=>{
    if(exit==0){
        sendMessageButton(MESSAGE_TYPE.SYSTEM,SYSTEM_MESSAGE.REMOTE_EXIT_MEET);
        exit = 1;
        window.location.reload();
    }
})