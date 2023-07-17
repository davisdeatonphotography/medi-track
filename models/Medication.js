const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return v.trim().length > 0;
      },
      message: "Medication name cannot be empty"
    },
  },
  dosage: {
    type: Number,
    required: true,
    min: [0.1, 'Dosage must be a positive number'],
  },
  frequency: {
    type: String,
    required: true,
    enum : ['daily','weekly','monthly','yearly'],
    message: "Frequency can be either daily, weekly, monthly or yearly"
  },
  intakeTimes: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => {
        return v.every((time) => time.trim() !== '');
      },
      message: "Each intake time cannot be empty"
    },
  },
  // Detailed drug name - can be generic or brand name
  drugName: String,
  // Concise instructions about dosage intake
  dosageInstructions: String,
  // Side effects caused by the drug
  sideEffects: String,
  // Possible interactions with other drugs
  drugInteractions: String,
  // Any precautions that need to be taken
  precautions: String,
  // Timeline of drug withdrawal symptoms
  withdrawalTimeline: String,
  // Time taken for the drug to start showing effects
  howLongToWork: String,
  // Recommended duration of drug use
  durationOfUse: String
});

module.exports = mongoose.model('Medication', MedicationSchema);
