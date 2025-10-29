import express from 'express';
import { authenticate } from '../middlewares/auth';
import { supabase } from '../services/supabase';

const router = express.Router();

router.get('/', async (req, res) => {
    const { search, city } = req.query;
    let query = supabase.from('restaurants').select('*');
    
    if (search) {query = query.ilike('name', `%${search}%`);}

    if (city) {query = query.eq('city', city);}

    query = query.order('average_rating', {ascending: false}).limit(20)

    const { data, error } = await query;
    if (error) return res.status(500).json({error});
    res.json(data);
});

router.post('/', authenticate, async (req, res) => {
    const { name, address, city, description } = req.body;
    const { data, error } = await supabase.from('restaurants').insert({ name, address, city, description }).select();
    if (error) return res.status(400).json({error});
    res.json(data[0]);
});

router.get('/:id', authenticate, async (req, res) => {
    const { data, error } = await supabase.from('restaurants').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error });
    res.json(data);
});

export default router;