import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import InputForm from '../components/InputForm';
import LoadingState from '../components/LoadingState';
import ResultDisplay from '../components/ResultDisplay';

export default function Home() {
  const [currentState, setCurrentState] = useState('input'); // 'input', 'loading', 'result'
  const [result, setResult] = useState(null);
  const [lastContent, setLastContent] = useState('');

  const handleSubmit = async (content) => {
    setCurrentState('loading');
    setLastContent(content);

    try {
      const response = await axios.post('/api/process', { content });
      setResult(response.data);
      setCurrentState('result');
    } catch (error) {
      const errorData = error.response?.data || {
        success: false,
        error: '网络请求失败，请检查网络连接',
        stage: 'request'
      };
      setResult(errorData);
      setCurrentState('result');
    }
  };

  const handleRetry = () => {
    if (lastContent) {
      handleSubmit(lastContent);
    }
  };

  const handleReset = () => {
    setCurrentState('input');
    setResult(null);
    setLastContent('');
  };

  return (
    <>
      <Head>
        <title>知识收集助手</title>
        <meta name="description" content="智能整理知识内容到飞书表格" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="app">
        <header className="app-header">
          <h1 className="app-title">知识收集助手</h1>
          <p className="app-subtitle">智能整理知识内容，自动存储到飞书表格</p>
        </header>

        <main className="app-main">
          {currentState === 'input' && (
            <InputForm 
              onSubmit={handleSubmit}
              isLoading={false}
            />
          )}

          {currentState === 'loading' && (
            <LoadingState />
          )}

          {currentState === 'result' && result && (
            <ResultDisplay
              result={result}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 知识收集助手 · 让知识整理更简单</p>
        </footer>
      </div>
    </>
  );
}