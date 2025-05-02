import app from './app.js';
import connectDB from './db/indexdb.js';
import dotenv from 'dotenv';

dotenv.config(); // ✅ No path needed if .env is in root


const PORT = process.env.PORT || 3000;




connectDB()
.then(() => {
    console.log('DB connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    
})
.catch((error) => {
    console.log('Error in connecting DB', error);
});


