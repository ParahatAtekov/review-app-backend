import express from 'express';
import { supabase } from '../services/supabase';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password});
    if (error) return res.status(400).json({ error: error.message });

    //Create a profile in the 'profiles' table
    await supabase.from('profiles').insert([{ id: data.user?.id, username }]);
    res.json({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    //Generate JWT
    const token = jwt.sign({ sub: data.user?.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

export default router;