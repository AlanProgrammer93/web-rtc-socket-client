import React, { useState } from 'react'
import { startRecordingHandler, stopRecordingHandler } from '../utils/appProcess';

const Recording = () => {
    const [showRecording, setShowRecording] = useState(false);
    const [recordingProgress, setRecordingProgress] = useState(false)

    const startRecording = () => {
        setRecordingProgress(true)
        startRecordingHandler(setRecordingProgress);
        
    }

    const stopRecording = () => {
        setRecordingProgress(false)
        stopRecordingHandler();
    }

    return (
        <div className="option-wrap cursor-pointer display-center" style={{ height: "10vh", position: "relative" }} >
            {
                showRecording && (
                    <div className="recording-show">
                        {
                            recordingProgress ? (
                                <button onClick={stopRecording} className="stop-record btn-danger text-dark">
                                    Detener Grabacion
                                </button>
                            ) : (
                                <button onClick={startRecording} className="btn btn-dark text-danger start-record">
                                    Grabar
                                </button>
                            )
                        }
                    </div>
                )
            }
            <div className="option-icon" onClick={() => setShowRecording(!showRecording)}>
                <span className="material-icons">more_vert</span>
            </div>
        </div>
    )
}

export default Recording
