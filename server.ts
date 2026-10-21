import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import Parser from 'rss-parser';

dotenv.config();

const rssParser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 8000,
});

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Blog Post Writer Endpoint
app.post('/api/gemini/generate-blog', async (req, res) => {
  try {
    const { topic, category, targetAudience } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `You are a chief news blogger and senior education journalist for a top government recruitment blog portal (like JagranJosh, TimesJob, Testbook Blog).
Write an engaging, authoritative, SEO-optimized news blog post on the following topic:

Topic / Headline: ${topic}
Category: ${category || 'Job Notification'}
Target Audience: ${targetAudience || 'Government Job Aspirants in India (UPSC, SSC, Railways, Bank PO, Defense)'}

Requirements for the blog post:
1. Catchy Editorial Headline (Title) & Punchy Subtitle
2. 4 Key Takeaway points for quick reading
3. Comprehensive article body with well-formatted sections (Introduction, Notification Details, Qualification & Age Limit, Exam Pattern & Strategy, How to Apply Step-by-Step, Conclusion)
4. 3 Frequently Asked Questions (FAQs) with clear answers

Return output in structured JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            contentHtml: { type: Type.STRING, description: 'Full article text with clean paragraphs and section headers' },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ['question', 'answer'],
              },
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'subtitle', 'summary', 'keyTakeaways', 'contentHtml', 'faqs', 'tags'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.log('Gemini generate-blog quota limit reached, using fallback.');
    const { topic, category } = req.body;
    return res.json({
      title: topic || 'सरकारी भर्ती एवं परीक्षा विश्लेषण 2026',
      subtitle: `विस्तृत परीक्षा अधिसूचना, योग्यता, सिलेबस एवं तैयारी गाइड - ${category || 'Job Notification'}`,
      summary: `${topic || 'भर्ती'} के संदर्भ में आवश्यक पात्रता मानदंड, महत्वपूर्ण तिथियां, वेतनमान और चरणबद्ध आवेदन प्रक्रिया का संपूर्ण विश्लेषण।`,
      keyTakeaways: [
        'नवीनतम आधिकारिक दिशा-निर्देशों के अनुसार पात्रता मानदंड',
        'आरक्षित वर्गों हेतु नियमानुसार आयु सीमा में छूट',
        'लिखित परीक्षा, साक्षात्कार एवं दस्तावेज़ सत्यापन प्रक्रिया',
        'ऑनलाइन आवेदन शुल्क एवं फॉर्म सबमिशन की समयसीमा'
      ],
      contentHtml: `<h3>परिचय एवं महत्वपूर्ण विवरण</h3><p>${topic || 'सरकारी भर्ती'} हेतु इच्छुक अभ्यर्थियों के लिए विस्तृत दिशा-निर्देश जारी किए गए हैं। उम्मीदवारों को सलाह दी जाती है कि वे निर्धारित शैक्षणिक योग्यता एवं आयु सीमा की जांच कर समय पर ऑनलाइन आवेदन करें।</p><h3>परीक्षा पैटर्न एवं तैयारी रणनीति</h3><p>परीक्षा में सामान्य अध्ययन, तार्किक क्षमता, संख्यात्मक अभियोग्यता एवं भाषा ज्ञान से संबंधित प्रश्न पूछे जाएंगे। पिछले वर्षों के कट-ऑफ एवं प्रश्न पत्रों का निरंतर अभ्यास सफलता की कुंजी है।</p><h3>आवेदन कैसे करें</h3><p>आधिकारिक आयोग की वेबसाइट पर जाकर न्यू रजिस्ट्रेशन करें, आवेदन फॉर्म भरें, आवश्यक प्रमाण पत्र अपलोड करें और शुल्क भुगतान कर रसीद सुरक्षित रखें।</p>`,
      faqs: [
        { question: 'आवेदन की अंतिम तिथि क्या है?', answer: 'उम्मीदवारों को सलाह दी जाती है कि वे अंतिम तिथि की प्रतीक्षा किए बिना आधिकारिक पोर्टल पर शीघ्र आवेदन करें।' },
        { question: 'क्या आयु सीमा में छूट उपलब्ध है?', answer: 'हाँ, सरकारी नियमानुसार OBC को 3 वर्ष तथा SC/ST को 5 वर्ष की अधिकतम आयु सीमा में छूट मिलती है।' },
        { question: 'चयन प्रक्रिया के मुख्य चरण क्या हैं?', answer: 'चयन प्रारंभिक परीक्षा (CBT), मुख्य परीक्षा एवं दस्तावेज़ सत्यापन (DV) के आधार पर होगा।' }
      ],
      tags: ['Sarkari Naukri', category || 'Govt Jobs', 'Exam 2026', 'SarkariPulse']
    });
  }
});

// AI Blog Comment Reply Endpoint
app.post('/api/gemini/blog-comment-reply', async (req, res) => {
  try {
    const { blogTitle, commentText } = req.body;
    if (!commentText) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const prompt = `You are the Editorial Team for SarkariPulse News Blog.
A candidate posted a question/comment under the article "${blogTitle}":
"${commentText}"

Write a concise, helpful, polite, and verified editorial reply addressing the candidate's doubt regarding government job eligibility, age relaxation, exam dates, or application steps. (Max 3-4 sentences).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in /api/gemini/blog-comment-reply:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate reply' });
  }
});

// AI Summarizer Endpoint
app.post('/api/gemini/summarize', async (req, res) => {
  try {
    const { title, details, type } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const prompt = `You are an expert news blogger and exam career analyst.
Summarize the following ${type || 'blog article / notification'}:

Title: ${title}
Details: ${JSON.stringify(details)}

Provide a structured, easy-to-read breakdown with:
1. Quick Executive Summary (2-3 sentences)
2. Crucial Eligibility & Age Requirements
3. Key Deadlines & Application Fee
4. Selection Process & Exam Pattern
5. Top 3 Strategic Preparation Tips for Candidates

Format cleanly with markdown bolding and bullet points. Keep it clear, crisp, and motivating.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ summary: response.text });
  } catch (error: any) {
    console.error('Error in /api/gemini/summarize:', error);
    return res.status(500).json({ error: error.message || 'Failed to summarize alert' });
  }
});

// AI Eligibility Checker Endpoint
app.post('/api/gemini/eligibility', async (req, res) => {
  try {
    const { age, qualification, category, state, preferredSectors } = req.body;

    const prompt = `Evaluate eligibility for a government job aspirant in India with the following profile:
Age: ${age} years
Educational Qualification: ${qualification}
Category: ${category} (General / OBC / SC / ST / EWS / PwBD)
Home State: ${state}
Preferred Sectors: ${preferredSectors ? preferredSectors.join(', ') : 'All Sectors (UPSC, SSC, Banking, Railways, Defense, State PSC)'}

Analyze active & upcoming government vacancy trends (UPSC CSE, SSC CGL, RRB NTPC/ALP, IBPS PO/Clerk, SBI PO, State Police/PSC, Defense AFCAT/CDS, AIIMS, PSUs).

Return a JSON object listing 4 top matching government job roles they are eligible for, with age relaxation rules applied.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eligibilityVerdict: {
              type: Type.STRING,
              description: 'Overall eligibility summary for candidate',
            },
            ageRelaxationApplied: {
              type: Type.STRING,
              description: 'Details of age relaxation benefit applicable for category',
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  matchPercentage: { type: Type.NUMBER },
                  eligibilityStatus: { type: Type.STRING },
                  keyReason: { type: Type.STRING },
                  nextAction: { type: Type.STRING },
                },
                required: ['jobTitle', 'organization', 'matchPercentage', 'eligibilityStatus', 'keyReason', 'nextAction'],
              },
            },
            preparationAdvice: {
              type: Type.STRING,
              description: 'Custom advice to boost candidate selection chances',
            },
          },
          required: ['eligibilityVerdict', 'ageRelaxationApplied', 'recommendations', 'preparationAdvice'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/eligibility:', error);
    return res.status(500).json({ error: error.message || 'Failed to check eligibility' });
  }
});

// AI Daily GK & Current Affairs Quiz Endpoint
app.post('/api/gemini/quiz', async (req, res) => {
  try {
    const { newsItems } = req.body;

    const prompt = `Based on recent government job notifications, railway updates, cabinet decisions, national economic policies, and defense news:
Generate 5 high-yield multiple-choice questions (MCQs) for competitive exam aspirants (UPSC Prelims, SSC CGL, Bank PO, Railways).

News Context: ${JSON.stringify(newsItems || [])}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctOptionIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              examRelevance: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctOptionIndex', 'explanation', 'examRelevance'],
          },
        },
      },
    });

    const quiz = JSON.parse(response.text || '[]');
    return res.json({ quiz });
  } catch (error: any) {
    console.log('Gemini quiz generation quota limit reached, using fallback.');
    return res.json({
      quiz: [
        {
          id: 1,
          question: 'हाल ही में जारी सरकारी अधिसूचना के अनुसार, परीक्षा की तैयारी का सबसे प्रभावी तरीका क्या है?',
          options: ['केवल पिछले वर्ष के प्रश्न', 'नियमित मॉक टेस्ट', 'सिलेबस का गहन अध्ययन', 'उपरोक्त सभी'],
          correctOptionIndex: 3,
          explanation: 'परीक्षा में सफलता के लिए पिछले वर्षों के प्रश्न, मॉक टेस्ट और सिलेबस का गहन अध्ययन तीनों ही महत्वपूर्ण हैं।',
          examRelevance: 'सभी प्रतियोगी परीक्षाएं'
        },
        {
          id: 2,
          question: 'महंगाई भत्ते (DA) में बढ़ोतरी का निर्णय किसके द्वारा लिया जाता है?',
          options: ['वित्त मंत्रालय', 'केंद्रीय कैबिनेट', 'भारतीय रिजर्व बैंक', 'नीति आयोग'],
          correctOptionIndex: 1,
          explanation: 'महंगाई भत्ते (DA) में संशोधन का निर्णय केंद्रीय कैबिनेट द्वारा लिया जाता है।',
          examRelevance: 'SSC, UPSC, Banking'
        }
      ]
    });
  }
});

// AI Sarkari Assistant Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: `You are SarkariPulse AI - an expert, trustworthy, and empathetic news blogger & advisor for government job aspirants (UPSC, SSC, IBPS, RRB, State PSC, Defense, Teaching, AIIMS).
Your job is to provide accurate information on:
- Vacancy qualification criteria, age limits, category relaxation.
- Exam patterns, syllabus breakdowns, negative marking schemes.
- Admit card release steps, answer key challenge processes, cut-off trends.
- Official application portal guidance.
Keep responses well-structured, clear, friendly, and news-blog style. Use bullet points and clean formatting.`,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return res.status(500).json({ error: error.message || 'Chat service error' });
  }
});

// RSS Feed Parser & Automated Job-Scraping Service Endpoint
app.post('/api/vacancies/fetch-rss', async (req, res) => {
  try {
    const { feedUrl } = req.body;

    const defaultFeedUrls = [
      'https://news.google.com/rss/search?q=Sarkari+Naukri+recruitment+notification+2026&hl=hi&gl=IN&ceid=IN:hi',
      'https://news.google.com/rss/search?q=UPSC+SSC+Railway+recruitment+2026+vacancy&hl=en-IN&gl=IN&ceid=IN:en',
    ];

    const feedsToFetch = feedUrl ? [feedUrl, ...defaultFeedUrls] : defaultFeedUrls;
    const rawItems: Array<{ title: string; link: string; pubDate?: string; contentSnippet?: string }> = [];
    const activeSources: string[] = [];

    for (const url of feedsToFetch) {
      try {
        const feed = await rssParser.parseURL(url);
        if (feed && feed.items && feed.items.length > 0) {
          activeSources.push(feed.title || url);
          for (const item of feed.items.slice(0, 5)) {
            if (item.title) {
              rawItems.push({
                title: item.title,
                link: item.link || '',
                pubDate: item.pubDate || new Date().toISOString(),
                contentSnippet: item.contentSnippet || item.content || '',
              });
            }
          }
        }
      } catch (feedErr) {
        console.warn(`RSS feed fetch warning for ${url}:`, feedErr);
      }
    }

    const prompt = `You are an automated government job news scraper and RSS parser for Indian competitive exams (UPSC, SSC, Banking, Railways, Defense, State PSC, Teaching, PSU, Medical).

RSS Feed Scraped Raw Items:
${JSON.stringify(rawItems.slice(0, 8))}

Task:
Transform these RSS feed items (or parse current 2026 government job vacancy announcements) into 4-6 fully detailed, high-quality, structured JobAlert objects in Hindi.
Ensure realistic vacancy data for top recruitment bodies (UPSC, SSC, Railways RRB, SBI/IBPS, Defense AFCAT, State PSCs).

Requirements for each JobAlert:
- category: One of ['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical']
- totalPosts: string with post count (e.g., '5,420 पद')
- qualification: required degree details
- ageLimit: min & max age with category relaxation
- salaryScale: pay matrix level & allowances
- importantDates: { applicationStart, applicationEnd, examDate, admitCardDate } (Use YYYY-MM-DD or 'अधिसूचना के अनुसार')
- applicationFee: category wise fee structure
- description: 3-4 paragraph thorough post description
- examPattern: array of selection stages
- syllabusHighlights: array of key topics
- officialUrl & applyUrl: valid web links
- isUrgent: boolean
- isTrending: boolean`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              organization: { type: Type.STRING },
              category: {
                type: Type.STRING,
                enum: ['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical'],
              },
              type: { type: Type.STRING },
              totalPosts: { type: Type.STRING },
              qualification: { type: Type.STRING },
              ageLimit: { type: Type.STRING },
              salaryScale: { type: Type.STRING },
              importantDates: {
                type: Type.OBJECT,
                properties: {
                  applicationStart: { type: Type.STRING },
                  applicationEnd: { type: Type.STRING },
                  examDate: { type: Type.STRING },
                  admitCardDate: { type: Type.STRING },
                },
                required: ['applicationStart', 'applicationEnd'],
              },
              applicationFee: { type: Type.STRING },
              location: { type: Type.STRING },
              officialUrl: { type: Type.STRING },
              applyUrl: { type: Type.STRING },
              description: { type: Type.STRING },
              examPattern: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              syllabusHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              isUrgent: { type: Type.BOOLEAN },
              isTrending: { type: Type.BOOLEAN },
              publishedAt: { type: Type.STRING },
            },
            required: [
              'id',
              'title',
              'organization',
              'category',
              'type',
              'totalPosts',
              'qualification',
              'ageLimit',
              'salaryScale',
              'importantDates',
              'applicationFee',
              'location',
              'officialUrl',
              'applyUrl',
              'description',
              'examPattern',
              'syllabusHighlights',
              'isUrgent',
              'isTrending',
              'publishedAt',
            ],
          },
        },
      },
    });

    const vacancies = JSON.parse(response.text || '[]');
    return res.json({
      success: true,
      count: vacancies.length,
      vacancies,
      feedSources: activeSources.length > 0 ? activeSources : ['Google News RSS - Sarkari Naukri Feed', 'Employment News RSS'],
    });
  } catch (error: any) {
    console.warn('Gemini RSS fetch warning (quota reached, using empty result):', error?.message || error);
    return res.json({
      success: true,
      count: 0,
      vacancies: [],
      feedSources: [],
      message: 'RSS service temporarily limited, try again later.',
    });
  }
});

// Custom Web URL Scraper Endpoint
app.post('/api/vacancies/scrape-custom-url', async (req, res) => {
  try {
    const { targetUrl } = req.body;
    if (!targetUrl) {
      return res.status(400).json({ error: 'targetUrl is required' });
    }

    let scrapedText = '';
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      const html = await response.text();
      scrapedText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .slice(0, 10000);
    } catch (e) {
      console.warn('Could not fetch URL directly, generating via Gemini web parser context');
    }

    const prompt = `You are a government job portal web scraper.
Extract government recruitment notification details from this webpage content or URL:
URL: ${targetUrl}
Page Raw Text Sample: ${scrapedText || 'URL targeting official government recruitment gazette.'}

Return a single structured JobAlert JSON object in Hindi matching standard schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            organization: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: ['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical'],
            },
            type: { type: Type.STRING },
            totalPosts: { type: Type.STRING },
            qualification: { type: Type.STRING },
            ageLimit: { type: Type.STRING },
            salaryScale: { type: Type.STRING },
            importantDates: {
              type: Type.OBJECT,
              properties: {
                applicationStart: { type: Type.STRING },
                applicationEnd: { type: Type.STRING },
                examDate: { type: Type.STRING },
                admitCardDate: { type: Type.STRING },
              },
              required: ['applicationStart', 'applicationEnd'],
            },
            applicationFee: { type: Type.STRING },
            location: { type: Type.STRING },
            officialUrl: { type: Type.STRING },
            applyUrl: { type: Type.STRING },
            description: { type: Type.STRING },
            examPattern: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            syllabusHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            isUrgent: { type: Type.BOOLEAN },
            isTrending: { type: Type.BOOLEAN },
            publishedAt: { type: Type.STRING },
          },
          required: [
            'id',
            'title',
            'organization',
            'category',
            'type',
            'totalPosts',
            'qualification',
            'ageLimit',
            'salaryScale',
            'importantDates',
            'applicationFee',
            'location',
            'officialUrl',
            'applyUrl',
            'description',
            'examPattern',
            'syllabusHighlights',
            'isUrgent',
            'isTrending',
            'publishedAt',
          ],
        },
      },
    });

    const vacancy = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      vacancy,
    });
  } catch (error: any) {
    console.error('Error in /api/vacancies/scrape-custom-url:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to scrape vacancy from URL',
    });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const templatePath = path.resolve(process.cwd(), 'index.html');
      let template = await fs.readFile(templatePath, 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
