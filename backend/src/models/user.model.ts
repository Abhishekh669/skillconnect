import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  userRole: {
    type: String,
    required  : true,
    enum: ['customer', 'employee', 'admin'],
    default: 'customer',
  },
  
 
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
    address: {
      type: String,
      required: true,
    }
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// ✅ Create 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

export const User = mongoose.models.User || mongoose.model('User', userSchema);