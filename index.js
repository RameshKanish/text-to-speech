const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const gTTS = require('gtts');

const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
];

app.get('/', (req, res) => {
  res.render('index', { supportedLanguages });
});

app.post('/', (req, res) => {
  const { text, language } = req.body;
  
  const selectedLanguage = supportedLanguages.find(lang => lang.code === language);
  if (!selectedLanguage) {
    return res.status(400).send('Invalid language selection');
  }
  
  const gtts = new gTTS(text, selectedLanguage.code);
  gtts.save('Voice.mp3', function (err, result) {
    if (err) {
      return res.status(500).send('Error converting text to speech');
    }
    res.download('Voice.mp3');
  });
});
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
