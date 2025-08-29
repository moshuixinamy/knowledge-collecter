export default function ResultDisplay({ result, onReset, onRetry }) {
  const { success, data, error, stage } = result;

  if (success) {
    const { total, inserted, failed, records } = data;
    const successRecords = records.filter(r => r.status === 'success');
    const failedRecords = records.filter(r => r.status === 'failed');

    // 全部成功
    if (failed === 0) {
      return (
        <div className="result-container success">
          <div className="result-header">
            <span className="result-icon">✅</span>
            <h2 className="result-title">处理完成！</h2>
          </div>
          
          <div className="result-summary">
            已成功添加 <strong>{inserted}</strong> 条记录到飞书表格
          </div>

          <div className="records-list">
            {successRecords.map((record, index) => (
              <div key={index} className="record-item success">
                <span className="record-status">✅</span>
                <span className="record-title">{record.title}</span>
              </div>
            ))}
          </div>

          <button onClick={onReset} className="action-button primary">
            重新输入
          </button>
        </div>
      );
    }

    // 部分成功
    if (inserted > 0 && failed > 0) {
      return (
        <div className="result-container partial">
          <div className="result-header">
            <span className="result-icon">⚠️</span>
            <h2 className="result-title">处理完成</h2>
          </div>
          
          <div className="result-summary">
            <strong>{inserted}</strong> 条成功，<strong>{failed}</strong> 条失败
          </div>

          {successRecords.length > 0 && (
            <div className="records-section">
              <h3 className="section-title success">✅ 成功记录：</h3>
              <div className="records-list">
                {successRecords.map((record, index) => (
                  <div key={index} className="record-item success">
                    <span className="record-status">✅</span>
                    <span className="record-title">{record.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {failedRecords.length > 0 && (
            <div className="records-section">
              <h3 className="section-title error">❌ 失败记录：</h3>
              <div className="records-list">
                {failedRecords.map((record, index) => (
                  <div key={index} className="record-item failed">
                    <span className="record-status">❌</span>
                    <div className="record-details">
                      <span className="record-title">{record.title}</span>
                      <span className="record-error">失败原因：{record.error}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={onRetry} className="action-button secondary">
              重新提交
            </button>
            <button onClick={onReset} className="action-button primary">
              修改内容
            </button>
          </div>
        </div>
      );
    }
  }

  // 处理失败
  return (
    <div className="result-container error">
      <div className="result-header">
        <span className="result-icon">❌</span>
        <h2 className="result-title">处理失败</h2>
      </div>
      
      <div className="result-error">
        <p className="error-message">{error}</p>
        
        {stage === 'parsing' && (
          <div className="error-help">
            <p>建议：</p>
            <ul>
              <li>• 检查内容格式是否正确</li>
              <li>• 确保内容具有明确的主题</li>
              <li>• 如有多条内容，请用 --- 正确分隔</li>
            </ul>
          </div>
        )}
        
        {stage === 'insertion' && (
          <div className="error-help">
            <p>建议：</p>
            <ul>
              <li>• 检查网络连接是否正常</li>
              <li>• 稍等片刻后重试</li>
              <li>• 如问题持续，请检查飞书配置</li>
            </ul>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={onRetry} className="action-button secondary">
          重新提交
        </button>
        <button onClick={onReset} className="action-button primary">
          修改内容
        </button>
      </div>
    </div>
  );
}