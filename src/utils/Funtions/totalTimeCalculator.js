function getTotalTimeString(
  registrationDate,
  firstCall,
  vital,
  assignDepartment,
  secondCall,
  beginTime,
  endTime
) {
  // Convert all non-null values to Date objects
  const convertToDate = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    return date instanceof Date && !isNaN(date) ? date : null;
  };

  // Create an array of labeled dates for tracking the sequence
  const dateSequence = [
    { label: "registration", date: convertToDate(registrationDate) },
    { label: "firstCall", date: convertToDate(firstCall) },
    { label: "vital", date: convertToDate(vital) },
    { label: "assignDepartment", date: convertToDate(assignDepartment) },
    { label: "secondCall", date: convertToDate(secondCall) },
    { label: "beginTime", date: convertToDate(beginTime) },
    { label: "endTime", date: convertToDate(endTime) },
  ].filter((item) => item.date !== null);

  // If no valid dates, return default
  if (dateSequence.length === 0) {
    return "0 hrs 0 min 0 sec";
  }

  // If only one date is present, use current time as end time if it's not endTime
  // or use the time since registration if it's the only field
  if (dateSequence.length === 1) {
    const singleEntry = dateSequence[0];
    let startDate, endDate;

    if (singleEntry.label === "registration") {
      startDate = singleEntry.date;
      endDate = new Date(); // Current time
    } else {
      // For any other single field, calculate from registration or use reasonable default
      startDate = convertToDate(registrationDate) || singleEntry.date;
      endDate = singleEntry.date;
    }

    const diffMs = endDate - startDate;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours} hrs ${minutes} min ${seconds} sec`;
  }

  // For multiple dates, find earliest and latest
  const minDate = new Date(
    Math.min(...dateSequence.map((item) => item.date.getTime()))
  );
  const maxDate = new Date(
    Math.max(...dateSequence.map((item) => item.date.getTime()))
  );

  // Calculate time difference in milliseconds
  const diffMs = maxDate - minDate;

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours} hrs ${minutes} min ${seconds} sec`;
}

export default getTotalTimeString;
