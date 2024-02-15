require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

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
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>
       <p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
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

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
