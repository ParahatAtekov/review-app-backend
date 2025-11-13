import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import restaurantRoutes from './routes/restaurants';
import reviewRoutes from './routes/reviews';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes); // ← No authenticate here
app.use('/api/reviews', reviewRoutes); // ← No authenticate here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));