# Bowler Self-Registration System

The Tournament Director platform now includes a comprehensive self-registration system for bowlers with Discord/Roblox integration, email notifications, and registration deadlines.

## 🎳 Features

### **1. Bowler Self-Registration**
- Bowlers can register themselves for tournaments
- Includes Discord username and Roblox username fields
- Skill level selection (Beginner, Intermediate, Advanced, Professional)
- Pre-filled name and email from user account

### **2. Registration Deadline**
- Tournament directors set registration deadlines when creating tournaments
- Deadline displayed on tournament cards
- Automatic enforcement - bowlers cannot register after deadline
- Visual indicators for deadline status

### **3. Email Notifications**
- Automatic confirmation email sent after registration (simulated)
- Email includes:
  - Tournament details (name, format, start date, deadline)
  - Registration details (Discord, Roblox, skill level, timestamp)
  - Confirmation message
- Email content logged to browser console

### **4. Registration Status Display**
- **"Register Now"** button - Available for open tournaments
- **"You're Registered!"** badge - Shows when already registered
- **"Registration Closed"** badge - Shows when deadline has passed
- **"Tournament Full"** badge - Shows when max participants reached

### **5. My Registrations Section**
- Dedicated section for bowlers to view all their registrations
- Shows tournament details, Discord/Roblox names, skill level
- Displays registration timestamp and status
- Confirmation email notification shown

---

## 📋 How It Works

### **For Tournament Directors/Admins:**

1. **Create Tournament with Deadline**
   - Navigate to Tournaments section
   - Click "Create Tournament"
   - Fill in tournament details
   - **Set Registration Deadline** (date and time)
   - Set max participants
   - Click "Create Tournament"

2. **View Registrations**
   - Tournament cards show registration count (e.g., "5 / 32 registered")
   - Directors can see who has registered

### **For Bowlers:**

1. **Browse Tournaments**
   - Login as a Bowler
   - Navigate to "Tournaments" section
   - View available tournaments with deadlines

2. **Register for Tournament**
   - Click "Register Now" button on tournament card
   - Registration form appears with:
     - Tournament name (auto-filled)
     - Your name (auto-filled from account)
     - Email (auto-filled from account)
     - **Discord Username** (enter manually, e.g., "username#1234")
     - **Roblox Username** (enter manually)
     - Skill Level (select from dropdown)
   - Click "Register"

3. **Confirmation**
   - Success message appears
   - Confirmation email sent (simulated)
   - Tournament card updates to show "You're Registered!"

4. **View Your Registrations**
   - Navigate to "My Registrations" section (bowlers only)
   - See all tournaments you've registered for
   - View your Discord/Roblox details
   - See registration timestamp and status

---

## 🚫 Registration Restrictions

### **Cannot Register If:**
1. **Deadline Passed** - Registration deadline has expired
2. **Already Registered** - You're already registered for this tournament
3. **Tournament Full** - Maximum participants reached

### **Visual Indicators:**
- ✅ **Green "Register Now" button** - Available to register
- ✅ **Green badge "You're Registered!"** - Already registered
- ❌ **Red badge "Registration Closed"** - Deadline passed
- ⚠️ **Yellow badge "Tournament Full"** - No spots available

---

## 📧 Email Notification System

### **Email Content Includes:**
```
Subject: Tournament Registration Confirmation - [Tournament Name]

Dear [Bowler Name],

You have successfully registered for [Tournament Name]!

Tournament Details:
- Name: [Tournament Name]
- Format: [Single Elimination/etc.]
- Start Date: [Date]
- Registration Deadline: [Date & Time]

Your Registration Details:
- Discord: [Discord Username]
- Roblox: [Roblox Username]
- Skill Level: [Beginner/Intermediate/Advanced/Professional]
- Registered: [Timestamp]

Good luck in the tournament!

Best regards,
Tournament Director Team
```

### **Current Implementation:**
- Email content is logged to browser console
- Shows simulated email sending
- In production, integrate with email service (SendGrid, Mailgun, etc.)

---

## 🔧 Technical Details

### **Data Structure:**

**Tournament Registration Object:**
```javascript
{
    id: timestamp,
    tournamentId: number,
    userId: number,
    name: string,
    email: string,
    discordName: string,      // New field
    robloxName: string,       // New field
    skillLevel: string,
    registeredAt: ISO timestamp,
    status: 'confirmed'
}
```

**Tournament Object (Updated):**
```javascript
{
    id: timestamp,
    name: string,
    format: string,
    startDate: date,
    registrationDeadline: datetime,  // New field
    maxParticipants: number,
    description: string,
    participants: array,
    registrations: array,            // New field
    bracket: object,
    status: string
}
```

### **Storage:**
- All registrations stored in `localStorage`
- Persists across browser sessions
- Tied to user account via `userId`

### **Validation:**
1. Deadline check - `new Date(deadline) < new Date()`
2. Duplicate check - `tournamentRegistrations.some(reg => reg.tournamentId === id && reg.userId === currentUser.id)`
3. Capacity check - `registrations.length >= maxParticipants`

---

## 🎯 User Flow Examples

### **Example 1: Successful Registration**
1. Bowler logs in
2. Sees tournament "Summer Championship 2025"
3. Deadline: June 15, 2025 11:59 PM
4. Clicks "Register Now"
5. Fills in Discord: "ProBowler#1234"
6. Fills in Roblox: "ProBowlerRBX"
7. Selects Skill: "Advanced"
8. Clicks "Register"
9. ✅ Success! Email sent, badge shows "You're Registered!"

### **Example 2: Deadline Passed**
1. Bowler logs in
2. Sees tournament "Winter Classic 2024"
3. Deadline: December 1, 2024 (past)
4. ❌ Red badge shows "Registration Closed"
5. Cannot register

### **Example 3: Tournament Full**
1. Bowler logs in
2. Sees tournament "Elite Cup"
3. Shows "32 / 32 registered"
4. ⚠️ Yellow badge shows "Tournament Full"
5. Cannot register

---

## 🚀 Production Recommendations

### **Email Integration:**
Replace simulated email with real email service:

```javascript
// Example with SendGrid
async function sendRegistrationEmail(registration, tournament) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            personalizations: [{
                to: [{ email: registration.email }],
                subject: `Tournament Registration Confirmation - ${tournament.name}`
            }],
            from: { email: 'noreply@tournamentdirector.com' },
            content: [{
                type: 'text/plain',
                value: emailTemplate(registration, tournament)
            }]
        })
    });
}
```

### **Additional Features to Consider:**
- SMS notifications (Twilio)
- Calendar invites (.ics files)
- QR code for check-in
- Waitlist system when full
- Registration cancellation
- Edit registration details
- Team registration (for team tournaments)

---

## 📊 Statistics & Reporting

### **For Tournament Directors:**
- View all registrations per tournament
- Export registration list
- See Discord/Roblox usernames for communication
- Track registration timeline
- Monitor capacity in real-time

### **For Bowlers:**
- View all past and upcoming registrations
- Track registration history
- Access confirmation details anytime

---

## 🔒 Security & Privacy

### **Current Implementation:**
- Registration data stored locally
- Tied to user account
- Email addresses protected

### **Production Recommendations:**
- Server-side validation
- Rate limiting on registrations
- Email verification
- GDPR compliance for data storage
- Privacy policy for Discord/Roblox data
- Secure API for email sending

---

## 📝 Quick Reference

### **Bowler Registration Fields:**
| Field | Type | Required | Auto-filled | Notes |
|-------|------|----------|-------------|-------|
| Tournament | Text | Yes | Yes | From selected tournament |
| Name | Text | Yes | Yes | From user account |
| Email | Email | Yes | Yes | From user account |
| Discord Username | Text | Yes | No | Format: username#1234 |
| Roblox Username | Text | Yes | No | Roblox display name |
| Skill Level | Select | Yes | No | Beginner/Intermediate/Advanced/Professional |

### **Registration States:**
- ✅ **Open** - Can register
- ✅ **Registered** - Already registered
- ❌ **Closed** - Deadline passed
- ⚠️ **Full** - Max capacity reached

---

## 🎮 Gaming Platform Integration

### **Discord:**
- Used for tournament communication
- Format: username#1234
- Directors can create Discord channels per tournament
- Send updates and announcements

### **Roblox:**
- Used for in-game identification
- Roblox username for game invites
- Track player stats from Roblox profile
- Verify player identity

---

This bowler registration system provides a complete solution for tournament sign-ups with gaming platform integration and automated notifications!
