import express from 'express';
import { supabase } from '../services/supabase';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('Entering GET /restaurants - Query params:', req.query); // Debug log
  const { search, city } = req.query;
  let query = supabase.from('restaurants').select('*');
  if (search) query = query.ilike('name', `%${search}%`);
  if (city) query = query.eq('city', city);
  query = query.order('average_rating', { ascending: false }).limit(20);

  const { data, error } = await query;
  if (error) {
    console.error('Supabase error in GET /restaurants:', error); // Log Supabase error
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

router.post('/', authenticate, async (req, res) => {
  const { name, address, city, description } = req.body;
  const { data, error } = await supabase.from('restaurants').insert({ name, address, city, description }).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

// backend/src/routes/restaurants.ts
router.get('/:id', async (req, res) => {
  console.log('Entering GET /restaurants/:id - ID:', req.params.id);

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle(); // ← Use maybeSingle() instead of .single()

  if (error) {
    console.error('Supabase error in GET /restaurants/:id:', error);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.json(data);
});

export default router;