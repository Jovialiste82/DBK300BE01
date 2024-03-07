// backend/middleware/roomMiddleware.js
export const checkRoomAccess = (req, res, next) => {
  const roomLabel = req.query.room; // Assuming the room is passed as a query parameter
  const user = req.user; // Assuming user information is attached to the request

  // Log for debugging purposes
  console.log("User DOB:", user.dob);
  console.log("Room parameter:", roomLabel);

  if (user.role === "admin") {
    console.log("Admin bypass");
    return next(); // Skip further checks for admin users
  }

  const isAccessAllowed = (birthdate, roomLabel) => {
    const dob = new Date(birthdate);

    if (isNaN(dob.getTime())) {
      console.log("Invalid birthdate:", birthdate);
      return false; // Birthdate is not valid
    }

    // Prepare the formats
    const year = dob.getFullYear().toString(); // "YYYY"
    const monthDay = dob.toISOString().slice(5, 10); // "MM-DD"
    const yearMonthDay = dob.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const expectedRoomLabels = [year, monthDay, yearMonthDay];

    console.log("Expected labels:", expectedRoomLabels);
    return expectedRoomLabels.some((label) => label === roomLabel);
  };

  if (!isAccessAllowed(user.dob, roomLabel)) {
    console.log("Access denied");
    return res.status(403).json({ message: "Access to this room is denied." });
  }

  console.log("Access granted");
  next();
};
