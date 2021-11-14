let serverProcess;
let local_div;

let peers_connection = [];
let peers_connection_ids = [];
let remote_vid_stream = [];
let remote_aud_stream = [];

// Video
let video_states = {
  None: 0,
  Camera: 1,
  ScreenShare: 2,
};
let video_st = video_states.None;
let videoCamTrack;
let rtp_vid_senders = [];

// Audio
let audio;
let isAudioMute = true;
let rtp_aud_senders = [];

// Recording
let mediaRecorder = null;
let chunks = []

const iceConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
  ],
};

async function setOffer(connid, SDP_function) {
  var connection = peers_connection[connid];
  var offer = await connection.createOffer();
  console.log(offer);
  await connection.setLocalDescription(offer);
  SDP_function(
    JSON.stringify({
      offer: connection.localDescription,
    }),
    connid
  );
}

function connection_status(connection) {
  if (
    connection &&
    (connection.connectionState == "new" ||
      connection.connectionState == "connecting" ||
      connection.connectionState == "connected")
  ) {
    return true;
  } else {
    return false;
  }
}

async function updateMediaSenders(track, rtp_senders) {
  for (var con_id in peers_connection_ids) {
    if (connection_status(peers_connection[con_id])) {
      if (rtp_senders[con_id] && rtp_senders[con_id].track) {
        rtp_senders[con_id].replaceTrack(track);
      } else {
        rtp_senders[con_id] = peers_connection[con_id].addTrack(track);
      }
    }
  }
}

export const setNewConnection = (connid, SDP_function) => {
  var connection = new RTCPeerConnection(iceConfiguration);

  connection.onnegotiationneeded = async function (event) {
    await setOffer(connid, SDP_function);
  };
  connection.onicecandidate = function (event) {
    if (event.candidate) {
      SDP_function(
        JSON.stringify({ icecandidate: event.candidate }),
        connid
      );
    }
  };
  connection.ontrack = function (event) {
    if (!remote_vid_stream[connid]) {
      remote_vid_stream[connid] = new MediaStream();
    }
    if (!remote_aud_stream[connid]) {
      remote_aud_stream[connid] = new MediaStream();
    }

    if (event.track.kind == "video") {
      remote_vid_stream[connid]
        .getVideoTracks()
        .forEach((t) => remote_vid_stream[connid].removeTrack(t));
      remote_vid_stream[connid].addTrack(event.track);
      var remoteVideoPlayer = document.getElementById("v_" + connid);
      remoteVideoPlayer.srcObject = null;
      remoteVideoPlayer.srcObject = remote_vid_stream[connid];
      remoteVideoPlayer.load();
    } else if (event.track.kind == "audio") {
      remote_aud_stream[connid]
        .getAudioTracks()
        .forEach((t) => remote_aud_stream[connid].removeTrack(t));
      remote_vid_stream[connid].addTrack(event.track);
      var remoteAudioPlayer = document.getElementById("a_" + connid);
      remoteAudioPlayer.srcObject = null;
      remoteAudioPlayer.srcObject = remote_aud_stream[connid];
      remoteAudioPlayer.load();
    }
  };
  peers_connection_ids[connid] = connid;
  peers_connection[connid] = connection;

  if (
    video_st == video_states.Camera ||
    video_st == video_states.ScreenShare
  ) {
    if (videoCamTrack) {
      updateMediaSenders(videoCamTrack, rtp_vid_senders);
    }
  }

  return connection;
}

export const initLocalVideo = () => {
  local_div = document.getElementById("locaVideoPlayer");
}

export const videoCamOnOff = async (setShowVideoState) => {
  if (video_st == video_states.Camera) {
    await videoProcess(video_states.None, setShowVideoState);
  } else {
    await videoProcess(video_states.Camera, setShowVideoState);
  }
}

export const screenShareOnOf = async (setShowVideoState) => {
  if (video_st == video_states.ScreenShare) {
    await videoProcess(video_states.None, setShowVideoState);
  } else {
    await videoProcess(video_states.ScreenShare, setShowVideoState);
  }
}

function removeMediaSenders(rtp_senders) {
  for (var con_id in peers_connection_ids) {
    if (rtp_senders[con_id] && connection_status(peers_connection[con_id])) {
      peers_connection[con_id].removeTrack(rtp_senders[con_id]);
      rtp_senders[con_id] = null;
    }
  }
}

function removeVideoStream(rtp_vid_senders) {
  if (videoCamTrack) {
    videoCamTrack.stop();
    videoCamTrack = null;
    local_div.srcObject = null;
    removeMediaSenders(rtp_vid_senders);
  }
}

async function videoProcess(newVideoState, setShowVideoState) {
  if (newVideoState == video_states.None) {
    video_st = newVideoState;
    setShowVideoState(0)

    removeVideoStream(rtp_vid_senders);

    return;
  }
  if (newVideoState == video_states.Camera) {
    setShowVideoState(newVideoState)
    video_st = newVideoState;
  }

  try {
    var vstream = null;
    if (newVideoState == video_states.Camera) {
      vstream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1920,
          height: 1080,
        },
        audio: false,
      });
    } else if (newVideoState == video_states.ScreenShare) {
      setShowVideoState(2)
      vstream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
        },
        audio: false,
      });
      vstream.oninactive = (e) => {
        removeVideoStream(rtp_vid_senders);
        setShowVideoState(0)
      };
    }
    if (vstream && vstream.getVideoTracks().length > 0) {
      videoCamTrack = vstream.getVideoTracks()[0];
      if (videoCamTrack) {
        local_div.srcObject = new MediaStream([videoCamTrack]);
        updateMediaSenders(videoCamTrack, rtp_vid_senders);
      }
    }
  } catch (e) {
    console.log(e);
    setShowVideoState(0)
    video_st = video_states.None;
    return;
  }
  video_st = newVideoState;
  if (newVideoState == video_states.Camera) {
    setShowVideoState(1)
  } else if (newVideoState == video_states.ScreenShare) {
    setShowVideoState(2)
  }
}

export const SDPProcess = async (message, from_connid, SDP_function) => {
  message = JSON.parse(message);
  if (message.answer) {
    await peers_connection[from_connid].setRemoteDescription(
      new RTCSessionDescription(message.answer)
    );
  } else if (message.offer) {
    if (!peers_connection[from_connid]) {
      await setNewConnection(from_connid, SDP_function);
    }
    await peers_connection[from_connid].setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );
    var answer = await peers_connection[from_connid].createAnswer();
    await peers_connection[from_connid].setLocalDescription(answer);
    SDP_function(
      JSON.stringify({
        answer: answer,
      }),
      from_connid
    );
  } else if (message.icecandidate) {
    if (!peers_connection[from_connid]) {
      await setNewConnection(from_connid, SDP_function);
    }
    try {
      await peers_connection[from_connid].addIceCandidate(
        message.icecandidate
      );
    } catch (e) {
      console.log(e);
    }
  }
}

async function loadAudio() {
  try {
    var astream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    audio = astream.getAudioTracks()[0];
    audio.enabled = false;
  } catch (e) {
    console.log(e);
  }
}

export const audioCamOnOff = async (setShowAudio) => {
  if (!audio) {
    await loadAudio();
  }
  if (!audio) {
    setShowAudio(0)
    alert("Audio permission has not granted");
    return;
  }
  if (isAudioMute) {
    audio.enabled = true;
    setShowAudio(1)
    updateMediaSenders(audio, rtp_aud_senders);
  } else {
    audio.enabled = false;
    setShowAudio(0)
    removeMediaSenders(rtp_aud_senders);
  }
  isAudioMute = !isAudioMute;
}

export const closeConnectionCall = (connid) => {
  peers_connection_ids[connid] = null;
  if (peers_connection[connid]) {
    peers_connection[connid].close();
    peers_connection[connid] = null;
  }
  if (remote_aud_stream[connid]) {
    remote_aud_stream[connid].getTracks().forEach((t) => {
      if (t.stop) t.stop();
    });
    remote_aud_stream[connid] = null;
  }
  if (remote_vid_stream[connid]) {
    remote_vid_stream[connid].getTracks().forEach((t) => {
      if (t.stop) t.stop();
    });
    remote_vid_stream[connid] = null;
  }
}

async function captureScreen(mediaContraints = {
  video: true
}) {
  const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaContraints)
  return screenStream
}

async function captureAudio(mediaContraints = {
  video: false,
  audio: true
}) {
  const audioStream = await navigator.mediaDevices.getUserMedia(mediaContraints)
  return audioStream
}

export const startRecordingHandler = async (setRecordingProgress) => {
  try {
    const screenStream = await captureScreen();
    const audioStream = await captureAudio();
    const stream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks(),])
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.start();
    mediaRecorder.onstop = function (e) {
      var clipName = prompt("Ingresa un nombre para la grabacion")
      stream.getTracks().forEach((track) => track.stop())
      const blob = new Blob(chunks, {
        type: "video/webm",
      })
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = clipName + ".webm";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100)
    }
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    }
  } catch (error) {
    console.log(error);
    setRecordingProgress(false)
  }
}

export const stopRecordingHandler = () => {
  mediaRecorder.stop()
}