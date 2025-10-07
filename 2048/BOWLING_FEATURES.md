# Bowling-Specific Features

The Tournament Director platform is now fully optimized for bowling tournaments with bowling-specific formats, terminology, and tracking systems.

## 🎳 Bowling Tournament Formats

### **Available Formats:**

1. **Single Elimination (Stepladder)**
   - Traditional stepladder finals format
   - Higher seeds get byes
   - Loser is eliminated
   - Winner advances to next round

2. **Double Elimination**
   - Two brackets: Winners and Losers
   - Must lose twice to be eliminated
   - Second chance for bowlers

3. **Round Robin (Baker Format)**
   - Everyone bowls against everyone
   - Baker format team scoring
   - Total pinfall or match play points

4. **Match Play**
   - Head-to-head competition
   - Best of 3 or 5 games
   - Match play points system

5. **Scratch Tournament**
   - No handicap applied
   - Raw scores only
   - Pure skill competition

6. **Handicap Tournament**
   - Handicap-based scoring
   - Levels the playing field
   - Based on bowling averages

---

## 🎯 Bowling Average System

### **Replaces Generic Rating System**

**Old System:**
- Generic "rating" (0-3000)
- Not bowling-specific

**New Bowling System:**
- **Bowling Average** (0-300)
- Industry-standard measurement
- Used for seeding and handicap calculations

### **Skill Level Categories:**

| Skill Level | Average Range | Description |
|-------------|---------------|-------------|
| **Beginner** | 0-120 | New to bowling, learning basics |
| **Intermediate** | 121-180 | Developing skills, consistent |
| **Advanced** | 181-220 | Strong bowler, competitive |
| **Professional** | 221+ | Elite level, tournament ready |

---

## 📊 Bowling-Specific Data Fields

### **Bowler Profile:**
- **Name** - Full name
- **Email** - Contact email
- **Bowling Average** - 0-300 (optional)
- **Skill Level** - Beginner/Intermediate/Advanced/Professional
- **Discord Username** - For tournament communication
- **Roblox Username** - For in-game identification

### **Tournament Settings:**
- **Tournament Name**
- **Bowling Format** - Stepladder/Match Play/etc.
- **Start Date**
- **Registration Deadline**
- **Max Participants**
- **Description**

---

## 🏆 Auto-Seeding by Bowling Average

### **How It Works:**
1. Bowlers register with their bowling averages
2. Tournament director clicks "Auto-Seed"
3. System sorts bowlers by average (highest to lowest)
4. Bracket is generated with proper seeding
5. Higher averages get better seeds

### **Seeding Example:**
```
Seed 1: John (235 avg) vs Seed 8: Mike (150 avg)
Seed 4: Sarah (200 avg) vs Seed 5: Lisa (195 avg)
Seed 2: Tom (220 avg) vs Seed 7: Dave (165 avg)
Seed 3: Amy (210 avg) vs Seed 6: Chris (180 avg)
```

### **Benefits:**
- Fair competition
- Prevents early matchups of top bowlers
- Rewards higher averages with better positioning
- Creates competitive balance

---

## 🎳 Bracket Display

### **Shows Bowling-Specific Info:**
- Bowler names
- Bowling averages (e.g., "180 avg")
- Match winners highlighted in green
- Round labels (Round 1, Round 2, Finals)

### **Example Bracket Card:**
```
Match 1
┌─────────────────────────┐
│ John Smith    235 avg   │ ← Winner (green)
├─────────────────────────┤
│ Mike Jones    150 avg   │
└─────────────────────────┘
```

---

## 🎮 Gaming Platform Integration

### **Discord Integration:**
- Bowlers provide Discord username (e.g., "username#1234")
- Used for tournament communication
- Create Discord channels per tournament
- Send match notifications and updates

### **Roblox Integration:**
- Bowlers provide Roblox username
- Used for in-game bowling tournaments
- Identify players in Roblox bowling games
- Track scores from Roblox platform

---

## 📋 Participant Table

### **Displays:**
| Name | Email | Bowling Average | Skill Level | Actions |
|------|-------|-----------------|-------------|---------|
| John Smith | john@email.com | 235 | Professional | Delete |
| Sarah Lee | sarah@email.com | 180 | Intermediate | Delete |
| Mike Jones | mike@email.com | 150 | Beginner | Delete |

### **Features:**
- Search by name or email
- Sort by bowling average
- Filter by skill level
- Quick delete option

---

## 🎳 Bowler Self-Registration

### **Registration Form Includes:**
1. **Tournament** (auto-filled)
2. **Name** (auto-filled from account)
3. **Email** (auto-filled from account)
4. **Discord Username** (manual entry)
5. **Roblox Username** (manual entry)
6. **Bowling Average** (0-300, optional)
7. **Skill Level** (dropdown selection)

### **Validation:**
- Bowling average must be 0-300
- Skill level required
- Discord/Roblox usernames required
- Email format validated

---

## 📧 Email Notifications

### **Includes Bowling-Specific Details:**
```
Your Registration Details:
- Discord: ProBowler#1234
- Roblox: ProBowlerRBX
- Bowling Average: 235
- Skill Level: Professional
- Registered: [timestamp]
```

---

## 🏅 Tournament Formats Explained

### **Stepladder (Single Elimination):**
```
Round 1:    #4 vs #5 → Winner
Round 2:    #3 vs Winner → Winner
Round 3:    #2 vs Winner → Winner
Finals:     #1 vs Winner → Champion
```

### **Match Play:**
- Best of 3 or 5 games
- 1 point per game won
- Highest total points wins
- Tiebreaker: 9th/10th frame rolloff

### **Baker Format:**
- Team bowling format
- Each bowler bowls specific frames
- Bowler 1: Frames 1-2
- Bowler 2: Frames 3-4
- Bowler 3: Frames 5-6
- Bowler 4: Frames 7-8
- Bowler 5: Frames 9-10

### **Scratch vs Handicap:**
- **Scratch**: Raw scores, no adjustments
- **Handicap**: Based on average, levels playing field
  - Formula: (220 - Average) × 0.9
  - Example: 180 avg = (220-180) × 0.9 = 36 pins handicap

---

## 📊 Statistics & Tracking

### **Tournament Statistics:**
- Total bowlers registered
- Average bowling average of field
- Skill level distribution
- Registration timeline

### **Bowler Statistics:**
- Personal bowling average
- Tournaments participated
- Win/loss record
- Ranking by average

---

## 🎯 Use Cases

### **For Tournament Directors:**
1. Create scratch tournament for advanced bowlers
2. Set up handicap league for mixed skill levels
3. Organize stepladder finals for championship
4. Run match play qualifier rounds
5. Schedule Baker format team events

### **For Bowlers:**
1. Register with bowling average
2. Provide Discord for communication
3. Add Roblox name for online tournaments
4. View seeding based on average
5. Track tournament history

---

## 🔧 Technical Implementation

### **Data Structure Changes:**

**Participant Object (Old):**
```javascript
{
    id: number,
    name: string,
    email: string,
    skillLevel: string,
    rating: number  // Generic rating
}
```

**Bowler Object (New):**
```javascript
{
    id: number,
    name: string,
    email: string,
    bowlingAverage: number,  // 0-300
    skillLevel: string       // With avg ranges
}
```

**Registration Object:**
```javascript
{
    id: number,
    tournamentId: number,
    userId: number,
    name: string,
    email: string,
    discordName: string,
    robloxName: string,
    bowlingAverage: number,
    skillLevel: string,
    registeredAt: timestamp,
    status: string
}
```

---

## 🚀 Future Enhancements

### **Potential Additions:**
- **Handicap Calculator** - Automatic handicap calculation
- **Score Entry** - Live score tracking during matches
- **Lane Oil Patterns** - Track lane conditions
- **Equipment Tracking** - Ball and equipment database
- **USBC Integration** - Import USBC averages
- **Live Scoring API** - Real-time score updates
- **Video Replay** - Match video uploads
- **Statistics Dashboard** - Advanced bowling analytics

---

## 📝 Quick Reference

### **Bowling Average Ranges:**
- **300** - Perfect game
- **221-300** - Professional level
- **181-220** - Advanced bowler
- **121-180** - Intermediate bowler
- **0-120** - Beginner

### **Common Tournament Formats:**
- **Stepladder** - Best for finals (4-8 bowlers)
- **Match Play** - Best for qualifiers
- **Baker** - Best for team events
- **Scratch** - Best for skilled bowlers
- **Handicap** - Best for mixed leagues

### **Seeding Priority:**
1. Bowling average (primary)
2. Skill level (secondary)
3. Registration order (tiebreaker)

---

This bowling-specific system provides a complete solution for managing competitive bowling tournaments with industry-standard formats and measurements!
