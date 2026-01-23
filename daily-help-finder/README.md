# Daily Help Finder - English Version

## 📋 What's This?

This is a personalized product recommendation funnel for your English website. It helps visitors find the right autism/ADHD support tools by answering 10 questions about their daily challenges.

## 📁 What's Included

```
daily-help-finder/
├── index.html              → Main quiz page
├── styles.css              → All styling
├── app.js                  → Quiz logic & functionality
├── data/
│   ├── questions.json      → 10 questions (pre-configured)
│   ├── products.json       → Your 6 products (pre-configured)
│   └── emergency-checklist.pdf  → Free lead magnet (you need to add this)
├── INTEGRATION.md          → Detailed integration guide
├── DOWNLOADS-INTEGRATION-CODE.html  → Code to paste into downloads.html
└── README.md               → This file
```

## ⚡ Quick Setup (5 Minutes)

### 1. Upload Files
Upload the entire `daily-help-finder` folder to your website via FTP, at the same level as your `downloads.html`:

```
your-website.com/
├── downloads.html
├── daily-help-finder/  ← Upload here
```

### 2. Add to Downloads Page
Open `DOWNLOADS-INTEGRATION-CODE.html` and copy the entire section.

Paste it into your `downloads.html` **right after** the "Products Intro" section and **before** the "Category Filter" section.

### 3. Test
Visit: `your-website.com/daily-help-finder/index.html`

Complete the quiz and verify:
- ✓ All questions work
- ✓ Results show your products
- ✓ Product links work correctly

## 🎯 Products Included

The funnel is pre-configured with your 6 products:
1. Complete Homework Emergency Bundle ($15.99)
2. Autism Homework Emergency Plan ($9.99)
3. ADHD Homework Emergency Plan ($9.99)
4. Complete Autism Support System Bundle ($39.99)
5. Visual Daily Structure Card System ($24.99)
6. Autism Visual Communication Scales Bundle ($29.00)

## 📝 Questions Configured

10 questions covering:
- Homework struggles
- Autism/ADHD diagnosis
- Morning/evening routines
- Meltdowns and overwhelm
- Communication abilities
- School challenges
- Transitions
- Focus and attention
- Public situations
- Biggest current wish

## 🎁 Lead Magnet (Optional)

To offer a free PDF download on the results page:
1. Create `emergency-checklist.pdf` with your free content
2. Place it in the `data/` folder
3. It will automatically appear on results page

## 🔧 Customization

### Change Colors
Edit `styles.css` - look for `:root` variables at the top.

### Add/Remove Products
Edit `data/products.json` - follow the existing format.

### Modify Questions
Edit `data/questions.json` - follow the existing structure.

## 📱 Mobile Optimized

The funnel is fully responsive and works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

## 🆘 Troubleshooting

**Questions won't load?**
- Check browser console (F12) for errors
- Verify JSON files are uploaded correctly
- Test direct path: `your-site.com/daily-help-finder/data/questions.json`

**No recommendations appear?**
- Check that you completed all questions
- Verify product `priority_score` matches question scoring categories

**Mobile view broken?**
- Clear browser cache
- Test on actual device, not just browser resize

## 📧 Support

Questions or issues? Contact: rawe.p@freenet.de

## 🎉 You're Ready!

Your Daily Help Finder is fully configured and ready to help your visitors find the perfect tools for their needs!
