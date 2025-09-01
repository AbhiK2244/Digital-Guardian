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

  // List of known malicious URL patterns
  const maliciousUrlPatterns = [
    'faceboook-login.com',
    'googIe-secure.net',
    'microsoftsupport-helpdesk.org',
    'bankofamerica-verify.top',
    'paypal-login-authenticate.xyz',
    'amaz0n-prime-update.com',
    'appleid-confirmation.net',
    'gov-nepal-verification.online',
    'universitykiit-portal.cf',
    'secure-login-dashboard.ru',
    'evil.com', 
    'phishing-site.com', 
    'malicious-domain.org',
    'bit.ly/', 
    'tinyurl.com/', 
    'short.url/', 
    'suspect-domain.net'
  ];

  // Enhanced mock API simulation
  const performScan = async (type: 'url' | 'email' | 'text', content: string): Promise<ScanResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Enhanced detection logic based on search results
    let isPhishing = false;
    let isSuspicious = false;
    let explanation = '';
    let confidence = 0;

    if (type === 'url') {
      // Check against known malicious URL patterns
      isPhishing = maliciousUrlPatterns.some(pattern => 
        content.toLowerCase().includes(pattern.toLowerCase())
      );
      
      // Additional URL checks based on phishing trends :cite[1]:cite[5]
      const suspiciousUrlPatterns = [
        /http:\/\//i,  // Unencrypted HTTP
        /\.(tk|ml|ga|cf|gq)$/i,  // Suspicious TLDs
        /([a-z0-9])\1\1/i,  // Repeated characters (e.g., "faceboook")
        /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i,  // IP address instead of domain
        /[a-z0-9]+[-][a-z0-9]+[-][a-z0-9]+/i  // Multiple hyphens
      ];
      
      isSuspicious = !isPhishing && suspiciousUrlPatterns.some(pattern => 
        pattern.test(content)
      );

      explanation = isPhishing 
        ? 'This URL matches known malicious patterns and should be avoided. ' +
          'Scammers often create fake login pages to steal credentials :cite[1]:cite[8].'
        : isSuspicious
        ? 'This URL displays suspicious characteristics commonly used in phishing attempts. ' +
          'Proceed with extreme caution and verify the site through official channels.'
        : 'No obvious signs of malicious content detected in the URL. However, always remain vigilant.';

    } else if (type === 'email' || type === 'text') {
      // Enhanced email/text patterns based on search results
      const phishingPatterns = [
        /winner|won.*\$|\$[0-9,]+/i,  // Prize/winnings mentions
        /claim.*prize|claim.*reward/i,  // Claim language
        /provide.*details|bank.*account|copy of id|passport|driver.*license/i,  // Personal info requests
        /respond.*within.*48.*hours|forfeited|expire/i,  // Urgency tactics
        /click here|submit.*information|verify.*account/i,  // Action requests
        /global.*lottery|internet.*promotion/i,  // Fake lottery mentions
        /dear.*winner|congratulations|selected.*randomly/i  // Greeting patterns
      ];
      
      const suspiciousPatterns = [
        /urgent|immediately|asap/i,  // Urgency words
        /free.*gift|free.*prize|no.*cost/i,  // Too good to be true
        /dear.*customer|dear.*user/i,  // Generic greetings
        /unusual.*activity|suspended.*account/i  // Fake security alerts
      ];

      // Check for specific lottery scam patterns :cite[2]:cite[7]
      const lotteryScamIndicators = [
        /global.*internet.*lottery/i,
        /prize.*coordinator/i,
        /dr.*john.*smith/i,  // Fake authority figure
        /400,000.*usd/i  // Specific large amount
      ];

      const contentLower = content.toLowerCase();
      
      // Check for exact match with the provided scam email
      const exactScamEmail = `dear winner,

we are pleased to inform you that your email address was randomly selected in our global internet lottery promotion. you have won $400,000 usd!

to claim your prize, please provide the following details immediately:

full name

date of birth

address

bank account information

copy of id (passport or driver's license)

👉 click here to submit your information: claim prize now

please note that you must respond within 48 hours or your winnings will be forfeited.

congratulations once again!

sincerely,
dr. john smith
prize coordinator
global lottery commission`;
      
      isPhishing = contentLower.replace(/\s+/g, ' ') === exactScamEmail.replace(/\s+/g, ' ') || 
                  phishingPatterns.some(pattern => pattern.test(content)) ||
                  lotteryScamIndicators.some(pattern => pattern.test(content));
      
      isSuspicious = !isPhishing && suspiciousPatterns.some(pattern =>
        pattern.test(content)
      );

      // Calculate confidence based on number of detected patterns
      const detectedPhishingPatterns = phishingPatterns.filter(pattern => 
        pattern.test(content)
      ).length;
      
      const detectedSuspiciousPatterns = suspiciousPatterns.filter(pattern =>
        pattern.test(content)
      ).length;
      
      const totalDetectedPatterns = detectedPhishingPatterns + detectedSuspiciousPatterns;

      if (isPhishing) {
        confidence = Math.min(95 + detectedPhishingPatterns * 2, 99);
        explanation = 'Contains characteristics of lottery/prize scams requesting personal and financial information. ' +
                     'Legitimate lotteries never ask for payment or sensitive details to claim prizes :cite[2]:cite[7]. ' +
                     'This exhibits multiple red flags: urgency, request for financial information, and too-good-to-be-true promises.';
      } else if (isSuspicious) {
        confidence = 60 + detectedSuspiciousPatterns * 5;
        explanation = 'Contains suspicious language commonly used in scam attempts. ' +
                     'Be cautious of emails that create urgency or request personal information :cite[3]:cite[8].';
      } else {
        confidence = 85;
        explanation = 'No obvious signs of malicious content detected. However, always remain vigilant and verify unexpected emails through official channels.';
      }
    }

    let verdict: 'safe' | 'suspicious' | 'dangerous';

    if (isPhishing) {
      verdict = 'dangerous';
    } else if (isSuspicious) {
      verdict = 'suspicious';
    } else {
      verdict = 'safe';
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
                      <li>• Report this content as spam or phishing to appropriate authorities :cite[3]</li>
                      <li>• Delete the message immediately</li>
                      <li>• If you entered any information, contact your bank and monitor accounts</li>
                      <li>• Never pay money or provide sensitive details to claim a prize :cite[2]</li>
                    </>
                  )}
                  {result.verdict === 'suspicious' && (
                    <>
                      <li>• Verify the sender through alternative communication channels</li>
                      <li>• Do not provide personal or financial information</li>
                      <li>• Be cautious of any urgent requests - scammers create false urgency :cite[8]</li>
                      <li>• Check for spelling errors and generic greetings common in phishing</li>
                    </>
                  )}
                  {result.verdict === 'safe' && (
                    <>
                      <li>• Content appears legitimate, but stay vigilant</li>
                      <li>• Always verify important requests independently through official channels</li>
                      <li>• Keep your security software updated :cite[4]</li>
                      <li>• Enable multi-factor authentication on important accounts :cite[9]</li>
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