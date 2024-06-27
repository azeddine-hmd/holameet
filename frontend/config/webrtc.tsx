const peerConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ]
    }
  ]
};

export async function startLocalStream(): Promise<MediaStream | null> {
  let localStream: MediaStream | null = null;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localStream = stream;
  } catch (error) {
    console.error(error);
    alert("user rejected permission to media devices");
  }
  return localStream;
}

export async function startRemoteStream(offerObj: any) {
  // remoteStream = new MediaStream();
}
//
//
// export async function createPeerConnection(offerObj: any): MediaStream {
//   peerConnection = await new RTCPeerConnection(peerConfig);
//   remoteStream = new MediaStream();
//
//   return remoteStream;
// }
