import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

class SecurityChecker {
    constructor() {
        this.spamKeywords = [
            'viagra', 'cialis', 'lottery', 'winner', 'congratulations',
            'urgent', 'act now', 'limited time', 'free money', 'cash prize',
            'nigerian prince', 'inheritance', 'beneficiary', 'transfer funds',
            'click here now', 'guaranteed', 'no risk', '100% free'
        ];
        
        this.suspiciousDomains = [
            'tempmail.org', '10minutemail.com', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email', 'temp-mail.org'
        ];
    }

    async checkLinkAuthenticity(url) {
        try {
            if (!url || typeof url !== 'string') {
                return { authentic: false, reason: "Invalid URL format" };
            }

            // Basic URL validation
            if (!/^https?:\/\//i.test(url) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(url)) {
                return { authentic: false, reason: "Invalid URL format" };
            }

            if(url.startsWith('http://')) {
                return { authentic: false, reason: "Insecure URL (http)", risk_level: "medium" };
            }
            
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            // Check for suspicious patterns
            const suspiciousPatterns = [
                /bit\.ly/i, /tinyurl\.com/i, /t\.co/i,  // URL shorteners
                /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,  // IP addresses
                /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.tk/i,  // Suspicious TLDs
                /phishing|scam|fake|malware/i,  // Suspicious keywords in URL
            ];
            
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(url)) {
                    return {
                        authentic: false,
                        reason: `Suspicious pattern detected: ${pattern.source}`,
                        risk_level: "high"
                    };
                }
            }
            
            // Check URL length
            if (url.length > 100) {
                return {
                    authentic: false,
                    reason: "URL is unusually long",
                    risk_level: "medium"
                };
            }
            
            // Try to make a HEAD request to check if URL exists
            try {
                const response = await fetch(url, {
                    method: 'HEAD',
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Security Checker)'
                    }
                });
                
                if (response.ok) {
                    return {
                        authentic: true,
                        reason: "URL is accessible and appears legitimate",
                        risk_level: "low"
                    };
                } else {
                    return {
                        authentic: false,
                        reason: `URL returned status code: ${response.status}`,
                        risk_level: "medium"
                    };
                }
                
            } catch (fetchError) {
                return {
                    authentic: false,
                    reason: `URL is not accessible: ${fetchError.message}`,
                    risk_level: "high"
                };
            }
                
        } catch (error) {
            return {
                authentic: false,
                reason: `Error checking URL: ${error.message}`,
                risk_level: "unknown"
            };
        }
    }

    checkEmailSpam(email, subject = "", content = "") {
        try {
            if (!email || typeof email !== 'string') {
                return { spam: true, reason: "Invalid email format" };
            }
            
            // Basic email validation
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                return { spam: true, reason: "Invalid email format" };
            }
            
            let spamScore = 0;
            const reasons = [];
            
            // Check domain
            const domain = email.split('@')[1].toLowerCase();
            if (this.suspiciousDomains.includes(domain)) {
                spamScore += 3;
                reasons.push("Temporary/suspicious email domain");
            }
            
            // Check subject line
            const subjectLower = subject.toLowerCase();
            for (const keyword of this.spamKeywords) {
                if (subjectLower.includes(keyword)) {
                    spamScore += 1;
                    reasons.push(`Spam keyword in subject: ${keyword}`);
                }
            }
            
            // Check content
            const contentLower = content.toLowerCase();
            for (const keyword of this.spamKeywords) {
                if (contentLower.includes(keyword)) {
                    spamScore += 1;
                    reasons.push(`Spam keyword in content: ${keyword}`);
                }
            }
            
            // Check for excessive punctuation/caps
            if (subject && subject.length > 0) {
                const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
                if (capsRatio > 0.7) {
                    spamScore += 2;
                    reasons.push("Excessive capital letters");
                }
                
                const exclamationCount = (subject.match(/!/g) || []).length;
                if (exclamationCount > 3) {
                    spamScore += 2;
                    reasons.push("Excessive exclamation marks");
                }
            }
            
            const isSpam = spamScore >= 3;
            
            return {
                spam: isSpam,
                spam_score: spamScore,
                reasons: isSpam ? reasons : ["Email appears legitimate"],
                risk_level: spamScore >= 5 ? "high" : spamScore >= 3 ? "medium" : "low"
            };
            
        } catch (error) {
            return {
                spam: true,
                reason: `Error checking email: ${error.message}`,
                risk_level: "unknown"
            };
        }
    }

    async checkEmailBreach(email) {
        try {
            if (!email || typeof email !== 'string') {
                return { breached: true, reason: "Invalid email format" };
            }
            
            // Basic email validation
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                return { breached: true, reason: "Invalid email format" };
            }
            
            // HaveIBeenPwned API endpoint
            const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`;
            
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Security-Checker-Tool',
                        // Note: You'll need to get a free API key from HaveIBeenPwned
                        // 'hibp-api-key': 'your-api-key-here'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const breaches = data.map(breach => breach.Name);
                    return {
                        breached: true,
                        breach_count: breaches.length,
                        breaches: breaches.slice(0, 5), // Show first 5 breaches
                        risk_level: breaches.length > 3 ? "high" : "medium"
                    };
                } else if (response.status === 404) {
                    return {
                        breached: false,
                        reason: "Email not found in breach databases",
                        risk_level: "low"
                    };
                } else if (response.status === 429) {
                    return {
                        breached: false,
                        reason: "Rate limit exceeded, try again later",
                        risk_level: "unknown"
                    };
                } else {
                    return {
                        breached: false,
                        reason: `API returned status: ${response.status}`,
                        risk_level: "unknown"
                    };
                }
                
            } catch (fetchError) {
                // Fallback to basic domain check
                const domain = email.split('@')[1].toLowerCase();
                
                const knownBreachedDomains = [
                    'yahoo.com', 'adobe.com', 'linkedin.com', 'dropbox.com',
                    'tumblr.com', 'myspace.com', 'lastfm.com'
                ];
                
                if (knownBreachedDomains.includes(domain)) {
                    return {
                        breached: true,
                        reason: `Domain ${domain} has history of breaches`,
                        risk_level: "medium"
                    };
                }
                
                return {
                    breached: false,
                    reason: "Unable to check breach status (API unavailable)",
                    risk_level: "unknown"
                };
            }
                
        } catch (error) {
            return {
                breached: false,
                reason: `Error checking breach status: ${error.message}`,
                risk_level: "unknown"
            };
        }
    }
}

// Initialize security checker
const securityChecker = new SecurityChecker();

// API Routes
app.post('/api/check-link', async (req, res) => {
    try {
        const { url } = req.body;
        console.log("Received URL for checking:", url);
        if (!url) {
            return res.status(400).json({
                error: "Missing 'url' in request body",
                success: false
            });
        } 
        
        const result = await securityChecker.checkLinkAuthenticity(url);
        
        res.json({
            success: true,
            data: result,
            timestamp: Date.now()
        });
        
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
            success: false
        });
    }
});

app.post('/api/check-email-spam', async (req, res) => {
    try {
        const { email, subject = '', content = '' } = req.body;
        if (!email) {
            return res.status(400).json({
                error: "Missing 'email' in request body",
                success: false
            });
        }
        
        const result = securityChecker.checkEmailSpam(email, subject, content);
        
        res.json({
            success: true,
            data: result,
            timestamp: Date.now()
        });
        
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
            success: false
        });
    }
});

app.post('/api/check-email-breach', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                error: "Missing 'email' in request body",
                success: false
            });
        }
        
        const result = await securityChecker.checkEmailBreach(email);
        
        res.json({
            success: true,
            data: result,
            timestamp: Date.now()
        });
        
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
            success: false
        });
    }
});

app.post('/api/check-all', async (req, res) => {
    try {
        const { url, email, subject = '', content = '' } = req.body;
        
        if (!url && !email) {
            return res.status(400).json({
                error: "Missing required data (url or email)",
                success: false
            });
        }
        
        const results = {};
        
        // Check link if provided
        if (url) {
            results.link_check = await securityChecker.checkLinkAuthenticity(url);
        }
        
        // Check email spam and breach if provided
        if (email) {
            results.spam_check = securityChecker.checkEmailSpam(email, subject, content);
            results.breach_check = await securityChecker.checkEmailBreach(email);
        }
        
        res.json({
            success: true,
            data: results,
            timestamp: Date.now()
        });
        
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
            success: false
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: "healthy",
        message: "Security Check API is running",
        timestamp: Date.now()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: "Security Check API",
        version: "1.0.0",
        endpoints: {
            "POST /api/check-link": "Check link authenticity",
            "POST /api/check-email-spam": "Check if email is spam",
            "POST /api/check-email-breach": "Check if email was breached",
            "POST /api/check-all": "Perform all checks",
            "GET /api/health": "Health check"
        },
        example_requests: {
            link_check: {
                url: "https://example.com"
            },
            spam_check: {
                email: "user@example.com",
                subject: "Email subject",
                content: "Email content"
            },
            breach_check: {
                email: "user@example.com"
            },
            combined_check: {
                url: "https://example.com",
                email: "user@example.com",
                subject: "Email subject",
                content: "Email content"
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Security Check API server running on port ${PORT}`);
});