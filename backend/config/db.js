const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sahayogeshwaran1:6ZhJ9etupj6fptdN@cluster1.fpl98.mongodb.net/muruganStore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Database connected'))
  .catch(err => console.log(err));
