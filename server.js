// backend/index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simulated SQL database for booked seats
let bookings = [];

// Endpoint to book a seat
app.post("/api/bookings/book", (req, res) => {
  const { destination, date, seatNumber, busId, email } = req.body;
  if (!destination || !date || !seatNumber || !busId || !email) {
    return res.status(400).json({ message: "Missing booking info." });
  }
  const alreadyBooked = bookings.some(
    (b) =>
      b.destination === destination &&
      b.date === date &&
      b.seatNumber === seatNumber &&
      b.busId === busId
  );
  if (alreadyBooked) {
    return res.status(400).json({ message: "Seat already booked." });
  }
  bookings.push({ destination, date, seatNumber, busId, email });
  res.status(200).json({ message: "Seat booked successfully." });
});

// Endpoint to get booked seats
app.get("/api/bookings/booked", (req, res) => {
  const { destination, date } = req.query;
  if (!destination || !date) {
    return res.status(400).json({ message: "Missing destination or date." });
  }
  const filtered = bookings.filter(
    (b) => b.destination === destination && b.date === date
  );
  res.json(filtered);
});

// Endpoint to get all bookings (admin)
app.get("/api/bookings/full", (req, res) => {
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
