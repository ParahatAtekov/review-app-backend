import express from 'express';
import { authenticate } from '../middlewares/auth';
import { supabase } from '../services/supabase';

const router = express.Router();

// backend/src/routes/reviews.ts
router.get('/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  console.log('Fetching reviews for restaurant ID:', restaurantId);

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(username)')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error in GET /reviews:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data || []);
});

router.post('/', authenticate, async (req, res) => {
    const { restaurantId, rating, comment } = req.body;
    const user_id = (req.user as {id: string}).id;
    const { data, error } = await supabase.from('reviews').insert({ user_id, restaurantId, rating, comment }).select();
    if (error) return res.status(400).json({error});
    res.json(data[0]);
});

export default router;