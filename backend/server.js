const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Change this to your desired download folder
const DOWNLOAD_FOLDER = "./downloads";

// Create folder if it doesn't exist
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

app.post("/download", async (req, res) => {
    const { url, name } = req.body;
    if (!url) return res.status(400).send("Missing URL");
    if (!name) return res.status(400).send("Missing name");

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const buffer = await response.arrayBuffer();
        const filename = path.join(DOWNLOAD_FOLDER, `${name}.png`);

        fs.writeFileSync(filename, Buffer.from(buffer));
        console.log("✅ File saved as", filename);

        res.json({ success: true, filename });
    } catch (err) {
        console.error("❌ Download failed:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000/download"));

