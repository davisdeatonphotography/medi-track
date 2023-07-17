const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const BCRYPT_HASH_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
},
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value"
    },
    min: [0, 'Age must be positive number'],
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], 
    message: "{VALUE} is not a valid gender"
  },
  heightFeet: {
    type: Number,
    validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value"
    },
    min: [1, 'Height (feet) must be positive number'],
    max: 8
  },
  heightInches: {
      type: Number,
      validate: {
          validator: Number.isInteger,
          message: "{VALUE} is not an integer value"
      },
      min: [0, 'Height (inches) must be between 0 and 11'],
      max: 11
  },
    weight: {
      type: Number,
      min: [1, 'weight must be positive number'],
      max: 500
    }
  });

UserSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(BCRYPT_HASH_ROUNDS);
    user.password = await bcrypt.hash(user.password, salt);
  }



  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); 
  } catch (err) {
    throw new Error(`Error comparing passwords: ${err}`);
  }
}

module.exports = mongoose.model('User', UserSchema);
