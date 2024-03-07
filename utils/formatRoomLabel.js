export const formatRoomLabel = (roomLabel) => {
  const months = {
    JANUARY: "01",
    FEBRUARY: "02",
    MARCH: "03",
    APRIL: "04",
    MAY: "05",
    JUNE: "06",
    JULY: "07",
    AUGUST: "08",
    SEPTEMBER: "09",
    OCTOBER: "10",
    NOVEMBER: "11",
    DECEMBER: "12",
  };

  // Check if the roomLabel is just a year e.g., "1982"
  if (/^\d{4}$/.test(roomLabel)) {
    return roomLabel;
  }

  // Check if the roomLabel is in the format "MONTH DAY"
  if (/^[A-Z]+\s\d{1,2}$/.test(roomLabel)) {
    const [month, day] = roomLabel.split(" ");
    return `${month.charAt(0) + month.slice(1).toLowerCase()} ${day.padStart(
      2,
      "0"
    )}`;
  }

  // Check if the roomLabel is in the format "DAY MONTH YEAR"
  if (/^\d{1,2}\s[A-Z]+\s\d{4}$/.test(roomLabel)) {
    const [day, month, year] = roomLabel.split(" ");
    const monthNumber = months[month];
    return `${year}-${monthNumber}-${day.padStart(2, "0")}`;
  }

  // If the format does not match any of the above, return the original roomLabel
  return roomLabel;
};

// Test the function
//   const testLabels = ["1982", "FEBRUARY 27", "27 FEBRUARY 1982"];
//   const formattedLabels = testLabels.map(label => formatRoomLabel(label));
//   console.log(formattedLabels);
