<template>
  <div
    class="container"
    v-if="availableCameras != null && availableCameras.size > 0"
  >
    <div>
      <span><strong>Cameras:</strong></span>
      <select v-model="selectedCameraId">
        <option
          v-for="camera in availableCameras.values()"
          :value="camera.deviceId" :key="camera.deviceId"
        >
          {{ camera.label }}
        </option>
      </select>
      <button @click="openCamera" :disabled="selectedCameraId == null">
        Open camera
      </button>
      <div v-if="selectedCameraId != null">
        <p><strong>Selected camera:</strong></p>
        <p>
          <strong>DeviceId:</strong>
          {{ availableCameras.get(selectedCameraId)?.deviceId }}
        </p>
        <p>
          <strong>Label:</strong>
          {{ availableCameras.get(selectedCameraId)?.label }}
        </p>
        <div v-if="selectedCameraCaps != null">
          <p><strong>Capabilities:</strong></p>
          <pre>{{ selectedCameraCaps.capabilities }} </pre>
          <p><strong>Settings:</strong></p>
          <pre>{{ selectedCameraCaps.settings }} </pre>
        </div>
      </div>
      <div></div>
    </div>
    <div class="video-container">
      <video id="video" autoplay playsinline controls="false"></video>
    </div>
  </div>
  <div class="container" v-else>
    No cameras available, please check that cameras are connected and
    permissions given.
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { Camera } from "../app/camera";

export default defineComponent({
  name: "CameraInfo",
  setup: () => {
    function onCameraSuccess() {
      console.log("Camera success");
    }
    function onCameraError() {
      console.log("Camera error");
    }
    const camera = new Camera();
    let availableCameras = ref(null);
    camera
      .getAvailableCameras()
      .then((cameras) => {
        availableCameras.value = cameras;
        selectedCameraId.value = cameras.values().next().value.deviceId;
      })
      .catch((error) => {
        console.log("Can't open camera" + error);
      });
    const selectedCameraId = ref(null);
    const selectedCameraCaps = ref(null);
    const openCamera = () => {
      camera.openCamera(selectedCameraId.value, "video").then((caps) => {
        selectedCameraCaps.value = caps;
      });
    };
    return {
      selectedCameraId,
      selectedCameraCaps,
      availableCameras,
      openCamera,
    };
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.container {
  display: flex;
  flex-direction: row;
  row-gap: 5rem;
}

@media (max-width: 1000px) {
  .container {
    flex-direction: column;
    column-gap: 5rem;
  }
  #video {
    width: 100vw;
  }
}
</style>
