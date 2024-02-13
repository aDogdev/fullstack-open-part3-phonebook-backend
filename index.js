require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("dist"));

morgan.format(
  "custom",
  ":method :url :status :res[content-length] - :response-time ms :data"
);

morgan.token("data", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});

app.use(morgan("custom"));
app.use(express.json());

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${new Date()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) return res.status(400).json({ error: "name missing" });

  if (!body.number) return res.status(400).json({ error: "number missing" });

  // if (persons.find((person) => person.name === body.name))
  //   return res.status(400).json({ error: "name must be unique" });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
