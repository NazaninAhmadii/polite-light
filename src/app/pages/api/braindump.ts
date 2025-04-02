import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST') {
        const { user_id, content } = req.body

        const { data, error } = await supabase.from('braindump_dumps').insert({ user_id, content })
        if(error) res.status(500).json({ error: error.message })
        else res.status(200).json({ data })
    }
    res.status(405).json({ error: 'Method not allowed' })
}
