export let localStream: MediaStream | null = null;
export let remoteStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let isRemoteDescSet = false;

export async function startLocalStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream = stream;
  } catch (error) {
    console.error(error);
    alert("user rejected permission to media devices");
  }
}

export async function intiiateCall() {
  await createPeerConnection();
  // creating offer item
  try {
    console.log("creating offer...");
    const offer = await peerConnection!.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    console.log("offer created:", offer);
    peerConnection?.setLocalDescription(offer);
    window.socket.emit("newOffer", offer);
  } catch (error) {
    console.error("creating offer error: ", error);
  }
}

export async function answerOffer(offerObj: any) {
  await createPeerConnection();
  await peerConnection?.setRemoteDescription(offerObj)
  isRemoteDescSet = true;
  const answer = await peerConnection!.createAnswer({});
  console.log("answer:", answer);
  await peerConnection?.setLocalDescription(answer);
  window.socket.emit("newAnswer", answer);
}

export async function addAnswer(answer: any) {
  await peerConnection?.setRemoteDescription(answer);
  isRemoteDescSet = true;
}

async function createPeerConnection() {
  peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
        ],
      }
    ]
  }
  );
  remoteStream = new MediaStream();

  if (!localStream) {
    await startLocalStream();
  }
  localStream!.getTracks().forEach(track => {
    peerConnection?.addTrack(track, localStream!);
  });

  peerConnection.addEventListener("signalingstatechange", (e) => {
    console.log("signalingstatechang: e:", e);
    console.log("signalingstatechange: peerConnection.signalState:", peerConnection!.signalingState);
  });

  peerConnection.addEventListener("icecandidate", (e) => {
    // console.log("Ice candidate found!");
    // console.log("e:", e);
    if (e.candidate) {
        window.socket.emit("send icecandidate", {
          iceCandidate: e.candidate,
        })
    } else {
      console.error("no icecandidate been found!");
    }
  });

  peerConnection.addEventListener("track", (e) => {
    console.log("Got a track from the other peer");
    console.log(e);
    e.streams[0].getTracks().forEach((track) => {
      remoteStream!.addTrack(track);
      console.log("adding track to remote stream object");
    });
  });
}

export function addNewIceCandidates(iceCandidates: RTCIceCandidate[]) {
  for (const candidate of iceCandidates) {
    (async() => {
      const intervalId = window.setInterval(() => {
        if (peerConnection?.remoteDescription) {
          peerConnection?.addIceCandidate(candidate).then(() => {
            console.log("adding ice candidate")
          }).catch((error) => {
            console.error("error adding ice candidate:", error);
          });
          window.clearInterval(intervalId);
        }
      }, 500);
      // end async
    })();
  }
}

export function sessionStopped() {
  peerConnection?.close();
  peerConnection = null;
  remoteStream?.getTracks().forEach((track) => track.stop());
  remoteStream = null;
  isRemoteDescSet = false;
}
