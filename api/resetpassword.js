
import { createClient } from "@supabase/supabase-js";

const supabaseUrl=process.env.SUPABASE_URL;
const secretKey=process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, secretKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
    }
    try {
        const { data, error } = await supabase.auth.updateUser({ password: password });
        if (error) {
            return res.status(400).json({success: false, error: error.message });
        }
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
