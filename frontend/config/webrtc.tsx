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

export async function callPeer() {
  await fetchUserMedia();
}

export async function createPeerConnection(offerObj: any): MediaStream {
  peerConnection = await new RTCPeerConnection(peerConfig);
  remoteStream = new MediaStream();

  return remoteStream;
}
