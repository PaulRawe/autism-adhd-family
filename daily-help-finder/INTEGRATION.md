# 🚀 Integration Instructions for Your English Website

## Quick Start (5 Minutes)

### Step 1: Upload Folder

1. Upload the complete `daily-help-finder` folder via FTP to your website directory
2. The folder should be at the same level as your `index.html`:

```
your-website.com/
├── index.html
├── downloads.html
├── daily-help-finder/  ← NEW!
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── data/
│       ├── questions.json
│       ├── products.json
│       └── emergency-checklist.pdf
└── ...
```

### Step 2: Add Link to Your Downloads Page

Open your `downloads.html` and add this banner section ABOVE the product grid (right after the "Products Intro" section):

```html
<!-- Daily Help Finder Call-to-Action -->
<section class="finder-cta-section" style="background: linear-gradient(135deg, #4a7c59, #6b9d7a); 
            padding: 2.5rem; 
            border-radius: 12px; 
            text-align: center; 
            margin-bottom: 3rem; 
            color: white;
            box-shadow: 0 4px 20px rgba(74, 124, 89, 0.3);">
    <h2 style="color: white; margin-bottom: 1rem; font-size: 1.8rem;">💡 Not Sure Which Product Is Right for You?</h2>
    <p style="margin-bottom: 1.5rem; opacity: 0.95; font-size: 1.1rem; max-width: 700px; margin-left: auto; margin-right: auto;">
        Our Daily Help Finder will identify the perfect tools for your specific challenges in just 2 minutes.
    </p>
    <a href="daily-help-finder/index.html" 
       style="display: inline-block; 
              background: white; 
              color: #4a7c59; 
              padding: 1rem 2.5rem; 
              border-radius: 8px; 
              text-decoration: none; 
              font-weight: 700;
              font-size: 1.1rem;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              transition: transform 0.2s;">
        Find Your Perfect Match (2 min) →
    </a>
</section>
```

### Step 3: Update Your Products

The funnel is pre-configured with your current 6 products:
1. Complete Homework Emergency Bundle
2. Autism Homework Emergency Plan  
3. ADHD Homework Emergency Plan
4. Complete Autism Support System Bundle
5. Visual Daily Structure Card System
6. Autism Visual Communication Scales Bundle

**If you add new products to your website**, you need to add them to `data/products.json` following the same format.

### Step 4: Test Everything

Before going live, test:
- [ ] All 10 questions display correctly
- [ ] Insights appear after selection
- [ ] Progress bar works
- [ ] Back button functions
- [ ] Results page shows correct recommendations
- [ ] Product links work
- [ ] Mobile view is optimized
- [ ] Lead magnet download works (if you add the PDF)
- [ ] All paths are correct (no 404 errors)

## Customization Options

### Adding the Lead Magnet PDF

1. Create a PDF called `emergency-checklist.pdf` with your free content
2. Place it in the `data/` folder
3. The funnel will automatically offer it on the results page

### Changing Questions

Edit `data/questions.json` to modify questions, add new ones, or change scoring logic.

### Adding New Products

Edit `data/products.json` to add new products. Follow the existing format:

```json
{
  "id": "unique_product_id",
  "name": "Product Name",
  "short_name": "Short Name",
  "price": 19.99,
  "description": "Product description",
  "image": "product-image.jpg",
  "url": "https://your-gumroad-link.com",
  "tags": ["homework", "autism"],
  "helps_with": [
    "Problem 1",
    "Problem 2"
  ],
  "priority_score": {
    "homework": 10,
    "autism": 8
  }
}
```

### Styling Changes

Edit `styles.css` to match your website's design. Key variables:

```css
:root {
    --primary-color: #4a7c59;
    --secondary-color: #6b9d7a;
    --accent-color: #F59E0B;
}
```

## Alternative Integration: Sticky Button

Instead of a banner, you can add a sticky button that's always visible:

Add this to your `downloads.html` (before closing `</body>` tag):

```html
<a href="daily-help-finder/index.html" 
   class="sticky-finder-btn" 
   aria-label="Find your perfect tools">
    <span class="sticky-btn-icon">🎯</span>
    <span class="sticky-btn-text">
        <strong>Find Your Tools</strong>
        <small>2 min quiz</small>
    </span>
</a>

<style>
.sticky-finder-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #4a7c59, #6b9d7a);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 4px 20px rgba(74, 124, 89, 0.4);
    z-index: 1000;
    transition: transform 0.2s;
}

.sticky-finder-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(74, 124, 89, 0.5);
}

.sticky-btn-icon {
    font-size: 1.5rem;
}

.sticky-btn-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.sticky-btn-text strong {
    font-size: 0.95rem;
}

.sticky-btn-text small {
    font-size: 0.75rem;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .sticky-finder-btn {
        bottom: 20px;
        right: 20px;
        padding: 0.8rem 1.2rem;
    }
    
    .sticky-btn-text strong {
        font-size: 0.85rem;
    }
}
</style>
```

## Troubleshooting

### "Loading questions..." doesn't disappear

**Problem:** JSON files can't be loaded

**Solution:**
1. Check browser console (F12)
2. Ensure `data/questions.json` and `data/products.json` are uploaded correctly
3. Check file permissions (should be 644)
4. Test path directly in browser: `your-site.com/daily-help-finder/data/questions.json`

### Results show no products

**Problem:** Scoring or product matching isn't working

**Solution:**
1. Check that product tags match the score categories in questions
2. Verify `priority_score` is set correctly for each product
3. Check browser console for errors

### Mobile view looks broken

**Problem:** Responsive design issues

**Solution:**
1. Clear browser cache (Ctrl + Shift + R)
2. Ensure viewport meta tag is in `index.html`
3. Test on actual mobile device, not just browser resize

## Support

For questions or issues:
- Check the browser console (F12) for errors
- Validate JSON files: https://jsonlint.com/
- Contact: rawe.p@freenet.de

---

**You're all set! Your Daily Help Finder is ready to help your visitors find the perfect tools! 🎉**
