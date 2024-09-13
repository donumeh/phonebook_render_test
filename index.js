const Phonebook = require("./models/phonebook.js");
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));


app.use(morgan( function (tokens, req, res) {
    console.log(
        [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body),

        ].join(' ')
    );
}));

const generateId = () => {
  let newId;

  while (true) {
    newId = Math.floor(Math.random() * (new Date().getTime() % 1000));

    const exist = persons.find(person => Number(person.id) === newId);

    if (!exist) { break; }
  }
  return String(newId);
};

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
})

app.get('/api/persons', (resquest, response, next) => {
  Phonebook.find({}).then(result => {
    response.json(result);
  }).catch(error => next(error))
});

app.get('/info', (request, response, next) => {

  Phonebook.find({})
    .then(result => {
      const personsLength = result.length;
      const phoneInfo = `<p>Phonebook has info for ${personsLength} people</p>`;
      const dayRequested = `<p>${new Date()}</p>`;
      response.send(`${phoneInfo}${dayRequested}`);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {

  Phonebook.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact);
      } else {
        response.statusMessage = 'contact not found';
        response.status(404).json({ error: 'contact not found' });
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {

  Phonebook.findByIdAndDelete(request.params.id)
    .then(contact => {
      if (contact) {
        response.statusMessage = "Successfully deleted";
        response.status(204).end();
      } else {
        response.statusMessage = 'contact not found';
        response.status(404).json({ error: 'contact not found' });
      }
    })
    .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.statusMessage = 'Name and Number must be present';
    response.status(404).json({ message: 'error: no name or number found' });
  } else {
    const newPerson = {
      name: body.name,
      number: body.number,
    };

    console.log(newPerson)

    Phonebook.findByIdAndUpdate(request.params.id, newPerson, {new: true})
      .then(result => {
        response.json(result);
      })
      .catch(error => next(error))
  }
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.statusMessage = 'Name and Number must be present';
    response.status(404).json({ message: 'error: no name or number found' });
  } else {
    const newPerson = new Phonebook({
      name: body.name,
      number: body.number,
    });
    newPerson.save().then(result => {
      response.json(result)
    }).catch(error => next(error))
  }
});



const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
}
app.use(unknownEndpoint);


const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
