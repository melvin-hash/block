import mongoose from "mongoose"
const localUrl = "mongodb://0.0.0.0:27017/Melasi-stores"
const onlineUrl= "mongodb+srv://emmanulmelv:0n4DIP5zo5tLVmn3@cluster0.r6gtk6f.mongodb.net/"

const db=mongoose.connect(onlineUrl).then(() => {
    console.log("A connection has been made")
}).catch((error:any) => {
    console.log(error,"there was an error in database connection")
})

export default db
