import { uuid } from '../../packages/util/src/uuidv4.js';

const PEER_CONNECTION_CONFIG = {
    iceServers: [
        { url: 'stun:stun.l.google.com:19302' },
    ],
};
const UNRELIABLE_CHANNEL_OPTIONS = {
    label: 'data',
    ordered: false,
    maxRetransmits: 0,
};
const RELIABLE_CHANNEL_OPTIONS = {
    label: 'reliable',
    ordered: false,
};

export async function offerHandshake(peerConnectionConfig = PEER_CONNECTION_CONFIG, channelOptions = [ UNRELIABLE_CHANNEL_OPTIONS, RELIABLE_CHANNEL_OPTIONS ])
{
    return new Promise((resolve, reject) => {
        let connection = new RTCPeerConnection(peerConnectionConfig);
        let channels = {};
        let channelCount = channelOptions.length;
        for(let channelOption of channelOptions)
        {
            let channelLabel = channelOption.label || ('data' + Object.keys(channels).length);
            let channel = connection.createDataChannel(channelLabel, channelOption);
            channels[channelLabel] = channel;
        }
    
        let status = {
            iceConnection: null,
            iceGathering: null,
            iceCandidate: false,
            channels: Object.keys(channels).length,
            expectedChannels: channelCount,
            get ready()
            {
                return this.iceCandidate
                    && this.channels >= this.expectedChannels
                    && this.iceConnection === 'connected'
                    && this.iceGathering === 'complete';
            }
        };

        let handshake = {
            remote: false,
            status,
            connection,
            channels,
            offer: null,
            _resolve: null,
            async get()
            {
                return new Promise(resolve => {
                    // Finish resolving it when we are ready.
                    this._resolve = resolve;
                });
            },
            cancel()
            {
                this.connection.close();
                for(let channelLabel of Object.keys(this.channels))
                {
                    this.channels[channelLabel].close();
                    delete this.channels[channelLabel];
                }
            }
        };

        // Resolve it when we are ready.
        connection.addEventListener('icegatheringstatechange', e => {
            status.iceGathering = e.target.iceGatheringState;
            console.log('gathering...', status);
        });
        connection.addEventListener('icecandidate', e => {
            let { candidate } = e;
            if (!candidate)
            {
                console.log('candidate...', status);
                handshake.offer = connection.localDescription;
                status.iceCandidate = true;
                resolve(handshake);
            }
        });
        connection.addEventListener('iceconnectionstatechange', e => {
            status.iceConnection = e.target.iceConnectionState;
            console.log('connecting...', status);
        });
    
        // Start it.
        connection.createOffer()
            .then(offerDescription => connection.setLocalDescription(offerDescription))
            .catch(reject);
    });
}

export async function answerHandshake(remoteOfferData, peerConnectionConfig = PEER_CONNECTION_CONFIG, channelOptions = [ UNRELIABLE_CHANNEL_OPTIONS, RELIABLE_CHANNEL_OPTIONS ])
{
    if (!remoteOfferData) throw new Error('Missing remote offer key.');

    return new Promise((resolve, reject) => {
        let connection = new RTCPeerConnection(peerConnectionConfig);
        let channels = {};
        let channelCount = channelOptions.length;
        for(let channelOption of channelOptions)
        {
            let channelLabel = channelOption.label || ('data' + Object.keys(channels).length);
            channels[channelLabel] = null;
        }

        let status = {
            iceConnection: null,
            iceGathering: null,
            iceCandidate: false,
            channels: 0,
            expectedChannels: channelCount,
            get ready()
            {
                return this.iceCandidate
                    && this.channels >= this.expectedChannels
                    && this.iceConnection === 'connected'
                    && this.iceGathering === 'complete';
            }
        };
        
        let handshake = {
            remote: true,
            status,
            connection,
            channels,
            answer: null,
            _resolve: null,
            async get()
            {
                return new Promise(resolve => {
                    // Finish resolving it when we are ready.
                    this._resolve = resolve;
                });
            },
            cancel()
            {
                this.connection.close();
                for(let channelLabel of Object.keys(this.channels))
                {
                    this.channels[channelLabel].close();
                    delete this.channels[channelLabel];
                }
            }
        };

        // Prepare to resolve it when we are ready.
        connection.addEventListener('icegatheringstatechange', e => {
            status.iceGathering = e.target.iceGatheringState;
            console.log('gathering...', status);
        });
        connection.addEventListener('icecandidate', e => {
            let { candidate } = e;
            if (!candidate)
            {
                console.log('candidate...', status);
                handshake.answer = connection.localDescription;
                status.iceCandidate = true;
                resolve(handshake);
            }
        });
        connection.addEventListener('iceconnectionstatechange', e => {
            status.iceConnection = e.target.iceConnectionState;
            console.log('connecting...', status);
        });
        connection.addEventListener('datachannel', e => {
            let channel = e.channel;
            let channelLabel = channel.label;
            if (!(channelLabel in handshake.channels)) throw new Error(`Found no options for channel label '${channelLabel}'.`);
            if (handshake.channels[channelLabel]) throw new Error(`Received duplicate data channel of the same label '${channelLabel}'.`);

            handshake.channels[channelLabel] = channel;
            ++status.channels;

            if (status.channels >= status.expectedChannels)
            {
                handshake._resolve(handshake);
            }
        });
    
        // Start it.
        let remoteOffer = new RTCSessionDescription(remoteOfferData);
        connection.setRemoteDescription(remoteOffer)
            .then(() => connection.createAnswer())
            .then(localAnswer => connection.setLocalDescription(localAnswer))
            .catch(reject);
    });
}

export async function acceptHandshake(remoteAnswerData, handshake)
{
    let remoteAnswer = new RTCSessionDescription(remoteAnswerData);
    await handshake.connection.setRemoteDescription(remoteAnswer);
    handshake._resolve(handshake);
    return handshake;
}

export function encodeOfferCode(offerDescription)
{
    let { type, sdp } = offerDescription;
    if (type !== 'offer') throw new Error(`Invalid offer description type '${type}', expected 'offer'.`);
    let result = compressCode(sdp);
    return 'off:' + result;
}

export function decodeOfferCode(offerData)
{
    if (!offerData.startsWith('off:')) throw new Error('Not a valid offer key - missing valid prefix.');
    let result = decompressCode(offerData.substring('off:'.length));
    return {
        type: 'offer',
        sdp: result,
    };
}

export function encodeAnswerCode(answerDescription)
{
    let { type, sdp } = answerDescription;
    if (type !== 'answer') throw new Error(`Invalid answer description type '${type}', expected 'answer'.`);
    let result = compressCode(sdp);
    return 'ans:' + result;
}

export function decodeAnswerCode(answerData)
{
    if (!answerData.startsWith('ans:')) throw new Error('Not a valid answer key - missing valid prefix.');
    let result = decompressCode(answerData.substring('ans:'.length));
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

function compressCode(key)
{
    let result = JSON.stringify(key);
    result = result.substring(1, result.length - 1);
    for(let keyPattern of KEY_TO_COMPRESSION_MAP.keys())
    {
        result = result.replace(keyPattern, KEY_TO_COMPRESSION_MAP.get(keyPattern));
    }
    return result;
}

function decompressCode(key)
{
    let result = key;
    for(let keyPattern of COMPRESSION_TO_KEY_MAP.keys())
    {
        result = result.replace(keyPattern, COMPRESSION_TO_KEY_MAP.get(keyPattern));
    }
    return JSON.parse(`"${result}"`);
}
