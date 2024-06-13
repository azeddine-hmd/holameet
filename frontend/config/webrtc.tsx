export const peerConfig = {
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

export async function fetchUserMedia() {
    // ask for media permission from browser
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      console.log("received stream:", stream);
    }).catch(error => {
      console.error(error);
      alert("why did you reject permission to your media? you dumb bitch user");
    })
}
