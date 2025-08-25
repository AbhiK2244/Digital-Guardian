import React from 'react';
import { BarChart3, Trophy, Shield, TrendingUp, Calendar, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { state } = useApp();

  const stats = [
    {
      label: 'Total Points',
      value: state.user?.points || 0,
      icon: <Trophy className="h-6 w-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Current Level',
      value: state.user?.level || 'Bronze',
      icon: <Star className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Scans Performed',
      value: state.scanHistory.length,
      icon: <Shield className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Digital Health Score',
      value: `${state.user?.digitalHealthScore || 75}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivity = [
    { type: 'quiz', title: 'Completed Phishing Awareness Quiz', points: 50, time: '2 hours ago' },
    { type: 'scan', title: 'Scanned suspicious email', points: 5, time: '1 day ago' },
    { type: 'badge', title: 'Earned Security Novice badge', points: 25, time: '3 days ago' },
    { type: 'breach', title: 'Performed breach check', points: 5, time: '1 week ago' }
  ];

  const levelProgress = {
    current: 150,
    nextLevel: 250,
    percentage: (150 / 250) * 100
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🧠';
      case 'scan': return '🔍';
      case 'badge': return '🏆';
      case 'breach': return '🛡️';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {state.user?.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your digital security progress and achievements
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {state.user?.level} → Silver
                  </span>
                  <span className="text-sm text-gray-500">
                    {levelProgress.current}/{levelProgress.nextLevel} points
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress.percentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                You need {levelProgress.nextLevel - levelProgress.current} more points to reach Silver level!
              </p>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🧠</span>
                    <div>
                      <div className="font-medium text-gray-900">Take Quiz</div>
                      <div className="text-sm text-gray-500">Earn 50 points</div>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🔍</span>
                    <div>
                      <div className="font-medium text-gray-900">Scan Content</div>
                      <div className="text-sm text-gray-500">Check for threats</div>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="font-medium text-gray-900">Breach Check</div>
                      <div className="text-sm text-gray-500">Protect your data</div>
                    </div>
                  </div>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Badges</h3>
              <div className="grid grid-cols-2 gap-4">
                {state.user?.badges.map((badge) => (
                  <div key={badge.id} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="font-medium text-gray-900 text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-500">{badge.description}</div>
                  </div>
                ))}
                <div className="text-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-3xl mb-2 text-gray-400">🔒</div>
                  <div className="font-medium text-gray-500 text-sm">Next Badge</div>
                  <div className="text-xs text-gray-400">Security Expert</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{activity.title}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                    <Badge variant="success" size="sm">+{activity.points}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Digital Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Digital Health Score</h3>
              <Badge variant="success" size="md">
                {state.user?.digitalHealthScore}% Healthy
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <div className="text-sm text-gray-600">Password Strength</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">70%</div>
                <div className="text-sm text-gray-600">Awareness Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                <div className="text-sm text-gray-600">Safe Browsing</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Recommendations to Improve:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Complete more advanced quizzes to boost awareness</li>
                <li>• Enable two-factor authentication on more accounts</li>
                <li>• Regular breach checks for all your email addresses</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};