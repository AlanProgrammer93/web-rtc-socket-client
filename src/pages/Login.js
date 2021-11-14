import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [codeMeet, setCodeMeet] = useState('');

    const history = useNavigate()

    const startMeet = () => {
        const idMeet = Math.floor(Math.random()*100000000);
        history(`/${idMeet}`)
    }

    const joinMeet = () => {
        const idMeet = codeMeet;
        history(`/${idMeet}`)
    }

    return (
        <div>
            <nav className="navbar navbar-expand-md fixed-top">
                <img src="/images/google-meet-icon.png" className="logo" alt="" />
                <a href="#" className ="navbar-brand text-dark">Google Meet</a>
                <div className ="collapse navbar-collapse">
                    <ul className ="navbar-nav mr-auto">
                        <li className ="nav-item">
                            <a href="#" className ="nav-link">At a glance</a>
                        </li>
                        <li className ="nav-item">
                            <a href="#" className ="nav-link">How it works</a>
                        </li>
                        <li className ="nav-item">
                            <a href="#" className ="nav-link">Plan and Price</a>
                        </li>
                    </ul>
                    <ul className ="navbar-nav mr-0">
                        <li className ="nav-item sign-in display-center">
                            <a href="#" className ="nav-link">Sign in</a>
                        </li>
                        <li className ="nav-item">
                            <button className ="btn btn-outline-secondary btn-lg text-info font-weight-bold join-meeting" >Join the meeting</button>
                        </li>
                        <li className ="nav-item">
                            <button className ="btn btn-lg btn-info text-light font-weight-bold new-meeting" onClick={startMeet}>Start a meeting</button>
                        </li>
                    </ul>
                </div>
            </nav>

            <main>
                <div className="jumbotron h-100 d-flex">
                    <div className="container w-50">
                        <h1 style={{fontSize: "3rem"}} > Premium video meeting. Now it is available for free to everyone. </h1>
                        <p style={{fontSize: "20px"}}>
                            We're redesigning the Google Meet service for secure business meetings and making it free for everyone to use.
                        </p>
                        <ul className="display-center justify-content-start" >
                            <li style={{padding: "0"}}>
                                <button onClick={startMeet} className="btn btn-lg text-light font-weight-bold display-center new-meeting" style={{backgroundColor: "#01796b"}}><span className="material-icons mr-2">video_call</span>New Meeting</button>
                            </li>
                            <li className="pl-3">
                                <button 
                                    className="btn btn-lg btn-outline-secondary text-dark font-weight-bold display-center" 
                                    style={{backgroundColor: "#ffffff"}}
                                >
                                    <span className="material-icons mr-2">keyboard</span>
                                    <input 
                                        type="text" 
                                        placeholder="Enter a code" 
                                        style={{border: "none"}}
                                        className="enter-code"
                                        value={codeMeet}
                                        onChange={e => setCodeMeet(e.target.value)}
                                    />
                                </button>
                            </li>
                            <li className="text-dark font-weight-bold cursor-pointer pl-2 join-action" onClick={joinMeet}>Join</li>
                        </ul>
                    </div>
                    <div className="container w-50">
                        <img src="/images/google-meet-people.jpg" alt="" className="signin-image" />
                    </div>
                </div>
            </main>

            <footer className="container"><h6>Learn more about <span className="learn-more text-info">google meet</span> .</h6></footer>

        </div>
    )
}

export default Login
