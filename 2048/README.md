# Tournament Director - Professional Bowling Tournament Management System

A comprehensive web-based bowling tournament management platform designed for tournament directors to efficiently organize, manage, and execute competitive bowling events.

## Features

### 🎳 Bowling Tournament Management
- Create and manage multiple bowling tournaments
- Support for various bowling tournament formats:
  - **Single Elimination (Stepladder)** - Traditional stepladder finals
  - **Double Elimination** - Second chance bracket
  - **Round Robin (Baker Format)** - Everyone bowls everyone
  - **Match Play** - Head-to-head competition
  - **Scratch Tournament** - No handicap
  - **Handicap Tournament** - Handicap-based scoring
- Real-time tournament status tracking
- Bowler registration and management with Discord/Roblox integration

### 📊 Bracket System
- **Auto-Seeding**: Automatically seed bowlers based on bowling averages
- Visual bracket display with real-time updates
- Support for multiple bowling bracket formats
- Match progression tracking
- Winner advancement automation
- Display bowling averages on brackets

### 📅 Auto-Scheduling
- Intelligent match scheduling based on:
  - Tournament format
  - Available time slots
  - Match duration
  - Break periods between rounds
- Conflict detection and resolution
- Customizable scheduling parameters

### 🎯 Lane Assignment
- **Auto-Assign Lanes**: Three assignment methods:
  - **Random**: Random lane distribution
  - **Sequential**: Round-robin lane assignment
  - **Balanced**: Optimized lane usage
- Configurable number of lanes
- Visual lane utilization display
- Real-time lane availability tracking

### 💰 Prize Distribution
- Flexible prize pool configuration
- Pre-configured distribution templates:
  - **Standard** (50/30/20)
  - **Top Heavy** (70/20/10)
  - **Balanced** (40/30/20/10)
  - **Custom** distribution
- Automatic prize calculation
- Per-tournament prize management

### 🤝 Sponsor & Contract Management
- Company/sponsor database
- Contract tracking with start/end dates
- Sponsorship amount management
- Tournament-specific or global sponsorships
- Benefits and terms documentation
- Active/expired status tracking

### 🎳 Bowler Management
- Comprehensive bowler database
- Bowling average tracking (0-300)
- Skill level categorization:
  - **Beginner** (0-120 avg)
  - **Intermediate** (121-180 avg)
  - **Advanced** (181-220 avg)
  - **Professional** (221+ avg)
- Discord and Roblox username integration
- Search and filter functionality
- Email contact management

### 📈 Dashboard & Analytics
- Real-time statistics:
  - Active tournaments count
  - Total participants
  - Scheduled matches
  - Active sponsors
- Recent activity feed
- Quick access to all features

## Getting Started

### Installation

1. Clone or download the project files
2. Open `tournament.html` in a modern web browser
3. No server or installation required - runs entirely in the browser!

### Quick Start Guide

1. **Add Participants**
   - Navigate to "Participants" section
   - Click "Add Participant"
   - Enter participant details including name, email, skill level, and rating

2. **Create a Tournament**
   - Go to "Tournaments" section
   - Click "Create Tournament"
   - Fill in tournament details (name, format, date, max participants)

3. **Generate Bracket**
   - Navigate to "Brackets" section
   - Select your tournament
   - Click "Generate Bracket"
   - Use "Auto-Seed" to seed participants by rating

4. **Auto-Schedule Matches**
   - Go to "Auto Schedule" section
   - Select tournament, start date, and match duration
   - Click "Generate Schedule"

5. **Assign Lanes**
   - Navigate to "Lane Assignment"
   - Configure total lanes and select tournament
   - Choose assignment method (Random/Sequential/Balanced)
   - Click "Auto-Assign Lanes"

6. **Configure Prizes**
   - Go to "Prize Distribution"
   - Click "Add Prize Pool"
   - Select tournament and enter total prize amount
   - Choose distribution type

7. **Add Sponsors**
   - Navigate to "Sponsors & Contracts"
   - Click "Add Sponsor"
   - Enter company details, contract dates, and sponsorship amount

## Data Persistence

All data is stored locally in your browser using LocalStorage. This means:
- ✅ No server required
- ✅ Data persists between sessions
- ✅ Works offline
- ⚠️ Data is browser-specific (clearing browser data will delete all information)

## Technology Stack

- **Frontend**: HTML5, TailwindCSS
- **JavaScript**: Vanilla JS (ES6+)
- **Icons**: Font Awesome 6
- **Storage**: Browser LocalStorage
- **Fonts**: Google Fonts (Inter)

## Browser Compatibility

Works best on modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features in Detail

### Auto-Seeding Algorithm
The auto-seeding feature uses a rating-based system to ensure fair matchups:
1. Sorts participants by rating (highest to lowest)
2. Places top-rated players in optimal bracket positions
3. Ensures balanced competition throughout rounds

### Auto-Scheduling Logic
The scheduling system considers:
- Match duration settings
- Automatic break periods between rounds
- Sequential time slot allocation
- Integration with lane assignments

### Lane Assignment Strategies
- **Random**: Distributes matches randomly across available lanes
- **Sequential**: Rotates through lanes in order for even distribution
- **Balanced**: Optimizes lane usage to minimize conflicts and maximize efficiency

## Tips for Tournament Directors

1. **Add participants before creating tournaments** for easier management
2. **Use auto-seeding** to ensure fair bracket placement based on skill
3. **Generate schedules early** to identify potential conflicts
4. **Assign lanes after scheduling** for optimal venue utilization
5. **Set up sponsors and prizes** before tournament start for transparency

## Implemented Features ✅

### Core Tournament Management
- ✅ Create and manage multiple tournaments
- ✅ Bowling-specific formats (Stepladder, Baker, Match Play, etc.)
- ✅ Tournament status tracking (Upcoming, Ongoing, Completed)
- ✅ Registration deadline management
- ✅ Max participant limits

### Bowler Management
- ✅ Comprehensive bowler database
- ✅ Self-registration system with Discord/Roblox integration
- ✅ Manual bowler selection for tournaments
- ✅ Base 160 average for new bowlers
- ✅ Search and filter capabilities
- ✅ Export database to CSV
- ✅ Active/Inactive status tracking

### Bracket System
- ✅ Single elimination brackets
- ✅ Auto-seeding by bowling average
- ✅ Live score entry and tracking
- ✅ Automatic winner advancement
- ✅ Visual bracket display with match cards
- ✅ Minimum 1 bowler support

### User Experience
- ✅ Beautiful modal designs (no alert popups)
- ✅ Toast notification system
- ✅ Auto-update notification with state preservation
- ✅ Role-based access (Admin, Director, Bowler)
- ✅ Activity feed tracking
- ✅ Responsive mobile-friendly design

### Data Management
- ✅ Browser localStorage persistence
- ✅ CSV export for bowler database
- ✅ Data preservation during updates
- ✅ Session management

## Future Enhancements 🚀

### Export & Reporting
- 📄 Export brackets to PDF
- 📄 Export tournament results to PDF
- 📊 Printable score sheets
- 📈 Tournament statistics reports
- 🏆 Championship certificates generator

### Communication
- 📧 Email notifications to participants
- 📱 SMS notifications for match times
- 💬 In-app messaging system
- 🔔 Push notifications for score updates
- 📢 Tournament announcements

### Advanced Features
- 🎯 Live score updates (real-time)
- 📅 Multi-day tournament support
- 👥 Team-based tournaments (doubles, trios)
- 🏅 Player rankings and leaderboards
- 📊 Advanced statistics and analytics
- 🎥 Match video/photo uploads
- 💰 Entry fee and payout tracking

### Bracket Enhancements
- 🔄 Double elimination brackets
- 🔁 Round robin format support
- 🎲 Swiss system tournaments
- 🏆 Stepladder finals format
- ⚖️ Handicap calculations
- 🎯 Best-of-3 match support

### Social Features
- 👤 Bowler profiles with photos
- 🏆 Achievement badges
- 📈 Personal statistics tracking
- 🤝 Friend system
- 💬 Comments on matches
- ⭐ Tournament ratings and reviews

### Integration
- 🔗 USBC integration
- 📱 Mobile app companion
- 🎮 Roblox bowling game integration
- 💳 Payment processing (Stripe/PayPal)
- 📺 Streaming integration (Twitch/YouTube)
- 🗓️ Google Calendar sync

### Administration
- 🔐 Multi-admin support
- 📊 Dashboard analytics
- 💾 Cloud backup options
- 🌐 Multi-language support
- 🎨 Custom branding/themes
- 📋 Tournament templates

## Support

For issues or questions:
- Check the browser console for error messages
- Ensure JavaScript is enabled
- Clear browser cache if experiencing issues
- Verify browser compatibility

## License

This project is open source and available for personal and commercial use.

---

**Built with ❤️ for Tournament Directors everywhere**
