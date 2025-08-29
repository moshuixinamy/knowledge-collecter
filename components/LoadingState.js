export default function LoadingState() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        
        <h2 className="loading-title">处理中...</h2>
        
        <div className="loading-steps">
          <div className="step">
            <span className="step-icon">🤖</span>
            <span className="step-text">正在分析内容...</span>
          </div>
          <div className="step">
            <span className="step-icon">📊</span>
            <span className="step-text">正在插入飞书表格...</span>
          </div>
        </div>
        
        <p className="loading-message">
          请稍候，不要关闭页面
        </p>
      </div>
    </div>
  );
}