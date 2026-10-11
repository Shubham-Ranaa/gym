# FitForge Gym Management System

A complete gym management and fitness website built with Next.js, featuring public website, admin portal, member portal, and QR code-based attendance tracking.

## 🚀 Features

### Public Website
- Home page with hero section, stats, and call-to-action
- About page with gym information, facilities, and training philosophy
- Trainers page showcasing expert fitness professionals
- Membership page with pricing plans and benefits
- Gallery with facility and workout images
- Contact form with validation
- FAQ section with accordion-style questions
- Login and registration pages

### Admin Portal
- Dashboard with key metrics and quick actions
- Member management (add, edit, approve, reject, delete)
- Attendance tracking and reporting
- Membership plan management
- Trainer management
- Enquiry management from website contacts
- Announcement publishing
- Reports and analytics
- System settings configuration

### Member Portal
- Personal dashboard with membership info and attendance status
- Profile management
- Attendance history
- Workout plans
- Gym announcements
- Membership details and renewal requests

### Core Features
- Fixed QR code for gym entrance check-in/check-out
- Role-based authentication (admin/member)
- Server-side validation and security
- Daily attendance limits with timezone support
- Data persistence using JSON files (demo mode)
- Responsive design for all devices
- Modern UI with Tailwind CSS and animations

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Hooks
- **Forms**: React Hook Form (custom implementation)
- **Validation**: Zod
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Authentication**: JWT + HTTP-only cookies
- **Password Hashing**: Bcrypt.js
- **Date Handling**: Date-fns with timezone support
- **Data Storage**: JSON files (demo mode)
- **Testing**: Vitest (unit), Playwright (E2E)

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

## 🏗️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gym-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database with demo data:
   ```bash
   npm run seed
   ```

4. Create a `.env.local` file in the root directory:
   ```
   APP_URL=http://localhost:3000
   SESSION_SECRET=your-super-secret-key-change-in-production-min-32-chars
   GYM_TIMEZONE=Asia/Kolkata
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Demo Credentials

### Admin Account
- **Email**: admin@fitforge.com
- **Password**: admin123

### Member Accounts
- **John Doe** (Half-Yearly Pro): john@fitforge.com / member123
- **Sarah Smith** (Quarterly Power): sarah@fitforge.com / member123
- **Mike Johnson** (Monthly Flex): mike@fitforge.com / member123
- **Alex Wilson** (Monthly Flex): alex.w@fitforge.com / member123
- **Emily Davis** (Expired): emily@fitforge.com / member123
- **Priya Sharma** (Pending Approval): priya@fitforge.com / member123
- **David Brown** (Inactive): david@fitforge.com / member123

## 📱 QR Code Attendance System

The system includes a fixed QR code for gym entrance attendance tracking:

1. Admin accesses QR code page at `/gym-qr` (requires admin login)
2. QR code points to the deployed website's check-in endpoint
3. Members scan the QR code with their phone camera
4. Phone opens the website and prompts for login (if not already logged in)
5. After login, member sees their current attendance status
6. Member taps "Check In" to record entry or "Check Out" to record exit
7. System enforces daily attendance limits (max 1 entry + 1 exit per day)
8. Attendance records are visible in both member and admin portals

## 🌐 Deployment to Render

### Prerequisites
- [Render](https://render.com) account
- GitHub repository connected to Render

### Steps

1. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the gym-management repository

2. **Configure the Service**
   - **Name**: fitforge-gym (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Add Environment Variables**
   - In the "Environment" section, add:
     - `APP_URL`: `https://YOUR-APP.onrender.com` (your Render URL)
     - `SESSION_SECRET`: A long random string (generate with `openssl rand -hex 32`)
     - `GYM_TIMEZONE`: `Asia/Kolkata` (or your preferred timezone)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - First deployment may take a few minutes

5. **Access Your Application**
   - Once deployed, visit: `https://YOUR-APP.onrender.com`
   - The QR code at `/gym-qr` will automatically use your APP_URL

### Important Notes

- **Data Persistence**: Render's filesystem is ephemeral. Data stored in JSON files will be reset on deployments and restarts. This is expected for the demo version.
- **First Request Delay**: On free plans, the service may spin down after inactivity. First request after a period of inactivity may take 10-30 seconds to spin up.
- **Scaling**: For production use with multiple instances, migrate to a proper database (PostgreSQL, MongoDB, etc.)
- **Security**: Always change the SESSION_SECRET in production. Never commit it to version control.

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## 📦 Building for Production

```bash
npm run build
```

### Preview Production Build
```bash
npm start
```

## 🔒 Security Notes

This is a demonstration application with the following limitations:

1. **Data Storage**: Uses JSON files instead of a production database
2. **Authentication**: JWT-based with HTTP-only cookies (suitable for demo)
3. **Validation**: Server-side validation on all API endpoints
4. **Passwords**: Properly hashed with bcrypt
5. **Role Enforcement**: Server-side role checking on protected routes
6. **Input Sanitization**: Basic validation on all inputs
7. **Rate Limiting**: Basic implementation on auth endpoints
8. **CSR Protection**: Relies on SameSite cookies (improve with CSRF tokens for production)

## 📄 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new member
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Get current session

### Members
- `GET /api/members` - List members (admin only)
- `POST /api/members` - Create member (admin only)
- `GET /api/members/me` - Get current member
- `GET /api/members/me/attendance` - Get member attendance
- `GET /api/members/me/workoutplan` - Get member workout plan
- `GET /api/members/me/membership` - Get member membership info
- `POST /api/members/me/renew` - Request membership renewal
- `GET /api/members/[id]` - Get specific member (admin only)
- `PUT /api/members/[id]` - Update member (admin only)
- `DELETE /api/members/[id]` - Delete member (admin only)

### Attendance
- `POST /api/attendance/check-in` - Record check-in
- `GET /api/attendance/status` - Get attendance status
- `GET /api/admin/stats` - Get dashboard stats (admin only)
- `GET /api/admin/attendance/recent` - Get recent activity (admin only)
- `GET /api/admin/attendance/currently-inside` - Get currently inside members (admin only)

### Plans
- `GET /api/plans` - List plans
- `POST /api/plans` - Create plan (admin only)
- `GET /api/plans/[id]` - Get specific plan (admin only)
- `PUT /api/plans/[id]` - Update plan (admin only)
- `DELETE /api/plans/[id]` - Delete plan (admin only)

### Trainers
- `GET /api/trainers` - List trainers (active only)
- `POST /api/trainers` - Create trainer (admin only)
- `GET /api/trainers/[id]` - Get specific trainer (admin only)
- `PUT /api/trainers/[id]` - Update trainer (admin only)
- `DELETE /api/trainers/[id]` - Delete trainer (admin only)

### Enquiries
- `POST /api/enquiries` - Submit enquiry from contact form
- `GET /api/enquiries` - List enquiries (admin only)
- `GET /api/enquiries/[id]` - Get specific enquiry (admin only)
- `PUT /api/enquiries/[id]` - Update enquiry (admin only)

### Announcements
- `GET /api/announcements/active` - Get active announcements
- `GET /api/announcements` - List announcements (admin only)
- `POST /api/announcements` - Create announcement (admin only)
- `GET /api/announcements/[id]` - Get specific announcement (admin only)
- `PUT /api/announcements/[id]` - Update announcement (admin only)
- `DELETE /api/announcements/[id]` - Delete announcement (admin only)

### Settings
- `GET /api/settings` - Get gym settings
- `PUT /api/settings` - Update settings (admin only)

### QR Code
- `GET /api/qr/generate` - Generate QR code (admin only)

### Health
- `GET /api/health` - Health check endpoint

## 📞 Support

For questions or issues with this demonstration application:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure JSON files are writable in the data directory
4. Check network tab in developer tools for API errors
5. Verify authentication cookies are being set properly

## 📜 License

This project is for educational and demonstration purposes only.

---
*Built with Next.js, TypeScript, and Tailwind CSS*
*Demo application - not for production use without proper security review and database migration*