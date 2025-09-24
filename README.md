# Lazy Certificate

To get started clone the canva sdk starter kit

```bash
git clone git@github.com:canva-sdks/canva-apps-sdk-starter-kit.git
cd canva-apps-sdk-starter-kit
npm install
```
change ur .env file for ur app

paste the `app.tsx` file in your canva starter kit

- Upload your CSV data into `data/` and **Make sure it has a column with "Name"**
- Run the `convert-csv.js` file to convert your `data.csv` with Name into a json array with names (`namelist.json`)
- follow canva starter kit documentation, and run using `npm start` 
 
Start clicking the button and easily download certificates

*Note: Auto Download feature is blocked by canva because of security reasons, I am working to find a workaround*
*Note: I could integrate this into canva, the process however is tedious and has many requirements which I dont meet, so y'all gotta run this manually using the starter kit - apologies in advance*
