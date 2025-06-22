import mongoose  from "mongoose"

export const connectDB = async() =>{
    mongoose.set("strictQuery", true)
    if(!process.env.MONGO_URI) return console.log("MONGO_URL not found");
try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("successfully connected  to mongodb ")
    
    
} catch (error: any) {
    console.log("Failed to connect MongoDB :: ",error.message)
    
}
}