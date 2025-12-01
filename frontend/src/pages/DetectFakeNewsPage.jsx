import React, { useState } from 'react';
import api from '../services/api';

const DetectFakeNewsPage = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!question.trim()) {
      setError('Please enter a question or claim to check.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/news/detect-fakeNews', { question });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to detect fake news.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Detect Fake News</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="question" className="block mb-2 font-medium">Enter a claim or question:</label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 mb-4"
          placeholder="Enter a claim to detect"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 disabled:opacity-50">
          {loading ? 'Checking...' : 'Detect'}
        </button>
      </form>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
          <h3 className="font-bold mb-2">Result</h3>
          <div className="mb-2"><span className="font-semibold">Reason:</span> {result.reason}</div>
          <div className="mb-2"><span className="font-semibold">Verdict:</span> {result.verdict}</div>
          <div className="mb-2"><span className="font-semibold">Confidence:</span> {result.confidence}</div>
          <div className="mt-4">
            <span className="font-semibold">Sources:</span>
            <ul className="list-disc ml-6">
              {result.sources.map(src => (
                <li key={src.id}><span className="font-bold">{src.label}:</span> {src.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectFakeNewsPage;
