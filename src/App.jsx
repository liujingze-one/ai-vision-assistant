import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      setError("无法打开摄像头，请检查浏览器权限或设备连接。");
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>AI Visual Assistant</h1>

      <div className="main-container">
        <div className="camera-panel">
          <div className="video-box">
            <video ref={videoRef} autoPlay playsInline />
            {!cameraOn && <p className="placeholder">摄像头未开启</p>}
          </div>

          <button className="camera-button" onClick={startCamera}>
            开启摄像头
          </button>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="chat-panel">
          <h2>Chat Area</h2>
        </div>
      </div>

      <div className="input-bar">
        <input type="text" placeholder="请输入问题..." />
        <button>发送</button>
      </div>
    </div>
  );
}

export default App;