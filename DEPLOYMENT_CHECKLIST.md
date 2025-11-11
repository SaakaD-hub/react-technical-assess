# Deployment Checklist

## Pre-Deployment

### Backend
- [ ] Create .env file with all required variables
  ```
  PORT=3000
  JWT_SECRET=minimum-32-character-random-string-here
  JWT_EXPIRES_IN=7d
  NODE_ENV=production
  ```
- [ ] Test all API endpoints locally
- [ ] Run `npm install` without errors
- [ ] Build succeeds without errors
- [ ] All tests pass
- [ ] Remove console.logs
- [ ] Update CORS origins for production

### Frontend
- [ ] Update API URL for production
- [ ] Test all pages locally
- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Check browser console for errors
- [ ] Verify all images load
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Check for hardcoded URLs
- [ ] Verify all routes work

---

## Deployment Options

### Option 1: Heroku (Easiest for beginners)

**Cost:** Free tier available
**Time:** 10-15 minutes

**Steps:**
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-marketplace-app

# 4. Set environment variables
heroku config:set JWT_SECRET=your-secret-key-here
heroku config:set NODE_ENV=production

# 5. Create Procfile in root
echo "web: cd backend && npm start" > Procfile

# 6. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# 7. Open app
heroku open

# 8. View logs
heroku logs --tail
```

**Post-Deployment:**
- [ ] Test login/register
- [ ] Test adding products to cart
- [ ] Check API responses
- [ ] Verify HTTPS is enabled

---

### Option 2: AWS EC2 (More control, professional)

**Cost:** ~$5-10/month (t2.micro)
**Time:** 30-45 minutes

**Steps:**

**1. Launch EC2 Instance**
```
- Go to AWS Console → EC2
- Launch Instance
- Select Ubuntu Server 22.04 LTS
- Instance Type: t2.micro (free tier)
- Create/Select Key Pair
- Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
- Launch
```

**2. Connect to Instance**
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

**3. Setup Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v

# Install Git
sudo apt-get install -y git

# Clone your repository
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo

# Install dependencies
cd backend
npm install
cd ../frontend
npm install

# Build frontend
npm run build

# Install PM2 (keeps app running)
sudo npm install -g pm2

# Create .env file
cd ../backend
nano .env
# Add your environment variables, save (Ctrl+X, Y, Enter)
```

**4. Install and Configure Nginx**
```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/marketplace
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 public IP

    # Serve React frontend
    location / {
        root /home/ubuntu/yourrepo/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**5. Enable and Start Services**
```bash
# Enable Nginx config
sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default config
sudo nginx -t  # Test config
sudo systemctl restart nginx

# Start backend with PM2
cd ~/yourrepo/backend
pm2 start src/server.js --name marketplace-api
pm2 startup  # Auto-start on reboot
pm2 save

# Check status
pm2 status
pm2 logs marketplace-api
```

**6. Setup SSL (HTTPS) with Let's Encrypt**
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

**Post-Deployment:**
- [ ] Visit http://your-ec2-ip or https://your-domain.com
- [ ] Test all functionality
- [ ] Check PM2 logs: `pm2 logs`
- [ ] Monitor: `pm2 monit`

---

### Option 3: Render (Backend) + Vercel (Frontend)

**Cost:** Free tier available
**Time:** 15-20 minutes

**Backend on Render:**
1. Go to [render.com](https://render.com) and sign up
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Name:** marketplace-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```
6. Create Web Service
7. Copy the URL (e.g., https://marketplace-backend.onrender.com)

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Update API URL in src/services/api.js
# Change to: const API_URL = 'https://your-backend.onrender.com/api';

# Deploy
vercel

# Follow prompts:
# - Setup and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - What's your project's name? marketplace-frontend
# - In which directory is your code located? ./
# - Want to override the settings? N

# Production deployment
vercel --prod
```

**Post-Deployment:**
- [ ] Visit Vercel URL
- [ ] Test login/register
- [ ] Check browser console for errors
- [ ] Verify API calls work

---

## Post-Deployment Testing

### Essential Tests
- [ ] **Homepage loads** without errors
- [ ] **Products page** displays products
- [ ] **Search** functionality works
- [ ] **Filters** work (category, price, sort)
- [ ] **Registration** creates new user
- [ ] **Login** succeeds with correct credentials
- [ ] **Login** fails with wrong credentials
- [ ] **Add to cart** works
- [ ] **Cart page** shows items
- [ ] **Update quantity** in cart works
- [ ] **Remove from cart** works
- [ ] **Protected routes** redirect to login when not authenticated
- [ ] **JWT token** persists across page refreshes
- [ ] **Logout** clears authentication

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsive

### Security Tests
- [ ] HTTPS enabled (production)
- [ ] Cannot access protected routes without token
- [ ] Passwords not visible in network tab
- [ ] JWT expires after set time
- [ ] CORS configured correctly

---

## Monitoring

### Health Check Endpoint
```bash
# Check if backend is running
curl https://your-domain.com/health

# Should return:
# {"success":true,"message":"Marketplace API is running","timestamp":"..."}
```

### PM2 Monitoring (if using EC2)
```bash
# View logs
pm2 logs marketplace-api

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart marketplace-api

# View process info
pm2 info marketplace-api
```

### Useful Commands
```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check disk space
df -h

# Check memory
free -m

# Check running processes
htop
```

---

## Troubleshooting

### Backend not responding
```bash
# Check if process is running
pm2 status

# Check logs
pm2 logs marketplace-api

# Restart
pm2 restart marketplace-api

# Check port 3000 is not in use
sudo lsof -i :3000
```

### Frontend not loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check build files exist
ls -la /home/ubuntu/yourrepo/frontend/dist
```

### Database connection errors
- Check .env file has correct values
- Verify environment variables set in hosting platform
- Check database service is running

### CORS errors
- Update backend CORS configuration
- Add frontend domain to allowed origins
- Check if credentials are included in requests

### 401 Authentication errors
- Check JWT_SECRET is set correctly
- Verify token is being sent in headers
- Check token hasn't expired
- Clear localStorage and login again

---

## Scaling Considerations

### When to Scale
- Response time > 1 second
- CPU usage > 80% consistently
- Memory usage > 80%
- Increased traffic

### Scaling Options
1. **Vertical Scaling**: Upgrade to larger instance (t2.small → t2.medium)
2. **Horizontal Scaling**: Add load balancer with multiple instances
3. **Database**: Move to dedicated database (MongoDB Atlas, RDS)
4. **Caching**: Add Redis for sessions and frequently accessed data
5. **CDN**: Use CloudFront for static assets
6. **Auto-scaling**: Configure AWS Auto Scaling groups

---

## Cost Estimates

### Free Tier (Good for demos)
- **Heroku**: Free (sleeps after 30 min inactivity)
- **Render**: Free (slow cold starts)
- **Vercel**: Free (generous limits)
- **Total**: $0/month

### Professional (Always on, fast)
- **AWS EC2** (t2.micro): $8/month
- **Domain**: $10-15/year
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$10/month

### Production (High traffic)
- **AWS EC2** (t2.medium): $30/month
- **RDS Database**: $15/month
- **Load Balancer**: $18/month
- **CloudFront CDN**: $10/month
- **Total**: ~$73/month

---

## Quick Deploy Commands Reference

**Heroku:**
```bash
git push heroku main
heroku logs --tail
heroku restart
```

**EC2:**
```bash
ssh -i key.pem ubuntu@ip
cd yourrepo
git pull
npm install
npm run build
pm2 restart all
```

**Render:**
- Automatic deployment on git push
- View logs in dashboard

**Vercel:**
```bash
vercel --prod
```

---

## Interview Deployment Demo

**Prepare to show:**
1. Live URL of deployed application
2. How to check server health (`/health` endpoint)
3. Environment variables configuration
4. Logging and monitoring
5. How you handle updates (CI/CD)

**Be ready to discuss:**
- Why you chose this deployment method
- How you handle environment variables
- Your monitoring strategy
- How you would scale
- Security measures (HTTPS, CORS, etc.)

---

## Useful Resources

- [Heroku Docs](https://devcenter.heroku.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
