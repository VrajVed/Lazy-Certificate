// idk why I used common js but ES modules were giving me issues

const fs = require("fs");

const data = fs.readFileSync("names.csv", "utf8").trim().split("\n");

// Split the header row into column names
const headers = data[0].split(",");

// Find the index of the "Name" column
const nameIndex = headers.indexOf("Name");

if (nameIndex === -1) {
  throw new Error("No 'Name' column found in CSV");
}

// Extract names from each row using the dynamic index
const names = data.slice(1).map(row => {
  const values = row.split(",");
  return values[nameIndex];
});

// Write the array into a JSON file
fs.writeFileSync("namelist.json", JSON.stringify(names, null, 2));

console.log("✅ namelist.json file created!");
