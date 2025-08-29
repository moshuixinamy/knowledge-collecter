import { useState } from 'react';

export default function InputForm({ onSubmit, isLoading }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证输入
    if (!content.trim()) {
      setError('请输入要整理的内容');
      return;
    }

    if (content.length > 4000) {
      setError('内容长度不能超过4000字符');
      return;
    }

    setError('');
    onSubmit(content.trim());
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    
    // 清除错误信息
    if (error) {
      setError('');
    }
  };

  const remainingChars = 4000 - content.length;

  return (
    <>
      <div className="input-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              请输入要整理的知识内容：
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="输入您要整理的知识内容...&#10;&#10;💡 使用提示：&#10;• 如需添加多条记录，请用 --- 分隔不同内容&#10;• 系统会自动提取主题、摘要、链接等信息&#10;• 支持识别网址链接"
              className={`form-textarea ${error ? 'error' : ''}`}
              rows={10}
              disabled={isLoading}
              maxLength={4000}
            />
            
            <div className="form-meta">
              <span className={`char-count ${remainingChars < 200 ? 'warning' : ''}`}>
                {remainingChars} / 4000 字符
              </span>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}
          </div>

          <div className="usage-tips">
            <h3>💡 使用说明：</h3>
            <ul>
              <li>• 多条记录请用 <code>---</code> 分隔</li>
              <li>• 系统会自动提取主题、摘要等信息</li>
              <li>• 支持自动识别和提取网址链接</li>
              <li>• 推送时间将自动设置为今天日期</li>
            </ul>
          </div>
        </form>
      </div>

      {/* 固定在底部的提交按钮 */}
      <div className="submit-button-container">
        <button 
          type="button"
          onClick={handleSubmit}
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? '处理中...' : '提交处理'}
        </button>
      </div>
    </>
  );
}