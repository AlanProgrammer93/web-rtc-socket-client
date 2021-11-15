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
                <img src="/images/logo-azul.png" width={100} className="logo" alt="" />
                <p  className="navbar-brand text-dark mt-3">Web RTC</p>
            </nav>

            <main>
                <div className="jumbotron h-100 d-flex mt-5">
                    <div className="container col-md-6 w-50">
                        <h1 style={{fontSize: "3rem"}} >DISPONIBLE GRATIS PARA TODO EL MUNDO. </h1>
                        <p style={{fontSize: "20px"}}>
                            Inicia una nueva reunion o unete ingresando el codigo de una reunion en curso.
                        </p>
                        <ul className="display-center justify-content-start" >
                            <li style={{padding: "0"}}>
                                <button 
                                    onClick={startMeet} 
                                    className="btn btn-lg text-light font-weight-bold display-center new-meeting" 
                                    style={{backgroundColor: "deepskyblue"}}
                                >
                                    <span className="material-icons mr-2">
                                        video_call
                                    </span>
                                    Nueva Reunion
                                </button>
                            </li>
                            <li className="pl-3">
                                <button 
                                    className="btn btn-lg btn-outline-secondary text-dark font-weight-bold display-center" 
                                    style={{backgroundColor: "#ffffff"}}
                                >
                                    <span className="material-icons mr-2">keyboard</span>
                                    <input 
                                        type="text" 
                                        placeholder="Ingrese un codigo" 
                                        style={{border: "none"}}
                                        className="enter-code"
                                        value={codeMeet}
                                        onChange={e => setCodeMeet(e.target.value)}
                                    />
                                </button>
                            </li>
                            <li className="text-dark border ml-2 font-weight-bold cursor-pointer pl-2 join-action" onClick={joinMeet}>Unirse</li>
                        </ul>
                    </div>
                    <div className="container col-md-6 w-50">
                        <img src="/images/google-meet-people.jpg" alt="" className="signin-image" />
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Login
