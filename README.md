🏥 OPD Token Allocation Engine

A REST-based system to manage OPD patient tokens across doctor time slots with dynamic prioritization, capacity control, and real-world adjustments like cancellations, no-shows, and emergency insertions.

📌 Problem Statement

Hospitals manage OPD patients through time-based slots where each doctor can see only a limited number of patients. Patients arrive from multiple sources (online, walk-in, priority, follow-up), and real-life disruptions like cancellations or emergencies must be handled dynamically.

This system implements an elastic token allocation engine to solve this problem efficiently.

🧠 Core Features
✅ Per-Slot Capacity Enforcement

Each doctor’s time slot has a fixed capacity. No more patients than the allowed capacity can be actively booked.

✅ Priority-Based Allocation

Patients are prioritized as:

Source	Priority
PRIORITY (Paid)	4
FOLLOWUP	3
ONLINE	2
WALKIN	1

Higher-priority patients can replace lower-priority ones when slots are full.

✅ Dynamic Reallocation

The system automatically adjusts bookings when:

A patient cancels

A patient is marked as no-show

An emergency patient is inserted

Freed slots are filled from a priority-based waitlist.

🏗️ System Architecture
Client → REST API (Express) → Allocation Engine → Slot Data Store

Modules
File	Responsibility
server.js	REST API endpoints
scheduler.js	Token allocation & reallocation logic
data.js	In-memory slot and priority data
simulation.js	One-day OPD simulation
📦 Data Model
Slot
{
  "slotId": "S1",
  "doctorId": "D1",
  "start": "09:00",
  "end": "10:00",
  "capacity": 3,
  "tokens": [],
  "waitlist": []
}

Token
{
  "tokenId": "uuid",
  "patientName": "Ravi",
  "source": "ONLINE",
  "status": "BOOKED"
}

🌐 API Endpoints

Base URL:

http://localhost:3000

Action	Method	Endpoint
Book token	POST	/tokens
Cancel token	PUT	/tokens/:slotId/:tokenId/cancel
Mark no-show	PUT	/tokens/:slotId/:tokenId/noshow
Add emergency patient	POST	/tokens/emergency
View slot status	GET	/slots/:slotId
⚙️ Allocation Algorithm (Simplified)

If slot capacity not reached → Book token

If full:

Compare priorities

Replace lowest priority if new patient is higher priority

Otherwise → Add to waitlist

On cancellation/no-show → Pull highest priority from waitlist

Emergency → Always inserted, may replace lowest priority

⚠️ Edge Cases Handled

Slot full with lower-priority patients

Multiple cancellations

No-shows freeing capacity

Emergency patients overriding existing bookings

Invalid slot or token IDs

🛠️ Failure Handling
Case	Response
Invalid slot	404 Not Found
Token not found	NOT_FOUND
Slot full	WAITLISTED or REPLACED
🧪 OPD Day Simulation

Run:

node simulation.js


Simulation includes:

3 doctors (S1, S2, S3)

Online, walk-in, follow-up, and priority patients

Cancellations

No-shows

Emergency insertion

Waitlist movement

🎯 Design Trade-offs
Decision	Reason
In-memory storage	Simplicity for assignment
Priority replacement model	Realistic OPD triage
REST APIs	Easy integration with frontend systems
🚀 How to Run
npm install
node server.js


Server runs on:

http://localhost:3000

✅ Assignment Coverage

✔ Slot capacity enforcement
✔ Dynamic token reallocation
✔ Multi-source prioritization
✔ Cancellations, no-shows, emergency handling
✔ REST API implementation
✔ Documentation
✔ Simulation of OPD day with 3 doctors