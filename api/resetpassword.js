
import { createClient } from "@supabase/supabase-js";

const supabaseUrl=process.env.SUPABASE_URL;
const secretKey=process.env.SUPABASE_API_KEY;

const supabaseAdmin = createClient(supabaseUrl, secretKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    const { access_token, new_password } = req.body;

    if (!access_token || !new_password) {
        return res.status(400).json({ error: 'Token and password are required' });
    }
    try {
        // Verify the token and get the user ID
    const { user, error: userError } = await supabase.auth.api.getUser(access_token);
    if (!user || userError) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    // Update user password as admin
    const { data, error } = await supabaseAdmin.auth.admin.updateUser(user.id, {
      password: new_password,
    });
        if (error) {
            return res.status(400).json({success: false, error: error.message });
        }
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
