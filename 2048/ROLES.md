# Role-Based Access Control

The Tournament Director platform now includes three distinct user roles with different permission levels.

## 🎭 User Roles

### 1. **Admin** (Full Access)
- **Access Level**: Complete control over all features
- **Permissions**:
  - ✅ Create, edit, and delete tournaments
  - ✅ Manage brackets and auto-seeding
  - ✅ Configure auto-scheduling
  - ✅ Assign lanes
  - ✅ Set up prize distributions
  - ✅ Manage sponsors and contracts
  - ✅ Add and remove participants
  - ✅ View all dashboards and reports

**Use Case**: System administrators, platform owners

---

### 2. **Tournament Director** (Management Access)
- **Access Level**: Full tournament management capabilities
- **Permissions**:
  - ✅ Create, edit, and delete tournaments
  - ✅ Manage brackets and auto-seeding
  - ✅ Configure auto-scheduling
  - ✅ Assign lanes
  - ✅ Set up prize distributions
  - ✅ Manage sponsors and contracts
  - ✅ Add and remove participants
  - ✅ View all dashboards and reports

**Use Case**: Tournament organizers, event coordinators

---

### 3. **Bowler** (View-Only Access)
- **Access Level**: Limited to viewing and participation
- **Permissions**:
  - ✅ View dashboard
  - ✅ View tournaments
  - ✅ View brackets
  - ❌ Cannot create tournaments
  - ❌ Cannot modify schedules
  - ❌ Cannot assign lanes
  - ❌ Cannot manage prizes
  - ❌ Cannot manage sponsors
  - ❌ Cannot add participants

**Restricted Features**:
- Auto Schedule (hidden)
- Lane Assignment (hidden)
- Prize Distribution (hidden)
- Sponsors & Contracts (hidden)
- Participants Management (hidden)
- All "Create" and "Add" buttons (hidden)
- Delete buttons (hidden)

**Use Case**: Tournament participants, viewers

---

## 🔐 How to Use

### Sign Up
1. Open the Tournament Director website
2. Click "Sign Up" on the login screen
3. Fill in your details:
   - Full Name
   - Email
   - **Select Your Role** (Admin, Tournament Director, or Bowler)
   - Password (minimum 6 characters)
   - Confirm Password
4. Click "Create Account"

### Login
1. Enter your email and password
2. Click "Sign In"
3. Your role will be displayed in the top-right corner

### Role Display
- Your name and role are shown in the navigation bar
- Example: "John Doe" / "Tournament Director"

---

## 🎯 Permission Matrix

| Feature | Admin | Tournament Director | Bowler |
|---------|-------|---------------------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Tournaments | ✅ | ✅ | ✅ |
| Create Tournaments | ✅ | ✅ | ❌ |
| Delete Tournaments | ✅ | ✅ | ❌ |
| View Brackets | ✅ | ✅ | ✅ |
| Generate Brackets | ✅ | ✅ | ❌ |
| Auto-Seed | ✅ | ✅ | ❌ |
| Auto-Schedule | ✅ | ✅ | ❌ |
| Lane Assignment | ✅ | ✅ | ❌ |
| Prize Distribution | ✅ | ✅ | ❌ |
| Sponsor Management | ✅ | ✅ | ❌ |
| Participant Management | ✅ | ✅ | ❌ |

---

## 💡 Best Practices

### For Admins
- Create Admin accounts sparingly
- Use Tournament Director role for most organizers
- Regularly review user accounts

### For Tournament Directors
- Focus on tournament setup and management
- Coordinate with sponsors and participants
- Ensure schedules and lanes are properly assigned

### For Bowlers
- Check tournament schedules regularly
- View brackets to track progress
- Contact tournament directors for participation questions

---

## 🔒 Security Notes

**Current Implementation** (Demo/Development):
- Passwords stored in localStorage (plain text)
- Client-side role validation
- Browser-based session management

**Production Recommendations**:
- Hash passwords before storage (bcrypt, argon2)
- Implement server-side authentication
- Use JWT tokens for session management
- Add email verification
- Implement password reset functionality
- Add two-factor authentication (2FA)
- Server-side role validation and authorization

---

## 🚀 Quick Start Examples

### Create an Admin Account
```
Name: Admin User
Email: admin@tournament.com
Role: Admin (Full Access)
Password: admin123
```

### Create a Tournament Director Account
```
Name: John Director
Email: director@tournament.com
Role: Tournament Director (Manage Tournaments)
Password: director123
```

### Create a Bowler Account
```
Name: Jane Bowler
Email: bowler@tournament.com
Role: Bowler (View & Participate)
Password: bowler123
```

---

## 📝 Notes

- Role is assigned during signup and cannot be changed by the user
- Admins can manage all aspects of the platform
- Tournament Directors have the same permissions as Admins
- Bowlers have read-only access to tournaments and brackets
- All users can toggle dark mode and logout
- Session persists across browser refreshes until logout
