import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.redirect("/home_page/index.html");
});

app.get("/bm", (req, res) => {
  res.redirect("/home_page/index.bm.html");
});

app.use(express.static("."));

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
