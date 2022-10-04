const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
    res.status(200);
});

app.listen(3001, () => {
    console.log("Server listening in p:3001");
})