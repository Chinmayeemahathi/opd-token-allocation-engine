const { PRIORITY_ORDER } = require("./data");

function allocateToken(slot, token) {
  if (slot.tokens.length < slot.capacity) {
    slot.tokens.push(token);
    return "BOOKED";
  }

  // Find lowest priority patient in slot
  let lowest = slot.tokens.reduce((min, t) =>
    PRIORITY_ORDER[t.source] < PRIORITY_ORDER[min.source] ? t : min
  );

  if (PRIORITY_ORDER[token.source] > PRIORITY_ORDER[lowest.source]) {
    slot.tokens = slot.tokens.filter(t => t.tokenId !== lowest.tokenId);
    lowest.status = "WAITLISTED";
    slot.waitlist.push(lowest);

    slot.tokens.push(token);
    return "REPLACED";
  }

  token.status = "WAITLISTED";
  slot.waitlist.push(token);
  return "WAITLISTED";
}

function refillFromWaitlist(slot) {
  if (slot.waitlist.length === 0) return;

  let highest = slot.waitlist.reduce((max, t) =>
    PRIORITY_ORDER[t.source] > PRIORITY_ORDER[max.source] ? t : max
  );

  slot.waitlist = slot.waitlist.filter(t => t.tokenId !== highest.tokenId);
  highest.status = "BOOKED";
  slot.tokens.push(highest);
}

function cancelToken(slot, tokenId) {
  let token = slot.tokens.find(t => t.tokenId === tokenId);
  if (!token) return "NOT_FOUND";

  slot.tokens = slot.tokens.filter(t => t.tokenId !== tokenId);
  token.status = "CANCELLED";
  refillFromWaitlist(slot);
  return "CANCELLED";
}

function markNoShow(slot, tokenId) {
  let token = slot.tokens.find(t => t.tokenId === tokenId);
  if (!token) return "NOT_FOUND";

  slot.tokens = slot.tokens.filter(t => t.tokenId !== tokenId);
  token.status = "NOSHOW";
  refillFromWaitlist(slot);
  return "NOSHOW_MARKED";
}

function addEmergencyToken(slot, token) {
  if (slot.tokens.length < slot.capacity) {
    slot.tokens.push(token);
    return "BOOKED_EMERGENCY";
  }

  let lowest = slot.tokens.reduce((min, t) =>
    PRIORITY_ORDER[t.source] < PRIORITY_ORDER[min.source] ? t : min
  );

  slot.tokens = slot.tokens.filter(t => t.tokenId !== lowest.tokenId);
  lowest.status = "WAITLISTED";
  slot.waitlist.push(lowest);

  slot.tokens.push(token);
  return "EMERGENCY_REPLACED";
}

module.exports = { allocateToken, cancelToken, markNoShow , addEmergencyToken};
