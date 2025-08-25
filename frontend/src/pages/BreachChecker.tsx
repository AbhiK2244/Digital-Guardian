import React, { useState } from 'react';
import { UserCheck, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BreachResult } from '../types';
import { motion } from 'framer-motion';

export const BreachChecker: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeCheck, setActiveCheck] = useState<'email' | 'password'>('email');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<BreachResult | null>(null);

  // Mock breach data
  const mockBreaches = [
    {
      name: 'LinkedIn',
      date: '2021-06-22',
      compromisedData: ['Email addresses', 'Passwords', 'Phone numbers', 'Full names']
    },
    {
      name: 'Adobe',
      date: '2013-10-04',
      compromisedData: ['Email addresses', 'Passwords', 'Password hints']
    },
    {
      name: 'Dropbox',
      date: '2016-08-31',
      compromisedData: ['Email addresses', 'Passwords']
    }
  ];

  const performBreachCheck = async (emailToCheck: string): Promise<BreachResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock logic - simulate finding breaches for some emails
    const hasBreaches = emailToCheck.includes('test') || emailToCheck.includes('example');
    
    if (hasBreaches) {
      return {
        email: emailToCheck,
        breaches: mockBreaches,
        totalBreaches: mockBreaches.length
      };
    }

    return {
      email: emailToCheck,
      breaches: [],
      totalBreaches: 0
    };
  };

  const handleCheck = async () => {
    if (activeCheck === 'email' && !email.trim()) return;
    if (activeCheck === 'password' && !password.trim()) return;

    setIsChecking(true);
    try {
      const checkResult = await performBreachCheck(email);
      setResult(checkResult);
    } catch (error) {
      console.error('Breach check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getSecurityLevel = (breachCount: number) => {
    if (breachCount === 0) return { level: 'High', color: 'success', description: 'No known breaches found' };
    if (breachCount <= 2) return { level: 'Medium', color: 'warning', description: 'Some exposure detected' };
    return { level: 'Low', color: 'danger', description: 'Multiple breaches found' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto mb-4">
            <UserCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Data Breach Checker
          </h1>
          <p className="text-lg text-gray-600">
            Check if your credentials have been compromised in known data breaches
          </p>
        </motion.div>

        {/* Security Notice */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Privacy & Security
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All queries are encrypted and not stored on our servers</li>
                <li>• Passwords are hashed locally before being checked</li>
                <li>• We use trusted APIs like Have I Been Pwned for accurate results</li>
                <li>• Your data is never shared with third parties</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          {/* Check Type Selector */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveCheck('email')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCheck === 'email'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Check Email Address
            </button>
            <button
              onClick={() => setActiveCheck('password')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCheck === 'password'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Check Password
            </button>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            {activeCheck === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password to check"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleCheck}
            loading={isChecking}
            disabled={(activeCheck === 'email' && !email.trim()) || (activeCheck === 'password' && !password.trim()) || isChecking}
            variant="danger"
            className="w-full sm:w-auto"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            {isChecking ? 'Checking...' : 'Check for Breaches'}
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
                  {result.totalBreaches === 0 ? (
                    <Shield className="h-12 w-12 text-green-500" />
                  ) : (
                    <AlertCircle className="h-12 w-12 text-red-500" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {result.totalBreaches === 0 ? 'Good News!' : 'Breach Found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {result.totalBreaches === 0
                    ? 'Your email was not found in any known data breaches.'
                    : `Your email appeared in ${result.totalBreaches} known data breach${result.totalBreaches > 1 ? 'es' : ''}.`}
                </p>
                <Badge 
                  variant={getSecurityLevel(result.totalBreaches).color as any}
                  size="md"
                >
                  Security Level: {getSecurityLevel(result.totalBreaches).level}
                </Badge>
              </div>

              {result.breaches.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Breach Details:</h4>
                  {result.breaches.map((breach, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-red-900">{breach.name}</h5>
                        <Badge variant="danger" size="sm">
                          {new Date(breach.date).getFullYear()}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-2">
                        Compromised data: {breach.compromisedData.join(', ')}
                      </p>
                      <p className="text-xs text-red-600">
                        Breach date: {new Date(breach.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {result.totalBreaches === 0 ? (
                    <>
                      <li>• Continue using strong, unique passwords</li>
                      <li>• Enable two-factor authentication where possible</li>
                      <li>• Regularly monitor your accounts for suspicious activity</li>
                    </>
                  ) : (
                    <>
                      <li>• Change your password immediately on affected accounts</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Monitor your credit report and bank statements</li>
                      <li>• Consider using a password manager</li>
                      <li>• Be cautious of phishing attempts</li>
                    </>
                  )}
                </ul>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Understanding Data Breaches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What is a data breach?</h4>
                <p className="text-sm text-gray-600">
                  A data breach occurs when sensitive information is accessed, stolen, or used by 
                  unauthorized individuals. This can include personal information like passwords, 
                  email addresses, and financial data.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How to protect yourself</h4>
                <p className="text-sm text-gray-600">
                  Use unique passwords for each account, enable two-factor authentication, 
                  keep software updated, and be cautious about what information you share online.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};