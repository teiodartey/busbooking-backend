const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

// ✅ POST: Book a seat
router.post("/book", async (req, res) => {
  const { seatNumber, destination, travelDate, busId, email } = req.body;

  if (!seatNumber || !destination || !travelDate || !busId || !email) {
    return res.status(400).json({ message: "Missing fields." });
  }

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("seatNumber", sql.VarChar, seatNumber)
      .input("destination", sql.VarChar, destination)
      .input("travelDate", sql.Date, travelDate)
      .input("busId", sql.VarChar, busId)
      .query(`
        SELECT * FROM bookings
        WHERE seatNumber = @seatNumber AND destination = @destination
        AND travelDate = @travelDate AND busId = @busId
      `);

    if (result.recordset.length > 0) {
      return res.status(409).json({ message: "Seat already booked." });
    }

    await pool
      .request()
      .input("seatNumber", sql.VarChar, seatNumber)
      .input("destination", sql.VarChar, destination)
      .input("travelDate", sql.Date, travelDate)
      .input("busId", sql.VarChar, busId)
      .input("email", sql.VarChar, email)
      .input("isBooked", sql.Bit, true)
      .query(`
        INSERT INTO bookings (seatNumber, destination, travelDate, busId, email, isBooked)
        VALUES (@seatNumber, @destination, @travelDate, @busId, @email, @isBooked)
      `);

    res.status(200).json({ message: "Seat booked successfully." });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ✅ GET: Fetch booked seats for a destination and date
router.get("/booked", async (req, res) => {
  const { destination, travelDate } = req.query;

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("destination", sql.VarChar, destination)
      .input("travelDate", sql.Date, travelDate)
      .query(`
        SELECT seatNumber, busId FROM bookings
        WHERE destination = @destination AND travelDate = @travelDate AND isBooked = 1
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Fetch booked seats error:", err);
    res.status(500).json({ message: "Error fetching booked seats." });
  }
});

module.exports = router;
