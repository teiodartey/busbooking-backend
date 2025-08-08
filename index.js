// index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simulated in-memory bookings
let bookings = [];
app.get("/", (req, res) => {
  res.send("Node.js backend is running!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
// ✅ POST to book a seat
app.post("/api/bookings/book", (req, res) => {
  
  const { email, seatNumber, destination, busNumber, date } = req.body;

  if (!email || !seatNumber || !destination || !busNumber || !date) {
    return res.status(400).json({ message: "Missing booking info." });
  }

  const alreadyBooked = bookings.some(
    (b) =>
      b.destination === destination &&
      b.date === date &&
      b.seatNumber === seatNumber &&
      b.busNumber === busNumber
  );

  if (alreadyBooked) {
    return res.status(400).json({ message: "Seat already booked." });
  }

  const newBooking = { email, seatNumber, destination, busNumber, date };
  bookings.push(newBooking);
  console.log("✅ Booking added:", newBooking);

  res.status(200).json({ message: "Seat booked successfully." });
});

// ✅ GET booked seats by destination and date
app.get("/api/bookings/booked", (req, res) => {
  const { destination, date } = req.query;

  if (!destination || !date) {
    return res.status(400).json({ message: "Missing destination or date." });
  }

  const filtered = bookings.filter(
    (b) => b.destination === destination && b.date === date
  );

  res.status(200).json(filtered);
});

app.get("/", (req, res) => {
   res.send("Backend is running ✅");
 });


// ✅ Admin route to get all bookings
app.get("/api/bookings/full", (req, res) => {
  res.status(200).json(bookings);
});

// ✅ DELETE: Cancel a booking
app.delete("/api/bookings/cancel", (req, res) => {
  const { email, seatNumber, destination, busNumber, date } = req.body;

  if (!email || !seatNumber || !destination || !busNumber || !date) {
    return res.status(400).json({ message: "Missing booking info." });
  }

  const index = bookings.findIndex(
    (b) =>
      b.email === email &&
      b.seatNumber === seatNumber &&
      b.destination === destination &&
      b.busNumber === busNumber &&
      b.date === date
  );

  if (index === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  bookings.splice(index, 1);
  console.log("❌ Booking deleted:", { email, seatNumber, destination, busNumber, date });
  res.status(200).json({ message: "Booking canceled successfully." });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
