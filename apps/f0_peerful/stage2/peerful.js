import * as Eventable from './Eventable.js';

export function createConnectionAsOffer(peerConnectionConfig, dataChannelOptions)
{
    let result = {
        localKey: null,
        remoteKey: null,
        connection: null,
        channel: null,
        close()
        {
            this.connection.close();
            this.channel.close();

            this.localKey = null;
            this.remoteKey = null;
        }
    };

    /**
     * Has events:
     * - open: when the channel is opened for communication.
     * - close: when the channel is closed for communication.
     * - data: when the channel receives data.
     * - error: when an error occurs in the connection or the channel.
     * - offer: when the offer is ready to be sent.
     */
    Eventable.assign(result, result);

    let connection = new RTCPeerConnection(peerConnectionConfig);

    let channel = connection.createDataChannel('data', dataChannelOptions);
    channel.addEventListener('open', e => result.emit('open', e));
    channel.addEventListener('close', e => result.emit('close', e));
    channel.addEventListener('message', e => result.emit('data', e));
    channel.addEventListener('error', e => result.emit('error', e));

    /*
    connection.addEventListener('signalingstatechange', e => console.log('Signaling state changed:', e));
    connection.addEventListener('iceconnectionstatechange', e => console.log('ICE connection state changed:', e));
    connection.addEventListener('icegatheringstatechange', e => console.log('ICE gathering state changed:', e));
    */
    
    connection.addEventListener('icecandidateerror', e => result.emit('error', e));
    connection.addEventListener('icecandidate', e => {
        let { candidate } = e;
        if (!candidate)
        {
            let offer = connection.localDescription;
            result.localKey = offer;
            result.emit('offer', offer);
            // Now simply wait for the remote answer key...
        }
    });

    connection.createOffer()
        .then(offerDescription => connection.setLocalDescription(offerDescription))
        .catch(e => result.emit('error', e));

    result.connection = connection;
    result.channel = channel;
    return result;
}

export function createConnectionAsAnswer(remoteOfferData, peerConnectionConfig)
{
    if (!remoteOfferData) throw new Error('Missing remote offer key.');

    let result = {
        localKey: null,
        remoteKey: remoteOfferData,
        connection: null,
        channel: null,
        close()
        {
            this.connection.close();
            this.channel.close();

            this.localKey = null;
            this.remoteKey = null;
        }
    };
    
    /**
     * Has events:
     * - open: when the channel is opened for communication.
     * - close: when the channel is closed for communication.
     * - data: when the channel receives data.
     * - error: when an error occurs in the connection or the channel.
     * - answer: when the answer is ready to be returned.
     */
    Eventable.assign(result, result);

    let connection = new RTCPeerConnection(peerConnectionConfig);

    /*
    connection.addEventListener('signalingstatechange', e => console.log('Signaling state changed:', e));
    connection.addEventListener('iceconnectionstatechange', e => console.log('ICE connection state changed:', e));
    connection.addEventListener('icegatheringstatechange', e => console.log('ICE gathering state changed:', e));
    */
    
    connection.addEventListener('icecandidateerror', e => result.emit('error', e));
    connection.addEventListener('icecandidate', e => {
        let { candidate } = e;
        if (!candidate)
        {
            let answer = connection.localDescription;
            result.localKey = answer;
            result.emit('answer', answer);
            // Now simply wait to be connected...
        }
    });

    let remoteOffer = new RTCSessionDescription(remoteOfferData);

    connection.addEventListener('datachannel', e => {
        let { channel } = e;
        channel.addEventListener('open', e => result.emit('open', e));
        channel.addEventListener('close', e => result.emit('close', e));
        channel.addEventListener('message', e => result.emit('data', e));
        channel.addEventListener('error', e => result.emit('error', e));
        result.channel = channel;
    });

    connection.setRemoteDescription(remoteOffer)
        .then(() => connection.createAnswer())
        .then(localAnswer => connection.setLocalDescription(localAnswer));
    
    result.connection = connection;
    result.channel = null;
    return result;
}

export function establishConnection(host, remoteAnswerData)
{
    let remoteAnswer = new RTCSessionDescription(remoteAnswerData);
    host.connection.setRemoteDescription(remoteAnswer);
}

export function encodeOfferKey(offerDescription)
{
    let { type, sdp } = offerDescription;
    if (type !== 'offer') throw new Error(`Invalid offer description type '${type}', expected 'offer'.`);
    let result = compressKey(sdp);
    return 'off:' + result;
}

export function decodeOfferKey(offerData)
{
    if (!offerData.startsWith('off:')) throw new Error('Not a valid offer key - missing valid prefix.');
    let result = decompressKey(offerData.substring('off:'.length));
    return {
        type: 'offer',
        sdp: result,
    };
}

export function encodeAnswerKey(answerDescription)
{
    let { type, sdp } = answerDescription;
    if (type !== 'answer') throw new Error(`Invalid answer description type '${type}', expected 'answer'.`);
    let result = compressKey(sdp);
    return 'ans:' + result;
}

export function decodeAnswerKey(answerData)
{
    if (!answerData.startsWith('ans:')) throw new Error('Not a valid answer key - missing valid prefix.');
    let result = decompressKey(answerData.substring('ans:'.length));
    return {
        type: 'answer',
        sdp: result,
    };
}

// Assumes this is one-to-one.
const COMPRESSION_KEYS = {
    'a=group:': 'a0=',
    'a=msid-semantic:': 'a1=',
    'a=candidate:': 'a2=',
    'a=ice-ufrag:': 'a3=',
    'a=ice-pwd:': 'a4=',
    'a=ice-options:': 'a5=',
    'a=fingerprint:': 'a6=',
    'a=setup:': 'a7=',
    'a=mid:': 'a8=',
    'a=sctp-port:': 'a9=',
    'a=max-message-size:': 'a10=',
    '\\r\\n': '|',
    '-': '~',
    ' ': '_',
};
const KEY_TO_COMPRESSION_MAP = new Map();
{
    for(let key of Object.keys(COMPRESSION_KEYS))
    {
        let pattern = new RegExp(key.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g');
        let value = COMPRESSION_KEYS[key];
        KEY_TO_COMPRESSION_MAP.set(pattern, value);
    }
}
const COMPRESSION_TO_KEY_MAP = new Map();
{
    for(let key of Object.keys(COMPRESSION_KEYS))
    {
        let value = COMPRESSION_KEYS[key];
        let pattern = new RegExp(value.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g');
        COMPRESSION_TO_KEY_MAP.set(pattern, key);
    }
}

export function compressKey(key)
{
    let result = JSON.stringify(key);
    result = result.substring(1, result.length - 1);
    for(let keyPattern of KEY_TO_COMPRESSION_MAP.keys())
    {
        result = result.replace(keyPattern, KEY_TO_COMPRESSION_MAP.get(keyPattern));
    }
    return result;
}

export function decompressKey(key)
{
    let result = key;
    for(let keyPattern of COMPRESSION_TO_KEY_MAP.keys())
    {
        result = result.replace(keyPattern, COMPRESSION_TO_KEY_MAP.get(keyPattern));
    }
    return JSON.parse(`"${result}"`);
}
