

const express = require("express");
const cors = require("cors");

require("dotenv").config();

const chatRouter = require("./routes/chatRouter");
const connectRouter = require("./routes/connectRouter");
const mappingRouter = require("./routes/mappingRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5175",
  credentials: true
}));

app.use(express.json());

app.use("/api/chat",chatRouter);
app.use("/api/connect", connectRouter);
app.use("/api/mapping", mappingRouter);







app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});