# 🚀 Deployment Guide - RiskGraph UPI Fraud Detection

## Pre-Deployment Checklist

### ✅ Local Testing
- [ ] All 6 tabs loading correctly
- [ ] Demo scenarios working (6 pre-configured fraud examples)
- [ ] Graph visualization rendering
- [ ] PDF export functional
- [ ] API endpoints responding (200 OK)
- [ ] Mobile responsive on different screen sizes
- [ ] Guided tour auto-prompting
- [ ] Keyboard shortcuts working (1-6, D)

### ✅ Performance Validation
- [ ] Page loads in < 3 seconds
- [ ] Graph analysis completes in < 1 second
- [ ] No console errors
- [ ] Memory usage stable during navigation
- [ ] All animations smooth (60fps)

---

## Quick Deploy Options

### Option 1: Vercel (Recommended - 5 minutes)

**Why Vercel?**
- Zero-config Next.js deployment
- Automatic SSL
- Global CDN
- Production-ready in 2 minutes

**Steps:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to project
cd upi-risk-intelligence

# 3. Deploy
vercel --prod

# Follow prompts:
# - Project name: upi-risk-intelligence
# - Directory: ./
# - Override settings: No
```

**Result:** Live URL in 2-3 minutes (e.g., `upi-risk-intelligence.vercel.app`)

---

### Option 2: Netlify (Alternative - 5 minutes)

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Build project
npm run build

# 3. Deploy
netlify deploy --prod --dir=.next

# Follow prompts for site configuration
```

---

### Option 3: Docker (For On-Premise)

```bash
# 1. Create Dockerfile (already exists in project)
# 2. Build image
docker build -t riskgraph-upi .

# 3. Run container
docker run -p 3000:3000 riskgraph-upi

# Access at http://localhost:3000
```

---

## Environment Variables

Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com
NODE_ENV=production
```

---

## Production Build

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm start

# Server runs on http://localhost:3000
```

---

## Post-Deployment Testing

### Critical Tests:
1. **Homepage Load** - Open deployed URL, verify landing page
2. **Demo Scenario** - Click "Mule Cluster Attack" in Risk Check
3. **Graph Rendering** - Navigate to Network Graph tab
4. **PDF Export** - Generate report, verify download
5. **Mobile View** - Test on phone/tablet simulator
6. **API Health** - Check `/api/analyze-graph` returns 200

### Performance Benchmarks:
- **First Load:** < 3s
- **Graph Analysis:** < 1s
- **Page Navigation:** < 500ms
- **Lighthouse Score:** 90+ (Performance)

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Out of Memory
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## Custom Domain Setup

### Vercel:
1. Go to project settings
2. Add domain: `riskgraph.yourdomain.com`
3. Add DNS records (provided by Vercel)
4. SSL auto-configured

### Cloudflare (Optional CDN):
1. Add site to Cloudflare
2. Update nameservers
3. Enable "Auto Minify" and "Brotli Compression"
4. Set SSL to "Full (Strict)"

---

## Monitoring & Analytics

### Add Google Analytics (Optional):
```typescript
// src/app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Error Tracking with Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Security Hardening

### Add Security Headers (next.config.ts):
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
}
```

---

## Backup & Version Control

### Tag Release:
```bash
git tag -a v1.0.0 -m "Hackathon Submission"
git push origin v1.0.0
```

### Export Codebase:
```bash
# Create deployment package
zip -r riskgraph-v1.0.0.zip . -x "node_modules/*" ".next/*" ".git/*"
```

---

## Demo Day Preparation

### Pre-Demo Checklist (30 min before):
- [ ] Deployed URL accessible from judges' network
- [ ] Test on judges' WiFi (if available)
- [ ] Clear browser cache
- [ ] Prepare 3 backup scenarios (Mule, Ring, Star)
- [ ] Have PDF export ready
- [ ] Screenshot key features
- [ ] Backup presentation on USB drive

### Quick Recovery Commands:
```bash
# If server crashes during demo
vercel --prod  # Re-deploy in 30 seconds

# Local fallback
npm run dev    # Use localhost if network fails
```

---

## Support Resources

- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Vercel Docs:** https://vercel.com/docs
- **Project Issues:** Check GitHub Issues tab

---

**✅ Deployment Complete!**

Your RiskGraph platform is now production-ready and accessible globally. Good luck with the hackathon! 🏆
