const WebSocket = require('ws');
const WebSocketClient = require('websocket').client;

const message = '{"apiName": "VTubeStudioPublicAPI","apiVersion": "1.0","requestID": "SomeID","messageType": "InputParameterListRequest"}';
const token = '{"apiName": "VTubeStudioPublicAPI","apiVersion": "1.0","requestID": "SomeID","messageType": "AuthenticationRequest","data": {"pluginName": "'+pluginName+'","pluginDeveloper": "'+pluginDeveloper+'","authenticationToken": "'+pluginToken+'"}}';
const getToken = '{"apiName": "VTubeStudioPublicAPI","apiVersion": "1.0","requestID": "SomeID","messageType": "AuthenticationTokenRequest","data": {"pluginName": "'+pluginName+'","pluginDeveloper": "'+pluginDeveloper+'"}}';

const server = new WebSocket.Server({port:8002});
// const client = new WebSocketClient();
const ws = new WebSocket('ws://0.0.0.0:8001/');
// const wss = new WebSocket('ws://0.0.0.0:8002/');

function valueTrim(x) {
    let eyeOpenRight = x.indexOf('"name":"EyeOpenRight","addedBy":"VTube Studio","value":');
    let eyeOpenLeft = x.indexOf('"name":"EyeOpenLeft","addedBy":"VTube Studio","value":');
    let mouthOpen = x.indexOf('"name":"VoiceVolumePlusMouthOpen","addedBy":"VTube Studio","value":');
    let faceAngleX = x.indexOf('"name":"FaceAngleX","addedBy":"VTube Studio","value":');
    let faceAngleY = x.indexOf('"name":"FaceAngleY","addedBy":"VTube Studio","value":');
    let faceAngleZ = x.indexOf('"name":"FaceAngleZ","addedBy":"VTube Studio","value":');
    let eyeX = x.indexOf('"name":"EyeLeftX","addedBy":"VTube Studio","value":');
    let eyeY = x.indexOf('"name":"EyeLeftY","addedBy":"VTube Studio","value":');
    let mouthSmile = x.indexOf('"name":"MouthSmile","addedBy":"VTube Studio","value":');
    // let handLeftX = x.indexOf('"name":"HandLeftPositionX","addedBy":"VTube Studio","value":');
    // let handLeftY = x.indexOf('"name":"HandLeftPositionY","addedBy":"VTube Studio","value":');
    // let handLeftZ = x.indexOf('"name":"HandLeftPositionZ","addedBy":"VTube Studio","value":');

    return x.substring(eyeOpenRight+55,eyeOpenRight+59) + x.substring(eyeOpenLeft+54,eyeOpenLeft+58) + x.substring(mouthOpen+67,mouthOpen+71) + x.substring(faceAngleX+53,faceAngleX+59) + x.substring(faceAngleY+53,faceAngleY+59) + x.substring(faceAngleZ+53,faceAngleZ+59) + x.substring(eyeX+51,eyeX+56) + x.substring(eyeY+51,eyeY+56) + x.substring(mouthSmile+53,mouthSmile+57);// + x.substring(handLeftX+60,handLeftX+64) + x.substring(handLeftY+60,handLeftY+64) + x.substring(handLeftZ+60,handLeftZ+64);
};

const auth =  0;

server.on('connection', (connection) => {
    console.log('neos connected');

    if (auth == 0) {
        ws.send(token);
        console.log('token sent');
        auth++;
    };
    

    connection.on('message', (msg) => {
        // console.log('message received from neos', msg.toString());
        ws.send(message);
        // console.log('message sent to VTube', message);
    });

    ws.on('message', (msg) => {
        // console.log('message received from VTube ', msg.toString());
        sendMsgNeos(connection, valueTrim(msg.toString()));
        // console.log(msg.toString());
    });

    function sendMsgNeos(cnc,msg){
        cnc.send(msg);
        // console.log('message sent to neos', msg);
    };
});