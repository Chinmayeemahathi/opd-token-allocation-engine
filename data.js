const slots = {
  S1: { slotId: "S1", doctorId: "D1", start: "09:00", end: "10:00", capacity: 3, tokens: [], waitlist: [] },
  S2: { slotId: "S2", doctorId: "D2", start: "10:00", end: "11:00", capacity: 2, tokens: [], waitlist: [] },
  S3: { slotId: "S3", doctorId: "D3", start: "11:00", end: "12:00", capacity: 4, tokens: [], waitlist: [] }
};

const PRIORITY_ORDER = {
  PRIORITY: 4,
  FOLLOWUP: 3,
  ONLINE: 2,
  WALKIN: 1
};

module.exports = { slots, PRIORITY_ORDER };

