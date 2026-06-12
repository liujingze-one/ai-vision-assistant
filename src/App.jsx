import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

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

  const handleAsk = async (voiceQuestion = null) => {
    const finalQuestion = voiceQuestion || question;
    if (!finalQuestion.trim()) {
      setError("请输入问题。");
      return;
    }

    if (!cameraOn) {
      setError("请先点击“开始对话”开启摄像头。");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const currentQuestion = question;

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: finalQuestion,
        },
      ]);

      const frames = await captureMultipleFrames();

      const response = await fetch("http://localhost:3001/api/vision-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          question: finalQuestion,
          frames,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI调用失败");
      }


      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.answer,
        },
      ]);
      
      speakText(data.answer);

      setQuestion("");

    } catch (err) {
      setError("AI回答失败，请检查后端服务或 API Key。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("当前浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setError("");
    setListening(true);
    recognition.start();



    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      setQuestion(transcript);
      setListening(false);

      await handleAsk(transcript);
    };


    recognition.onerror = (event) => {
      setError("语音识别失败，请检查麦克风权限。");
      setListening(false);
      console.error(event);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      setError("当前浏览器不支持语音播报功能。");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
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
              输入问题后点击发送，系统会自动从摄像头视频中捕获连续三帧画面，并交给 Gemini 进行视觉理解。
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

          {loading && (
            <div className="message ai-message">
              <strong>AI：</strong>
              <span>正在分析摄像头画面...</span>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === "user" ? "user-message" : "ai-message"
                }`}
            >
              <strong>
                {message.role === "user" ? "用户：" : "AI："}
              </strong>
              <span>{message.content}</span>
            </div>
          ))}


        </div>
      </div>


      <div className="input-bar">
        <input
          type="text"
          placeholder="请输入问题..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
        />

        <button onClick={startListening} disabled={listening || loading}>
          {listening ? "识别中..." : "语音输入"}
        </button>

        <button onClick={() => handleAsk()} disabled={loading}>
          {loading ? "分析中..." : "发送"}
        </button>
      </div>
    </div>
  );
}

export default App;