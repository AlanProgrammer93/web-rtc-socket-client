import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { audioCamOnOff, screenShareOnOf, videoCamOnOff } from '../utils/appProcess';
import { finish, init, sendMessage } from '../utils/main';
import MeetingDetail from '../components/MeetingDetail';
import Recording from '../components/Recording';

const Home = () => {
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const [files, setFiles] = useState([])

    const [showVideoState, setShowVideoState] = useState(0);
    const [showAudio, setShowAudio] = useState(0);
    const [leaveState, setLeaveState] = useState(0)
    const [showChats, setShowChats] = useState(0)
    const [showDetail, setShowDetail] = useState(false);

    const history = useNavigate()

    const param = useParams();
    const idMeet = param.id;

    useEffect(() => {
        var user_id = window.prompt('Enter your userid');

        if (!user_id || !idMeet) {
            alert('User id or meeting id missing');
            history("/")
        }
        setUsername(user_id)
        init(user_id, idMeet, setUsers, setMessages, setFiles);
    }, [history, idMeet])

    const showVideo = () => {
        videoCamOnOff(setShowVideoState)
    }

    const showScreen = () => {
        screenShareOnOf(setShowVideoState)
    }

    const startAudio = () => {
        audioCamOnOff(setShowAudio)
    }

    const fullScreen = (id) => {
        const app = document.getElementById(id);
        app.requestFullscreen()
    }

    const leave = () => {
        history("/")
        finish()
    }

    const cancel = () => {
        setLeaveState(0)
    }

    const submitMessage = () => {
        if (message) {
            sendMessage(message)
            var time = new Date();
            var lTime = time.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
            let data = {
                from: username,
                lTime: lTime,
                message: message
            }
            setMessages(values => [...values, data])
            setMessage('');
        }
    }

    return (
        <main className=" d-flex flex-column home-wrap">
            <div className="g-top text-light">
                <div className="top-remote-video-show-wrap d-flex">
                    <div id="meetingContainer" style={{ display: "block", flexBasis: "75%" }}>
                        <div className="call-wrap" style={{ backgroundColor: "black" }}>
                            <div
                                className="video-wrap"
                                id="divUsers"
                                style={{ display: "flex", flexWrap: "wrap" }}
                            >
                                <div id="me" className="userbox display-center flex-column">
                                    <h2 className="display-center" style={{ fontSize: "14px" }}>{username}</h2>
                                    <div className="display-center">
                                        <video autoPlay muted id="locaVideoPlayer"></video>
                                    </div>
                                </div>
                                {
                                    users && users.map((user, index) => (
                                        <div
                                            onDoubleClick={() => fullScreen(`v_${user.connectionId}`)}
                                            key={index}
                                            id="otherTemplate"
                                            className="userbox display-center flex-column other"
                                        >
                                            <h2 className="display-center" style={{ fontSize: "14px" }}>{user.other_user_id}</h2>
                                            <div className="display-center">
                                                <video autoPlay muted id={`v_${user.connectionId}`}></video>
                                                <audio autoPlay controls muted id={`a_${user.connectionId}`} style={{ display: "none" }}></audio>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div
                        className="g-right-details-wrap bg-light text-secondary h-100"
                        style={{ flexBasis: "25%", zIndex: "1", display: showChats ? "block" : "none" }}
                    >
                        <div className="meeting-heading-wrap d-flex justify-content-between align-items-center pr-3 pl-3" style={{ height: "10vh" }}>
                            <div className="meeting-heading font-weight-bold ">Detalles De La Reunion</div>
                            <div onClick={() => setShowChats(0)} className="meeting-heading-cross display-center cursor-pointer">
                                <span className="material-icons">clear</span>
                            </div>
                        </div>
                        <div
                            className="people-chat-wrap d-flex justify-content-between align-items-center ml-3 mr-3 pr-3 pl-3"
                            style={{ height: "10vh", fontSize: "14px" }}
                        >
                            <div onClick={() => setShowChats(1)} className={`people-heading ${showChats === 1 && 'active'} display-center cursor-pointer`}>
                                <div className="people-headin-icon display-center mr-1">
                                    <span className="material-icons">people</span>
                                </div>
                                <div className="people-headin-text display-center">
                                    Participantes  (<span className="participant-count">{users.length + 1}</span>)
                                </div>
                            </div>
                            <div onClick={() => setShowChats(2)} className={`chat-heading ${showChats === 2 && 'active'} d-flex just-content-round align-items-center cursor-pointer`}>
                                <div className="chat-heading-icon display-center mr-1">
                                    <span className="material-icons">
                                        message
                                    </span>
                                </div>
                                <div className="chat-heading-text">
                                    Chat
                                </div>
                            </div>
                        </div>
                        <div className="in-call-chat-wrap mr-3 ml-3 pl-3 pr-3" style={{ fontSize: "14px", height: "69vh", overflowY: "scroll" }}>
                            <div className="in-call-wrap-up" style={{ display: showChats === 1 ? "flex" : "none", flexDirection: 'column' }}>
                                <div className="in-call-wrap d-flex justify-content-between align-items-center mb-3" >
                                    <div className="participant-img-name-wrap display-center cursor-pointer">
                                        <div className="participant-img">
                                            <img src="/images/other.jpg" alt="" className="border border-secondary" style={{ height: "40px", width: "40px", borderRadius: "50%" }} />
                                        </div>
                                        <div className="participant-name ml-2">Tu</div>
                                    </div>
                                    <div className="participant-action-wrap display-center">
                                        <div className="participant-action-dot display-center mr-2 cursor-pointer">
                                            <span className="material-icons">
                                                more_vert
                                            </span>
                                        </div>
                                        <div className="participant-action-pin display-center mr-2 cursor-pointer">
                                            <span className="material-icons">
                                                push_pin
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    users.map((user, index) => (
                                        <div
                                            className="in-call-wrap d-flex justify-content-between align-items-center mb-3"
                                            id={`participant_${user.connectionId}`}
                                            key={index}
                                        >
                                            <div className="participant-img-name-wrap display-center cursor-pointer">
                                                <div className="participant-img">
                                                    <img
                                                        src="images/other.jpg"
                                                        alt=""
                                                        className="border border-secondary"
                                                        style={{ height: '40px', width: '40px', borderRadius: '50%' }}
                                                    />
                                                </div>
                                                <div className="participant-name ml-2">
                                                    {user.other_user_id}
                                                </div>
                                            </div>
                                            <div className="participant-action-wrap display-center">
                                                <div className="participant-action-dot display-center mr-2 cursor-pointer">
                                                    <span className="material-icons"> more_vert </span>
                                                </div>
                                                <div className="participant-action-pin display-center mr-2 cursor-pointer">
                                                    <span className="material-icons"> push_pin </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="chat-show-wrap text-secondary  flex-column justify-content-between h-100" style={{ fontSize: "14px", display: showChats === 2 ? "flex" : "none" }}>
                                <div className="chat-message-show" id="messages">
                                    {
                                        messages.map((message, index) => (
                                            <div key={index}>
                                                <span className="font-weight-bold mr-3" style={{ color: 'black' }}>
                                                    {message.from === username ? 'Tu' : message.from}
                                                </span>
                                                {message.lTime}
                                                <br />
                                                {message.message}
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="chat-message-sent d-flex justify-content-between align-items-center" style={{ marginBottom: "35px" }}>

                                    <div className="chat-message-sent-input" style={{ width: "85%" }}>
                                        <input
                                            type="text"
                                            name=""
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="chat-message-sent-input-field w-100"
                                            id="msgbox"
                                            placeholder="Enviar mensaje a todos"
                                            style={{ borderBottom: "1px", color: "black", border: "none" }}
                                        />
                                    </div>
                                    <div onClick={submitMessage} className="chat-message-sent-action display-center" id="btnsend" style={{ color: "teal", cursor: "pointer" }}>
                                        <span className="material-icons">send</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="g-top-left bg-light text-secondary w-25 d-flex align-items-center justify-content-between pl-2 pr-2">
                    <div onClick={() => setShowChats(1)} className="top-left-participant-wrap pt-2 cursor-pointer">
                        <div className="top-left-participant-icon">
                            <span className="material-icons">people</span>
                        </div>
                        <div className="top-left-participant-count participant-count">{users.length + 1}</div>
                    </div>
                    <div onClick={() => setShowChats(2)} className="top-left-chat-wrap pt-2 cursor-pointer">
                        <span className="material-icons">message</span>
                    </div>
                    <div className="top-left-time-wrap"></div>
                </div>
            </div>

            <div className="g-bottom bg-light m-0 d-flex justify-content-between align-items-center">
                <div className="bottom-left d-flex" style={{ height: "10vh" }}>

                    {
                        showDetail && <MeetingDetail idMeet={idMeet} username={username} files={files} setFiles={setFiles} />
                    }
                    <div onClick={() => setShowDetail(!showDetail)} className="display-center cursor-pointer meeting-details-button">
                        Recursos<span className="material-icons">keyboard_arrow_down</span>
                    </div>
                </div>
                <div className="bottom-middle d-flex just-content-center align-items-center" style={{ height: "10vh" }}>
                    <div
                        className="mic-toggle-wrap action-icon-style display-center mr-2 cursor-pointer"
                        id="miceMuteUnmute"
                        onClick={startAudio}
                    >
                        <span className="material-icons" style={{ width: "100%" }} >{showAudio ? 'mic' : 'mic_off'} </span>
                    </div>
                    <div onClick={() => setLeaveState(1)} className="end-call-wrap action-icon-style display-center mr-2 cursor-pointer">
                        <span className="material-icons text-danger">call</span>
                    </div>
                    <div
                        className="video-toggle-wrap action-icon-style display-center cursor-pointer"
                        id="videoCamOnOff"
                        onClick={showVideo}
                    >
                        <span className="material-icons" style={{ width: "100%" }}>
                            {showVideoState ? 'videocam_on' : 'videocam_off'}
                        </span>
                    </div>
                </div>
                <div className="bottom-right d-flex just-content-center align-items-center mr-3" id="screenShare-wrap" style={{ height: "10vh" }} >

                    {
                        showVideoState ? (
                            <div
                                className="present-now-wrap d-flex just-content-center flex-column align-items-center mr-5 cursor-pointer"
                            >
                                <span className="material-icons text-success">present_to_all</span>
                                <div className="text-success">Compartiendo</div>
                            </div>
                        ) : (
                            <div
                                className="present-now-wrap d-flex just-content-center flex-column align-items-center mr-5 cursor-pointer"
                                id="ScreenShareOnOf"
                                onClick={showScreen}
                            >
                                <span className="material-icons">present_to_all</span>
                                <div>Compartir Pantalla</div>
                            </div>
                        )
                    }
                    <Recording />
                </div>
            </div>
            <div className="top-box-show" style={{ display: leaveState ? "block" : "none" }}>
                <div className="top-box align-vertical-middle profile-dialogue-show">
                    <h4 className="mt-3" style={{ textAlign: 'center', color: 'white' }}>
                        Dejar La Reunion
                    </h4>
                    <hr />
                    <div className="call-leave-cancel-action d-flex justify-content-center align-items-center w-100">
                        <button onClick={leave} className="call-leave-action btn btn-danger mr-5">
                            Dejar
                        </button>
                        <button onClick={cancel} className="call-cancel-action btn btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Home
