import express from 'express';
import { authenticate } from '../middlewares/auth';
import { supabase } from '../services/supabase';

const router = express.Router();

router.get('/:restaurantId', async (req, res) => {
    const { data, error } = await supabase.from('reviews').select('*, profiles(username)').eq('restaurantId', req.params.restaurantId).order('created_at', { ascending: false }).limit(50);
    if (error) return res.status(500).json({error});
    res.json(data);
});

router.post('/', authenticate, async (req, res) => {
    const { restaurantId, rating, comment } = req.body;
    const user_id = (req.user as {id: string}).id;
    const { data, error } = await supabase.from('reviews').insert({ user_id, restaurantId, rating, comment }).select();
    if (error) return res.status(400).json({error});
    res.json(data[0]);
});

export default router;