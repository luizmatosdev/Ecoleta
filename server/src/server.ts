import express from "express"

const app = express()

app.get("/user", (req, res) => {
  return res.json({ ok: true })
})
app.get("", (req, res) => {
  return res.json({ inicio: true })
})

app.listen(3333)
