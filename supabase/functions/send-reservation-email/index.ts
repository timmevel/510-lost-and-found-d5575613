import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { itemDescription, reservedByName, reservedByEmail } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Objets Trouvés <onboarding@resend.dev>',
        to: ['contact@510.training'],
        subject: 'Nouvelle réservation d\'objet',
        html: `
          <h2>Nouvelle réservation</h2>
          <p>L'objet "${itemDescription}" a été réservé.</p>
          <p>Détails de la réservation:</p>
          <ul>
            <li>Nom: ${reservedByName}</li>
            <li>Email: ${reservedByEmail}</li>
          </ul>
        `,
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})