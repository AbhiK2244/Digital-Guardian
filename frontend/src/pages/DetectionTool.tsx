import React, { useState } from 'react';
import { Scan, Link as LinkIcon, Mail, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import { ScanResult } from '../types';
import { motion } from 'framer-motion';

export const DetectionTool: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'url' | 'email' | 'text'>('url');
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const tabs = [
    { id: 'url', name: 'URL Checker', icon: <LinkIcon className="h-5 w-5" /> },
    { id: 'email', name: 'Email Scanner', icon: <Mail className="h-5 w-5" /> },
    { id: 'text', name: 'Text Analyzer', icon: <MessageSquare className="h-5 w-5" /> }
  ];

  // Mock API simulation
  const performScan = async (type: 'url' | 'email' | 'text', content: string): Promise<ScanResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock detection logic
    const isPhishing = content.toLowerCase().includes('urgent') || 
                      content.toLowerCase().includes('verify') || 
                      content.toLowerCase().includes('suspended') ||
                      content.toLowerCase().includes('click here') ||
                      content.includes('bit.ly') ||
                      content.includes('tinyurl');

    const isSuspicious = content.toLowerCase().includes('free') || 
                        content.toLowerCase().includes('winner') ||
                        content.toLowerCase().includes('congratulations');

    let verdict: 'safe' | 'suspicious' | 'dangerous';
    let confidence: number;
    let explanation: string;

    if (isPhishing) {
      verdict = 'dangerous';
      confidence = Math.floor(Math.random() * 15) + 85; // 85-100%
      explanation = 'Contains typical phishing indicators such as urgency tactics, verification requests, or suspicious shortened URLs.';
    } else if (isSuspicious) {
      verdict = 'suspicious';
      confidence = Math.floor(Math.random() * 30) + 60; // 60-90%
      explanation = 'Contains suspicious language commonly used in scam attempts. Proceed with caution.';
    } else {
      verdict = 'safe';
      confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
      explanation = 'No obvious signs of malicious content detected. However, always remain vigilant.';
    }

    return {
      id: Date.now().toString(),
      type,
      content,
      verdict,
      confidence,
      explanation,
      scannedAt: new Date()
    };
  };

  const handleScan = async () => {
    if (!input.trim()) return;

    setIsScanning(true);
    try {
      const scanResult = await performScan(activeTab, input);
      setResult(scanResult);
      
      // Add to scan history
      dispatch({ type: 'ADD_SCAN_RESULT', payload: scanResult });
      
      // Award points for using the tool
      dispatch({ type: 'ADD_POINTS', payload: 5 });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Scan failed. Please try again.' });
    } finally {
      setIsScanning(false);
    }
  };

  const getResultIcon = (verdict: string) => {
    switch (verdict) {
      case 'safe':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'dangerous':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultColor = (verdict: string) => {
    switch (verdict) {
      case 'safe':
        return 'success';
      case 'suspicious':
        return 'warning';
      case 'dangerous':
        return 'danger';
      default:
        return 'default';
    }
  };

  const placeholders = {
    url: 'Enter a URL to check (e.g., https://example.com)',
    email: 'Paste email content or message text here...',
    text: 'Enter any text message or content to analyze...'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
            <Scan className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Real-Time Threat Detection
          </h1>
          <p className="text-lg text-gray-600">
            Analyze URLs, emails, and text messages for potential security threats
          </p>
        </motion.div>

        <Card>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'url' | 'email' | 'text');
                  setInput('');
                  setResult(null);
                }}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeTab === 'url' ? 'URL to Check' : activeTab === 'email' ? 'Email Content' : 'Text Content'}
            </label>
            {activeTab === 'url' ? (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholders[activeTab]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholders[activeTab]}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <Button
            onClick={handleScan}
            loading={isScanning}
            disabled={!input.trim() || isScanning}
            className="w-full sm:w-auto"
          >
            <Scan className="h-4 w-4 mr-2" />
            {isScanning ? 'Scanning...' : 'Analyze Content'}
          </Button>
        </Card>

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  {getResultIcon(result.verdict)}
                </div>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Badge variant={getResultColor(result.verdict) as any} size="md">
                    {result.verdict.toUpperCase()}
                  </Badge>
                  <Badge variant="info" size="md">
                    {result.confidence}% Confidence
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Scan Results
                </h3>
                <p className="text-gray-600">{result.explanation}</p>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {result.verdict === 'dangerous' && (
                    <>
                      <li>• Do not click on any links or download any attachments</li>
                      <li>• Report this content as spam or phishing</li>
                      <li>• Delete the message immediately</li>
                    </>
                  )}
                  {result.verdict === 'suspicious' && (
                    <>
                      <li>• Verify the sender through alternative communication</li>
                      <li>• Do not provide personal information</li>
                      <li>• Be cautious of any urgent requests</li>
                    </>
                  )}
                  {result.verdict === 'safe' && (
                    <>
                      <li>• Content appears legitimate, but stay vigilant</li>
                      <li>• Always verify important requests independently</li>
                      <li>• Keep your security software updated</li>
                    </>
                  )}
                </ul>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recent Scans */}
        {state.scanHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Scans
              </h3>
              <div className="space-y-3">
                {state.scanHistory.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getResultColor(scan.verdict) as any} size="sm">
                          {scan.verdict}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {scan.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {scan.content.slice(0, 100)}...
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 ml-4">
                      {new Date(scan.scannedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};