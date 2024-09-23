import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect('mongodb+srv://amitmandhana:a8013255265@cluster0.8uxojy5.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;
