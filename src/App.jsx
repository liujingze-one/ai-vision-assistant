import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>AI Visual Assistant</h1>

      <div className="main-container">
        <div className="camera-panel">
          <h2>Camera Panel</h2>
        </div>

        <div className="chat-panel">
          <h2>Chat Area</h2>
        </div>
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder="请输入问题..."
        />
        <button>发送</button>
      </div>
    </div>
  );
}

export default App;