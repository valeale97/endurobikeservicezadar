export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request)
      });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, request);
    }

    try {
      const body = await request.json();
      const { action, payload, recaptchaToken } = body || {};

      if (action !== 'send') {
        return json({ ok: false, error: 'Unsupported action' }, 400, request);
      }

      if (!recaptchaToken) {
        return json({ ok: false, error: 'Missing reCAPTCHA token' }, 400, request);
      }

      if (!env.RECAPTCHA_SECRET_KEY) {
        return json(
          { ok: false, error: 'Missing Worker secret RECAPTCHA_SECRET_KEY' },
          500,
          request
        );
      }

      if (!env.RESEND_API_KEY) {
        return json(
          { ok: false, error: 'Missing Worker secret RESEND_API_KEY' },
          500,
          request
        );
      }

      // Verify Google reCAPTCHA v2 token
      const verifyForm = new URLSearchParams();
      verifyForm.set('secret', env.RECAPTCHA_SECRET_KEY);
      verifyForm.set('response', recaptchaToken);

      const ip = request.headers.get('CF-Connecting-IP');
      if (ip) verifyForm.set('remoteip', ip);

      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: verifyForm.toString()
      });

      const verifyText = await verifyRes.text();
      let verifyJson = {};

      try {
        verifyJson = JSON.parse(verifyText);
      } catch (_) {
        return json(
          {
            ok: false,
            error: 'Google reCAPTCHA returned non-JSON response',
            details: verifyText
          },
          502,
          request
        );
      }

      if (!verifyJson.success) {
        return json(
          {
            ok: false,
            error: 'reCAPTCHA verification failed',
            details: verifyJson['error-codes'] || []
          },
          400,
          request
        );
      }

      const data = payload || {};
      const safe = {};

      for (const [key, value] of Object.entries(data)) {
        if (key === 'g-recaptcha-response') continue;
        safe[key] = escapeHtml(value ?? '');
      }

      // Translate inquiry/service values
      const inquiryLabels = {
        maintenance: 'Service',
        service: 'Service',
        wheels: 'Wheels',
        brakes: 'Brakes',
        steering: 'Steering',
        drivetrain: 'Drivetrain',
        suspension: 'Suspension',
        diagnostics: 'Diagnostics',
        other: 'Other'
      };

      const name = safe.name || safe.ime || '';
      const surname = safe.surname || safe.prezime || '';
      const fullName = [name, surname].filter(Boolean).join(' ').trim();

      const email = safe.email || '';
      const rawPhone = data.phone || data.telefon || '';
      const phone = safe.phone || safe.telefon || '';
      const phoneHref = normalizePhoneForTel(rawPhone);
      const country = safe.country || safe.drzava || '';

      const inquiryRaw =
        safe.inquiry ||
        safe.need ||
        safe.service ||
        safe.usluga ||
        '';

      const inquiry = inquiryLabels[inquiryRaw] || inquiryRaw || 'Not provided';

      const otherDetails =
        safe.other_details ||
        safe.otherDetails ||
        safe.details ||
        safe.napomena ||
        '—';

      const message = safe.message || safe.poruka || '';

      const now = new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('hr-HR');
      const subjectName = fullName || email || phone || 'Unknown contact';

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Enduro Bike Service <noreply@enduro-bike-service.com>',
          to: ['endurobikeservice@gmail.com'],
          reply_to: email || undefined,
          subject: `New Enduro Bike Service contact – ${subjectName} – ${now}`,
          html: `
            <h2>New contact form submission</h2>

            <p><strong>Name:</strong> ${fullName || 'Not provided'}</p>

            <p><strong>Email:</strong> ${
              email
                ? `<a href="mailto:${email}">${email}</a>`
                : 'Not provided'
            }</p>

            <p><strong>Phone:</strong> ${
              phone
                ? `<a href="tel:${phoneHref || phone}">${phone}</a>`
                : 'Not provided'
            }</p>

            <p><strong>Country:</strong> ${country || 'Not provided'}</p>

            <p><strong>Inquiry:</strong> ${inquiry}</p>

            <p><strong>Other details:</strong> ${otherDetails}</p>

            <p><strong>Message:</strong><br>${nl2br(message || '')}</p>
          `
        })
      });

      const emailText = await emailRes.text();
      let emailJson = {};

      try {
        emailJson = emailText ? JSON.parse(emailText) : {};
      } catch (_) {}

      if (!emailRes.ok) {
        const resendMessage =
          emailJson?.message ||
          emailJson?.error ||
          emailText ||
          `Resend error ${emailRes.status}`;

        return json(
          {
            ok: false,
            error: resendMessage
          },
          500,
          request
        );
      }

      return json({ ok: true }, 200, request);
    } catch (err) {
      return json({ ok: false, error: String(err) }, 500, request);
    }
  }
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';

  const allowedOrigins = [
    'https://enduro-bike-service.com',
    'https://www.enduro-bike-service.com',
    'https://endurobikeservicezadar.pages.dev'
  ];

  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : 'https://enduro-bike-service.com';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function json(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request)
    }
  });
}

function normalizePhoneForTel(value) {
  let phone = String(value || '').trim().replace(/[^+\d]/g, '');
  phone = phone.replace(/(?!^)\+/g, '');
  if (phone.startsWith('00')) phone = '+' + phone.slice(2);
  return phone;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(value) {
  return String(value).replace(/\n/g, '<br>');
}
