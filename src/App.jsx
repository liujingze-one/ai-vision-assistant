import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [capturedFrames, setCapturedFrames] = useState([]);

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

  const captureCurrentFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraOn) {
      setError("请先开启摄像头。");
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.8);
  };

  const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const captureMultipleFrames = async () => {
    const frames = [];

    for (let i = 0; i < 3; i++) {
      const frame = captureCurrentFrame();

      if (frame) {
        frames.push(frame);
      }

      if (i < 2) {
        await wait(500);
      }
    }

    setCapturedFrames(frames);
    return frames;
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("请输入问题。");
      return;
    }

    if (!cameraOn) {
      setError("请先点击“开始对话”开启摄像头。");
      return;
    }

    setError("");

    const frames = await captureMultipleFrames();

    console.log("用户问题：", question);
    console.log("自动捕获的多帧画面：", frames);
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
            开始对话
          </button>

          <canvas ref={canvasRef} className="hidden-canvas" />

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="chat-panel">
          <h2>Chat Area</h2>

          <div className="message user-message">
            <strong>用户：</strong>
            <span>
              输入问题后点击发送，系统会自动从摄像头视频中捕获连续三帧画面。
            </span>
          </div>

          {capturedFrames.length > 0 && (
            <div className="frame-preview">
              <p>最近一次自动捕获的三帧画面：</p>

              <div className="frame-grid">
                {capturedFrames.map((frame, index) => (
                  <img
                    key={index}
                    src={frame}
                    alt={`自动捕获画面 ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder="请输入问题..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={handleAsk}>发送</button>
      </div>
    </div>
  );
}

export default App;