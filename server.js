const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { slots } = require("./data");
const { allocateToken, cancelToken, markNoShow, addEmergencyToken } = require("./scheduler");

const app = express();
app.use(express.json());

/* ---------------- ROOT + HEALTH ---------------- */

app.get("/", (req, res) => {
  res.send("OPD Token Allocation Engine is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ---------------- GET ALL SLOTS ---------------- */

app.get("/slots", (req, res) => {
  res.json(slots);
});

/* ---------------- BOOK TOKEN ---------------- */

app.post("/tokens", (req, res) => {
  const { patientName, source, slotId } = req.body;

  if (!patientName || !source || !slotId) {
    return res.status(400).json({ error: "patientName, source, and slotId are required" });
  }

  const slot = slots[slotId];
  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const token = {
    tokenId: uuidv4(),
    patientName,
    source,
    status: "BOOKED"
  };

  const result = allocateToken(slot, token);
  res.json({ status: result, token, slot });
});

/* ---------------- CANCEL TOKEN ---------------- */

app.put("/tokens/:slotId/:tokenId/cancel", (req, res) => {
  const { slotId, tokenId } = req.params;
  const slot = slots[slotId];

  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const result = cancelToken(slot, tokenId);
  res.json({ status: result, slot });
});

/* ---------------- MARK NO-SHOW ---------------- */

app.put("/tokens/:slotId/:tokenId/noshow", (req, res) => {
  const { slotId, tokenId } = req.params;
  const slot = slots[slotId];

  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const result = markNoShow(slot, tokenId);
  res.json({ status: result, slot });
});

/* ---------------- EMERGENCY TOKEN ---------------- */

app.post("/tokens/emergency", (req, res) => {
  const { patientName, slotId } = req.body;

  if (!patientName || !slotId) {
    return res.status(400).json({ error: "patientName and slotId are required" });
  }

  const slot = slots[slotId];
  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const token = {
    tokenId: uuidv4(),
    patientName,
    source: "PRIORITY",
    status: "BOOKED"
  };

  const result = addEmergencyToken(slot, token);
  res.json({ status: result, token, slot });
});

/* ---------------- START SERVER ---------------- */

app.listen(3000, () => console.log("Server running on port 3000"));
