# Score Entry & Tournament Editing Features

The Tournament Director platform now includes comprehensive score tracking and tournament editing capabilities.

## 🎯 Score Entry System

### **Features:**

1. **Match Score Entry**
   - Enter bowling scores for each match (0-300)
   - Automatic winner determination
   - Winner advances to next round automatically
   - Scores displayed on bracket cards

2. **Score Button on Brackets**
   - "Score" button appears on each match
   - Only shows when both players are assigned
   - Disappears after score is entered
   - Easy access from bracket view

3. **Score Display**
   - Scores shown in large bold numbers
   - Winner highlighted in green
   - Loser shown in gray
   - Score format: "235" (bowling score)

4. **Automatic Advancement**
   - Winner automatically moves to next round
   - Bracket updates in real-time
   - Next match populated with winner
   - Tournament progression tracked

---

## 📝 How to Enter Scores

### **Step-by-Step:**

1. **Navigate to Brackets**
   - Go to "Brackets" section
   - Select tournament from dropdown
   - View generated bracket

2. **Click Score Button**
   - Find match with both players assigned
   - Click blue "Score" button on match card
   - Score entry modal opens

3. **Enter Scores**
   - Enter Player 1 bowling score (0-300)
   - Enter Player 2 bowling score (0-300)
   - Click "Submit Score"

4. **Automatic Processing**
   - System determines winner (higher score)
   - Winner highlighted in green
   - Winner advances to next round
   - Scores saved and displayed

### **Example:**
```
Match 1 - Round 1
John Smith: 235
Mike Jones: 180

Result: John Smith wins (235-180)
John advances to Round 2
```

---

## ✏️ Tournament Editing

### **Features:**

1. **Edit Tournament Details**
   - Tournament name
   - Format/type
   - Start date
   - Registration deadline
   - Max participants
   - Tournament status
   - Description

2. **Edit Button**
   - Yellow edit button on tournament cards
   - Only visible to Admins and Directors
   - Opens edit modal with current values
   - Easy to update any field

3. **Status Management**
   - **Upcoming** - Tournament not started
   - **Ongoing** - Tournament in progress
   - **Completed** - Tournament finished

---

## 🔧 How to Edit Tournaments

### **Step-by-Step:**

1. **Find Tournament**
   - Navigate to "Tournaments" section
   - Locate tournament to edit

2. **Click Edit Button**
   - Click yellow edit icon (pencil)
   - Edit modal opens with current values

3. **Update Fields**
   - Modify any tournament details
   - Change format, dates, limits, etc.
   - Update status if needed

4. **Save Changes**
   - Click "Update Tournament"
   - Changes saved immediately
   - Tournament list refreshes

### **Editable Fields:**
- ✅ Tournament Name
- ✅ Tournament Format
- ✅ Start Date
- ✅ Registration Deadline
- ✅ Max Participants
- ✅ Status (Upcoming/Ongoing/Completed)
- ✅ Description

---

## 🏆 Score Tracking Features

### **Match Card Display:**

**Before Score Entry:**
```
┌─────────────────────────────┐
│ Match 1          [Score]    │
├─────────────────────────────┤
│ John Smith    235 avg       │
│ Mike Jones    180 avg       │
└─────────────────────────────┘
```

**After Score Entry:**
```
┌─────────────────────────────┐
│ Match 1                     │
├─────────────────────────────┤
│ John Smith    235 avg   235 │ ← Winner (green)
│ Mike Jones    180 avg   180 │
└─────────────────────────────┘
```

### **Score Validation:**
- ✅ Scores must be 0-300 (bowling range)
- ✅ No ties allowed (must have winner)
- ✅ Both scores required
- ✅ Winner automatically determined

---

## 📊 Bracket Progression

### **How Winners Advance:**

**Round 1:**
```
Match 1: John (235) vs Mike (180) → John wins
Match 2: Sarah (220) vs Lisa (195) → Sarah wins
```

**Round 2 (Auto-populated):**
```
Match 1: John vs Sarah → (awaiting score)
```

### **Advancement Logic:**
1. Score entered for match
2. Winner determined (higher score)
3. Winner ID saved to match
4. Next round match updated
5. Winner placed in correct position
6. Bracket refreshes automatically

---

## 🎮 Tournament Status Workflow

### **Status Progression:**

1. **Upcoming**
   - Tournament created
   - Accepting registrations
   - Bracket not started
   - No scores entered

2. **Ongoing**
   - Tournament started
   - Matches in progress
   - Scores being entered
   - Bracket advancing

3. **Completed**
   - All matches finished
   - Champion determined
   - Final scores recorded
   - Tournament archived

### **Status Change:**
- Edit tournament
- Update "Status" field
- Save changes
- Status badge updates on card

---

## 📈 Activity Tracking

### **Logged Activities:**
- ✅ Tournament updated
- ✅ Match score entered
- ✅ Winner advanced
- ✅ Tournament status changed

### **Activity Format:**
```
"Match completed: John Smith defeated Mike Jones (235-180)"
"Updated tournament: Summer Championship 2025"
```

---

## 🔐 Permissions

### **Score Entry:**
- **Admin** - ✅ Can enter scores
- **Tournament Director** - ✅ Can enter scores
- **Bowler** - ❌ Cannot enter scores

### **Tournament Editing:**
- **Admin** - ✅ Can edit all tournaments
- **Tournament Director** - ✅ Can edit all tournaments
- **Bowler** - ❌ Cannot edit tournaments

---

## 💡 Best Practices

### **For Score Entry:**
1. Enter scores immediately after match completion
2. Double-check scores before submitting
3. Verify correct winner advances
4. Update tournament status to "Ongoing" when starting

### **For Tournament Editing:**
1. Update status as tournament progresses
2. Adjust max participants if needed
3. Extend deadline if necessary
4. Keep description current

### **For Tournament Directors:**
1. Generate bracket before tournament starts
2. Enter scores in order (Round 1, then Round 2, etc.)
3. Mark tournament "Completed" when finished
4. Review activity log for accuracy

---

## 🚀 Advanced Features

### **Score Entry Modal:**
- Shows match details (Round, Match #)
- Displays player names
- Pre-validates score range (0-300)
- Prevents ties
- Confirms winner advancement

### **Edit Tournament Modal:**
- Pre-fills current values
- Validates all fields
- Saves to localStorage
- Updates all references
- Refreshes displays

### **Bracket Updates:**
- Real-time score display
- Automatic winner highlighting
- Progressive bracket filling
- Visual winner indication (green)

---

## 📋 Quick Reference

### **Score Entry Shortcuts:**
| Action | Method |
|--------|--------|
| Enter Score | Click "Score" button on match |
| View Scores | Check bracket display |
| Edit Score | Re-enter through score modal |
| Track Progress | View activity feed |

### **Tournament Edit Shortcuts:**
| Action | Method |
|--------|--------|
| Edit Tournament | Click yellow edit icon |
| Change Status | Edit → Update Status field |
| Update Deadline | Edit → Change deadline |
| Modify Format | Edit → Select new format |

---

## 🎯 Use Cases

### **Use Case 1: Running a Tournament**
1. Create tournament
2. Bowlers register
3. Generate bracket
4. Start tournament (status: Ongoing)
5. Enter scores as matches complete
6. Winners advance automatically
7. Continue until finals
8. Mark tournament Completed

### **Use Case 2: Editing Tournament Details**
1. Tournament created with wrong date
2. Click edit button
3. Update start date
4. Update registration deadline
5. Save changes
6. Tournament updated

### **Use Case 3: Score Entry**
1. Match completed: John 235, Mike 180
2. Click "Score" on match card
3. Enter John: 235, Mike: 180
4. Submit score
5. John wins, advances to next round
6. Bracket updates automatically

---

## 🔧 Technical Details

### **Score Data Structure:**
```javascript
match.score = {
    player1: 235,  // Bowling score
    player2: 180   // Bowling score
}
match.winner = player1Id  // Winner's ID
```

### **Tournament Update:**
```javascript
tournament.name = "Updated Name"
tournament.status = "ongoing"
tournament.maxParticipants = 32
// ... all fields updated
saveToLocalStorage()
```

### **Winner Advancement:**
```javascript
// Determine winner
if (score1 > score2) {
    match.winner = match.player1
} else {
    match.winner = match.player2
}

// Advance to next round
nextMatch.player1 = match.winner  // or player2
```

---

## 📝 Notes

- Scores are permanent once entered
- Winners automatically advance
- Ties are not allowed (bowling rule)
- Edit tournament anytime before completion
- Status changes affect tournament display
- All changes saved to localStorage
- Activity log tracks all actions

---

This score entry and editing system provides complete tournament management with real-time updates and automatic bracket progression!
