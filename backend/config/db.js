
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/4am-student-platform');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('MongoDB connection failed. Please ensure MongoDB is running or check your MONGO_URI.');
    process.exit(1);
  }
};

export default connectDB;
