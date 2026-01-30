const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { slots } = require("./data");
const { allocateToken, cancelToken, markNoShow, addEmergencyToken } =require("./scheduler");

const app = express();
app.use(express.json());

app.post("/tokens", (req, res) => {
  const { patientName, source, slotId } = req.body;
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

app.put("/tokens/:slotId/:tokenId/cancel", (req, res) => {
  const { slotId, tokenId } = req.params;
  const slot = slots[slotId];

  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const result = cancelToken(slot, tokenId);
  res.json({ status: result, slot });
});

app.get("/slots/:slotId", (req, res) => {
  const slot = slots[req.params.slotId];
  if (!slot) return res.status(404).json({ error: "Slot not found" });

  res.json(slot);
});

app.put("/tokens/:slotId/:tokenId/noshow", (req, res) => {
  const { slotId, tokenId } = req.params;
  const slot = slots[slotId];
  if (!slot) return res.status(404).json({ error: "Slot not found" });

  const result = markNoShow(slot, tokenId);
  res.json({ status: result, slot });
});

app.post("/tokens/emergency", (req, res) => {
  const { patientName, slotId } = req.body;
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

app.listen(3000, () => console.log("Server running on port 3000"));
