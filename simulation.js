const { slots } = require("./data");
const { allocateToken, cancelToken, markNoShow, addEmergencyToken } = require("./scheduler");
const { v4: uuidv4 } = require("uuid");

function createToken(name, source) {
  return { tokenId: uuidv4(), patientName: name, source, status: "BOOKED" };
}

function simulate() {
  console.log("Starting OPD Simulation...\n");

  // ---------------- D1 (S1) ----------------
  console.log("Doctor D1 - Slot S1 Bookings");
  allocateToken(slots.S1, createToken("Ravi", "ONLINE"));
  allocateToken(slots.S1, createToken("Asha", "WALKIN"));
  allocateToken(slots.S1, createToken("Meena", "FOLLOWUP"));
  allocateToken(slots.S1, createToken("VIP1", "PRIORITY"));

  let cancelId = slots.S1.tokens[1].tokenId;
  cancelToken(slots.S1, cancelId);

  let noShowId = slots.S1.tokens[0].tokenId;
  markNoShow(slots.S1, noShowId);

  addEmergencyToken(slots.S1, createToken("EmergencyCase", "PRIORITY"));

  // ---------------- D2 (S2) ----------------
  console.log("\nDoctor D2 - Slot S2 Bookings");
  allocateToken(slots.S2, createToken("PatientA", "ONLINE"));
  allocateToken(slots.S2, createToken("PatientB", "WALKIN"));
  allocateToken(slots.S2, createToken("PatientC", "FOLLOWUP")); // should waitlist if full

  let noShowD2 = slots.S2.tokens[0].tokenId;
  markNoShow(slots.S2, noShowD2);

  // ---------------- D3 (S3) ----------------
  console.log("\nDoctor D3 - Slot S3 Bookings");
  allocateToken(slots.S3, createToken("John", "ONLINE"));
  allocateToken(slots.S3, createToken("Priya", "FOLLOWUP"));
  allocateToken(slots.S3, createToken("WalkIn1", "WALKIN"));
  allocateToken(slots.S3, createToken("VIP2", "PRIORITY"));

  let cancelD3 = slots.S3.tokens[2].tokenId;
  cancelToken(slots.S3, cancelD3);

  addEmergencyToken(slots.S3, createToken("EmergencyD3", "PRIORITY"));

  // ---------------- FINAL STATUS ----------------
  console.log("\nFinal Slot Statuses:");
  console.log("S1:", JSON.stringify(slots.S1, null, 2));
  console.log("S2:", JSON.stringify(slots.S2, null, 2));
  console.log("S3:", JSON.stringify(slots.S3, null, 2));
}

simulate();
