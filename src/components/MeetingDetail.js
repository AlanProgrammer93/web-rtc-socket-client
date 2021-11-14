import React, { useState } from 'react'
import { emitImage } from '../utils/main';

const MeetingDetail = ({ idMeet, username, files, setFiles }) => {
    const [showDetailAttachment, setShowDetailAttachment] = useState(false);
    const [showMessageCopy, setShowMessageCopy] = useState(false);


    const [fileUpload, setFileUpload] = useState(null)

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
        setShowMessageCopy(true)
        setTimeout(() => {
            setShowMessageCopy(false)
        }, 3000)
    }

    const onChangeFile = (e) => {
        setFileUpload(e.target.files[0]);
    }

    const uploadFile = async (e) => {
        e.preventDefault();

        var formData = new FormData();
        formData.append("zipfile", fileUpload);
        formData.append("meeting_id", idMeet);
        formData.append("username", username);
        const res = await fetch('http://localhost:5000/attachimg', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(res => {
            console.log("llega");
            var attachFilePath = "public/attachment/" + idMeet + "/" + fileUpload.name;

            const data = {
                username: username,
                meetingid: idMeet,
                filePath: attachFilePath,
                fileName: fileUpload.name,
            }
            emitImage(data);
            setFiles(values => [...values, data])
            setFileUpload(null)
        })

    }

    return (
        <div className="g-right-details-wrap g-details border border-success mb-2" style={{ display: 'block', minHeight: "25vh" }}>
            <div className=" d-flex justify-content-between align-items-center border-bottom pb-1">
                <div onClick={() => setShowDetailAttachment(false)} className={` d-flex align-items-center cursor-pointer ${showDetailAttachment ? '' : 'active'}`}>
                    <span className="material-icons">error</span>
                    <span>Detalles</span>
                </div>
                <div onClick={() => setShowDetailAttachment(true)} className={` d-flex align-items-center cursor-pointer ${showDetailAttachment && 'active'}`}>
                    <span className="material-icons">attachment</span>
                    <span>Archivos</span>
                </div>
            </div>
            <div className="g-details-heading-show-wrap">
                {
                    showDetailAttachment ? (
                        <div className="g-details-heading-show-attachment" style={{ position: "relative", marginTop: '5px' }}>
                            <div className="show-attach-file">
                                {
                                    files && files.map((file, index) => (
                                        <>
                                            <div className="left-align" key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={`http://localhost:5000/${file.filePath}`} style={{ height: '40px', width: '40px' }} className="caller-image circle" />
                                                <div style={{ fontWeight: '600', margin: '0 5px' }}>
                                                    {file.username}
                                                </div>
                                                <div>
                                                    <a style={{ color: '#007bff' }} href={file.filePath} download>{file.fileName}</a>
                                                </div>
                                            </div>
                                            <br />
                                        </>
                                    ))
                                }
                            </div>
                            <div className="upload-attach-file">
                                <form encType="multipart/form-data" className="display-center" id="uploadForm" style={{ justifyContent: "space-between" }} >
                                    <div className="custom-file" style={{ flexBasis: "79%" }} >
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="customFile"
                                            name="imagefile"
                                            onChange={onChangeFile}
                                        />
                                        <label htmlFor="customFile" className="custom-file-label selected">{fileUpload ? fileUpload.name : 'Seleccionar Archivo'} </label>
                                    </div>
                                    <div className="share-button-wrap">
                                        <button
                                            className="btn btn-primary btn-sm share-attach"
                                            style={{ flexBasis: "19%", padding: "6px 20px", marginLeft: '5px' }}
                                            onClick={uploadFile}
                                        >
                                            Compartir
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="g-details-heading-show" >
                            <div style={{ fontWeight: "600", color: "gray" }}>Información para unirse</div>
                            <div className="meeting_url" style={{ padding: "5px 0" }} data-toggle="tooltip" data-placement="top">{window.location.href}</div>
                            <div style={{ cursor: "pointer" }} onClick={copyUrl}>
                                <span className="material-icons" style={{ fontSize: "14px" }}>content_copy</span>
                                <span className="copy_info font-weight-bold">
                                    Copiar Información para unirse
                                    {
                                        showMessageCopy && (
                                            <span style={{ display: 'flex', backgroundColor: "aquamarine", borderRadius: "5px" }} className="link-conf font-weight-bold p-1">
                                                Link Copiado
                                            </span>
                                        )
                                    }
                                </span>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MeetingDetail
