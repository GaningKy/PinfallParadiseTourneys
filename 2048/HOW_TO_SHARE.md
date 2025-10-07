# 🌐 How to Share Your Tournament Website

This guide explains multiple ways to share your bowling tournament management website with others.

---

## 📋 Table of Contents
1. [Local Network Sharing](#local-network-sharing)
2. [Free Hosting Options](#free-hosting-options)
3. [Paid Hosting Options](#paid-hosting-options)
4. [Quick Setup Instructions](#quick-setup-instructions)

---

## 🏠 Local Network Sharing

### **Option 1: Simple HTTP Server (Python)**

**Requirements:** Python installed on your computer

**Steps:**
1. Open Command Prompt/Terminal in the project folder
2. Run one of these commands:

```bash
# Python 3
python -m http.server 8000

# Or if that doesn't work
python3 -m http.server 8000
```

3. Share your local IP address with others on your network:
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Share: `http://YOUR_IP:8000/tournament.html`
   - Example: `http://192.168.1.100:8000/tournament.html`

**Pros:**
- ✅ Free
- ✅ Instant setup
- ✅ No account needed

**Cons:**
- ❌ Only works on same WiFi network
- ❌ Computer must stay on
- ❌ Not accessible from internet

---

### **Option 2: Live Server (VS Code Extension)**

**Requirements:** Visual Studio Code

**Steps:**
1. Install "Live Server" extension in VS Code
2. Right-click `tournament.html`
3. Select "Open with Live Server"
4. Share the URL with your local network

---

## 🌍 Free Hosting Options

### **Option 1: GitHub Pages** ⭐ RECOMMENDED

**Best for:** Public tournaments, free forever

**Steps:**

1. **Create GitHub Account**
   - Go to https://github.com
   - Sign up for free

2. **Create New Repository**
   - Click "New Repository"
   - Name it: `bowling-tournaments`
   - Make it Public
   - Click "Create Repository"

3. **Upload Your Files**
   - Click "Upload files"
   - Drag and drop all files:
     - `tournament.html`
     - `tournament.js`
     - `tournament.css` (if you have it)
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Select "main" branch
   - Click Save

5. **Get Your URL**
   - Your site will be at: `https://YOUR_USERNAME.github.io/bowling-tournaments/tournament.html`
   - Share this URL with anyone!

**Pros:**
- ✅ 100% Free forever
- ✅ Accessible worldwide
- ✅ HTTPS secure
- ✅ Easy updates (just upload new files)
- ✅ No ads

**Cons:**
- ❌ Repository must be public
- ❌ Takes 1-2 minutes to update

---

### **Option 2: Netlify** ⭐ GREAT ALTERNATIVE

**Best for:** Easy drag-and-drop deployment

**Steps:**

1. **Sign Up**
   - Go to https://www.netlify.com
   - Sign up for free (use GitHub or email)

2. **Deploy Site**
   - Click "Add new site" → "Deploy manually"
   - Drag your entire project folder
   - Wait for deployment (30 seconds)

3. **Get Your URL**
   - You'll get a URL like: `https://random-name-123.netlify.app`
   - Click "Domain settings" to customize it

4. **Share**
   - Share the URL with anyone!

**Pros:**
- ✅ 100% Free
- ✅ Super easy drag-and-drop
- ✅ Instant updates
- ✅ Custom domain support
- ✅ HTTPS secure

**Cons:**
- ❌ Random URL (can customize for free)

---

### **Option 3: Vercel**

**Best for:** Developers familiar with Git

**Steps:**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically
5. Get URL: `https://your-project.vercel.app`

**Pros:**
- ✅ Free
- ✅ Auto-deploys from GitHub
- ✅ Very fast
- ✅ Custom domains

---

### **Option 4: Render**

**Best for:** Static sites with custom domains

**Steps:**

1. Go to https://render.com
2. Sign up for free
3. New → Static Site
4. Connect GitHub or upload files
5. Deploy

**URL:** `https://your-site.onrender.com`

---

## 💰 Paid Hosting Options

### **Option 1: Custom Domain + Hosting**

**Services:**
- **Namecheap**: $10-20/year (domain + hosting)
- **GoDaddy**: $12-25/year
- **Bluehost**: $36/year

**Steps:**
1. Buy domain (e.g., `mybowlingtournaments.com`)
2. Upload files via FTP or cPanel
3. Share your custom domain

**Pros:**
- ✅ Professional custom domain
- ✅ Full control
- ✅ Email addresses included

**Cons:**
- ❌ Costs money
- ❌ More technical setup

---

## 🚀 Quick Setup Instructions

### **Fastest Method (5 Minutes):**

1. **Use Netlify:**
   ```
   1. Go to netlify.com
   2. Drag your folder
   3. Get instant URL
   4. Share with everyone!
   ```

### **Best Free Method (10 Minutes):**

1. **Use GitHub Pages:**
   ```
   1. Create GitHub account
   2. Upload files to repository
   3. Enable Pages in settings
   4. Get permanent free URL
   ```

---

## 📱 Sharing Your URL

Once hosted, share your URL via:

- **Email**: Send link to tournament directors
- **QR Code**: Generate at https://qr-code-generator.com
- **Social Media**: Post on Facebook, Twitter, Discord
- **Text Message**: SMS the link
- **Flyers**: Print QR code on tournament flyers

---

## 🔒 Security Considerations

### **For Public Hosting:**
- ✅ All data stored in browser (localStorage)
- ✅ No server-side database
- ✅ Each user has their own data
- ⚠️ Data is not shared between users
- ⚠️ Users should backup their data

### **For Shared Data:**
If you need multiple users to see the same tournaments:
- Consider using Firebase (free tier available)
- Or use a backend service like Supabase
- Or export/import data feature

---

## 🎯 Recommended Setup

**For Small Local Tournaments:**
→ Use **GitHub Pages** (free, permanent)

**For Quick Testing:**
→ Use **Netlify** (drag-and-drop, instant)

**For Professional Setup:**
→ Buy custom domain + use Netlify/Vercel

---

## 📊 Comparison Table

| Service | Cost | Setup Time | Custom Domain | Best For |
|---------|------|------------|---------------|----------|
| **GitHub Pages** | Free | 10 min | Yes (extra) | Permanent hosting |
| **Netlify** | Free | 2 min | Yes (free) | Quick deployment |
| **Vercel** | Free | 5 min | Yes (free) | Git integration |
| **Python Server** | Free | 1 min | No | Local testing |
| **Custom Hosting** | $10-20/yr | 30 min | Yes | Professional |

---

## 🆘 Troubleshooting

**Problem:** "Site not loading"
- **Solution:** Check if files are in root directory
- **Solution:** Ensure `tournament.html` is the main file

**Problem:** "Data not saving"
- **Solution:** Check browser localStorage is enabled
- **Solution:** Try different browser

**Problem:** "Can't access from phone"
- **Solution:** Use online hosting (GitHub Pages/Netlify)
- **Solution:** Ensure HTTPS is enabled

---

## 📞 Support

For hosting help:
- **GitHub Pages**: https://docs.github.com/pages
- **Netlify**: https://docs.netlify.com
- **Vercel**: https://vercel.com/docs

---

**🎳 Ready to share your tournament site? Pick a method above and get started!**
