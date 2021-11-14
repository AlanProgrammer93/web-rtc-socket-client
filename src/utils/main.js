import socketClient from 'socket.io-client';
import { closeConnectionCall, initLocalVideo, SDPProcess, setNewConnection } from './appProcess';

let socket;
let user_id = "";
let meeting_id = "";

/* const SERVER = 'http://localhost:5000'; */
const SERVER = 'https://webrtcalan.herokuapp.com'

export const finish = () => {
  socket.close()
  user_id = "";
  meeting_id = "";
  document.title = "Bienvenido";
} 

export const sendMessage = (message) => {
  socket.emit("sendMessage", message);
}

export const emitImage = (data) => {
  socket.emit("fileTransferToOther", data);
}

export const init = (userId, idMeet, setUsers, setMessages, setFiles) => {
    user_id = userId;
    meeting_id = idMeet;
    document.title = user_id;
    
    socket = socketClient(SERVER);

     /* socket.emit('mostrarID'); 
     socket.on('mostrando', (data) => {
         console.log(data);
     });  */

     // FUNCION COMODIN
    var SDP_function = function (data, to_connid) {
        socket.emit("SDPProcess", {
          message: data,
          to_connid: to_connid,
        });
    };

    socket.on("connect", () => {
        if (socket.connected) {
            initLocalVideo();
            if (user_id != "" && meeting_id != "") {
              socket.emit("userconnect", {
                displayName: user_id,
                meetingid: meeting_id,
              });
            }
        }
    });

    socket.on("inform_others_about_me", function (data) {
        
        setNewConnection(data.connectionId, SDP_function);
        setUsers(values => [...values, data])
    });

    socket.on("inform_me_about_other_user", function (other_users) {
        if (other_users) {
          setUsers(other_users)
          for (var i = 0; i < other_users.length; i++) {
            setNewConnection(other_users[i].connectionId, SDP_function);
          }
        }
    });

    socket.on("SDPProcess", async function (data) {
      await SDPProcess(data.message, data.from_connid, SDP_function);
    });

    socket.on("inform_other_about_disconnected_user", function (data) {
      setUsers(values => values.filter(ele => ele.connectionId !== data.connId))
      
      closeConnectionCall(data.connId);
    });

    socket.on("showChatMessage", function (data) {
      var time = new Date();
      var lTime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      data.lTime = lTime
      setMessages(values => [...values, data])
    });

    // CONTINUAR AQUI GUARDANDO EN EL STATE DE ARCHIVOS
    socket.on("showFileMessage", function (data) {
      setFiles(values => [...values, data])
    });
}
