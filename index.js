
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

const generateId = () => {
  let newId;

  while (true) {
    newId = Math.floor(Math.random() * (new Date().getTime() % 1000));

    const exist = persons.find(person => Number(person.id) === newId);

    if (!exist) { break; }
  }
  return String(newId);
};

app.get('/api/persons', (resquest, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const phoneInfo = `<p>Phonebook has info for ${persons.length} people</p>`;
  const dayRequested = `<p>${new Date()}</p>`;

  response.send(`${phoneInfo}${dayRequested}`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(contact => contact.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = 'contact not found';
    response.status(404).json({ error: 'contact not found' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  persons = persons.filter(person => person.id !== id);

  response.json(persons);
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const findName = persons.find((person) => person.name === body.name);

  if (findName) {
    response.statusMessage = 'Name must be unique';
    response.status(404).json({ error: 'name must be unique' });
  } else if (!body.name || !body.number) {
    response.statusMessage = 'Name and Number must be present';
    response.status(404).json({ message: 'error: no name or number found' });
  } else {
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId()
    };

    persons = persons.concat(newPerson);
    response.json(persons);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
}
app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
