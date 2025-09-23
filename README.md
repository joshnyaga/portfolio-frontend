// README.md
# Portfolio with Admin Panel

A modern portfolio website built with Next.js 14, TypeScript, Firebase, and Tailwind CSS. Features a complete admin panel for content management.

## Features

- 🚀 **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- 🔥 **Firebase Backend**: Firestore for data, Storage for images, Authentication for admin
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🛡️ **Admin Panel**: Complete CRUD operations for projects, skills, experience
- 📧 **Contact Form**: Visitors can send messages through the contact form
- ⚡ **Performance**: Optimized images, lazy loading, and fast navigation
- 🔒 **Security**: Firebase security rules protect admin-only operations

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd portfolio-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `.env.local`
   - Deploy the security rules from the config files

4. **Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Firebase configuration values.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Create Admin User**
   - Go to Firebase Authentication
   - Add a user with your admin email
   - Update the security rules with your admin email

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin panel pages
│   ├── login/          # Authentication
│   └── page.tsx        # Portfolio homepage
├── components/         # Reusable components
├── lib/               # Utilities and Firebase config
│   ├── firebase/      # Firebase configuration
│   └── types/         # TypeScript types
└── hooks/             # Custom React hooks
```

## Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Configure environment variables** in your deployment platform

## Customization

1. **Update personal information** in `src/app/page.tsx`
2. **Modify colors and styling** in `tailwind.config.js`
3. **Add new sections** by creating components and updating the navigation
4. **Extend data models** in `src/lib/types/index.ts`



### CORS Issues
- Ensure backend CORS is configured for `http://localhost:3000`
- Check `FRONTEND_URL` in backend `.env`

### Authentication Issues
- Verify JWT_SECRET is set in backend
- Check token in browser localStorage
- Ensure admin user exists in MongoDB

### File Upload Issues
- Check GridFS is initialized in backend
- Verify file size limits (5MB max)
- Ensure correct file types (images only)

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check backend health endpoint: `http://localhost:5000/api/health`
- Ensure both servers are running

## 📈 Performance

### Optimizations
- **Image caching** with proper headers
- **API response caching** where appropriate
- **Lazy loading** for images
- **Optimized bundle** size without Firebase

### Monitoring
- **Error tracking** with console logs
- **API response times** monitoring
- **User authentication** status tracking

---

**Your portfolio is now fully integrated with the Express backend! 🎉**

## License

MIT License - feel free to use this project for your own portfolio!