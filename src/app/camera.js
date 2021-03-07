export class Camera {
    constructor() {

    }

    getAvailableCameras() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                stream.getVideoTracks().forEach(track => { track.stop(); })
                navigator.mediaDevices.enumerateDevices().then((devices) => {
                    let videoDevices = new Map();
                    devices.forEach(device => {
                        if (device.kind == "videoinput") {
                            videoDevices.set(device.deviceId, device);
                        }
                    });
                    return resolve(videoDevices);
                }).catch((reason) => {
                    reject(reason);
                })
            }).catch(error => { reject(error) });

        });
    }

    openCamera(deviceId, videoSelectorId) {
        return new Promise(resolve => {
            console.log("Opening camera: " + deviceId);
            const stream = navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
            }).then(stream => {
                let video = document.getElementById(videoSelectorId);
                video.srcObject = stream;
                stream.getVideoTracks().forEach(track => {
                    const capabilities = track.getCapabilities();
                    const settings = track.getSettings();
                    resolve({ capabilities: capabilities, settings: settings });
                });
            })


        });

    }
}
