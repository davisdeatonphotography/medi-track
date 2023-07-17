const dotenv = require('dotenv');
dotenv.config();
const { fetchMedicationInfo } = require('./js/medicationInfoFetcher');
const axios = require('axios');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Medication = require('./models/Medication');
const mongoose = require('mongoose');

const app = express();

app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/api/medications', async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/user/personal-info', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting personal information');
  }
});

app.put('/user/personal-info', async (req, res) => {
  try {
    const { name, age, gender, feet, inches, weight } = req.body;
    const height = feet * 12 + inches;  // Convert height to inches
    const user = await User.findByIdAndUpdate(req.user.id, { name, age, gender, height, weight }, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating personal information');
  }
});
// Add this route to handle the profile update form
app.put('/update-profile', async (req, res) => {
  try {
    const { name, age, gender, feet, inches, weight } = req.body;
    const height = feet * 12 + inches;  // Convert height to inches
    const user = await User.findByIdAndUpdate(req.user.id, { name, age, gender, height, weight }, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});
const unzipper = require('unzipper');

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const filePath = file.path;
    const targetPath = 'unzipped/';

    fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: targetPath }))
        .on('finish', () => {
            console.log('Unzipped successfully.');
            res.sendStatus(200);
        });
});

// Medication CRUD operations
app.post('/medications', async (req, res) => {
  try {
    const { name, dosage, frequency } = req.body;
    const timesOfIntake = [];
    for (let i = 0; i < frequency; i++) {
      timesOfIntake.push(req.body['timeOfIntake' + i]);
    }
    const medication = new Medication({
      name,
      dosage,
      frequency,
      timesOfIntake
    });
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating medication');
  }
});

app.get('/medications', async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving medications');
  }
});

app.put('/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, frequency, timeOfIntake } = req.body;
    const medication = await Medication.findByIdAndUpdate(id, {
      name,
      dosage,
      frequency,
      timeOfIntake
    }, { new: true });
    res.status(200).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating medication');
  }
});

app.delete('/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Medication.findByIdAndDelete(id);
    res.status(200).json({ message: 'Medication deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting medication');
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }

    const newUser = new User({ username, password, name: username });
    await newUser.save();

    // Automatically log in the new user
    req.login(newUser, function(err) {
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.status(201).json({ message: 'no api key' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error signing up user');
  }
});
app.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(`Authentication failed: ${err}`);
      return next(err);
    }
    if (!user) {
      console.error(`User not found: ${info.message}`);
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(`Login failed: ${err}`);
        return next(err);
      }
      // Check if the user has an API key
      if (user.apiKey) {
        res.status(200).json({ user: req.user });
      } else {
        return res.status(200).json({ message: 'no api key' });
      }
    });
  })(req, res, next);
});
app.get('/user', async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  const user = await User.findById(req.user._id);
  res.status(200).json({ user: { username: req.user.username, name: user.name } });
});


// In the /store-api-key route
app.post('/store-api-key', async (req, res) => {
  const { apiKey } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }


  try {
    const response = await axios.get('https://api.openai.com/v1/engines', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.status !== 200) {
      return res.status(400).json({ message: 'Invalid API key' });
    }

    await User.updateOne({ _id: req.user._id }, { apiKey });

    const user = await User.findById(req.user._id);
    res.status(200).json({ user, message: 'API key stored' });
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
      return res.status(400).json({ message: 'Invalid API key' });
    }
    res.status(500).json({ message: 'Error storing API key' });
  }
});
  



app.post('/fetch-medication-info', async (req, res) => {
  if (!req.user || !req.user.apiKey) {
    return res.status(401).send('Unauthorized');
  }

  const { medicationName } = req.body;

  try {
    const systemMessage = `Generate a JSON-like structure providing detailed information about the medication "${medicationName}" including "drugName", "dosageInstructions", "sideEffects", "drugInteractions", "precautions", "withdrawalTimeline", "howLongToWork", and "durationOfUse".`;
    const info = await fetchMedicationInfo(systemMessage, req.user.apiKey);
    const healthDataFilePath = 'path-to-user-health-data';
    const response = await axios.post('http://localhost:5000/analyze', {
      file_path: healthDataFilePath,
      medication_input: JSON.stringify(info)
    });
    const dataObject = response.data;
    res.status(200).json(dataObject);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching medication info');
  }
});

app.get('/medications/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const medication = await Medication.findOne({ name });
    if (!medication) {
      res.status(404).send('Medication not found');
    } else {
      res.status(200).json(medication);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving medication');
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
