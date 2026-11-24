import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const SMTP_HOST = process.env.SMTP_HOST || 'mailserver15.vhosting-it.com';
const SMTP_USER = process.env.SMTP_USER || 'info@dock71birreria.it';
const SMTP_PASS = process.env.SMTP_PASS || 'RdP7KakV6EXZ9C584J2B@.';
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'info@dock71birreria.it';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Dock 71 Cantù';
const COMPANY_NOTIFICATION_EMAIL = process.env.COMPANY_NOTIFICATION_EMAIL || 'info@dock71birreria.it';

const PHP_ENDPOINTS = [
  'https://www.dock71birreria.it/backend/process-form.php',
  'https://www.dock71birreria.it/produzione_cpanel/backend/process-form.php',
];

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDock71EmailHtml(
  badgeText: string,
  badgeColor: string,
  headline: string,
  customerName: string,
  bodyHtml: string,
  details: Record<string, string | number | undefined> = {}
): string {
  const rowsHtml = Object.entries(details)
    .filter(([, val]) => val !== undefined && val !== '')
    .map(
      ([label, val]) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #E8E2D4;font-size:12px;color:#7A7265;font-weight:bold;text-transform:uppercase;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E8E2D4;font-size:13px;color:#1D1C13;font-weight:bold;text-align:right;">${escapeHtml(String(val))}</td>
        </tr>`
    )
    .join('');

  const detailsTable = rowsHtml
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;border:1px solid #E8E2D4;border-radius:10px;margin:18px 0;overflow:hidden;">${rowsHtml}</table>`
    : '';

  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background-color:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#1D1C13;">
  <div style="max-width:600px;margin:0 auto;background-color:#FFF9EB;border:3px solid #7B2039;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(29,28,19,0.12);">
    <div style="background-color:#7B2039;padding:22px 24px;text-align:center;border-bottom:4px solid #E0A93B;">
      <div style="display:inline-block;padding:5px 14px;background-color:${badgeColor};color:#FFFFFF;border-radius:20px;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">
        ${escapeHtml(badgeText)}
      </div>
      <h1 style="margin:0;color:#FFF9EB;font-size:22px;text-transform:uppercase;letter-spacing:0.5px;">DOCK 71 • BIRRERIA &amp; PUB INDUSTRIAL</h1>
      <p style="margin:4px 0 0;color:#E0A93B;font-size:12px;font-weight:bold;">Via Milano 71, 22063 Cantù (CO) • Griglia, Malto e Farina</p>
    </div>
    <div style="padding:26px 24px;">
      <h2 style="margin-top:0;color:#7B2039;font-size:19px;">${escapeHtml(headline)}</h2>
      <p style="font-size:14px;line-height:1.6;color:#1D1C13;">Ciao <strong>${escapeHtml(customerName || 'Cliente')}</strong>,</p>
      <div style="font-size:14px;line-height:1.6;color:#554245;">${bodyHtml}</div>
      ${detailsTable}
      <p style="font-size:12px;color:#7A7265;margin-top:22px;line-height:1.5;">Per qualsiasi necessità puoi contattarci telefonicamente al <strong>+39 031 712063</strong> oppure rispondere direttamente a questa email (<a href="mailto:info@dock71birreria.it" style="color:#7B2039;font-weight:bold;">info@dock71birreria.it</a>).</p>
    </div>
    <div style="background-color:#F3EDDF;padding:14px 24px;text-align:center;border-top:1px solid #E8E2D4;font-size:11px;color:#7A7265;">
      © ${new Date().getFullYear()} Dock 71 Cantù • Via Milano 71, 22063 Cantù (CO)
    </div>
  </div>
</body>
</html>`;
}

async function sendDirectNodemailer(
  toEmail: string,
  toName: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ sent: boolean; error?: string; transport?: string }> {
  if (!toEmail || !toEmail.includes('@')) {
    return { sent: false, error: 'Email destinatario non valida' };
  }

  const attempts = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  const errors: string[] = [];
  for (const cfg of attempts) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: cfg.port,
        secure: cfg.secure,
        family: 4,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        tls: {
          servername: SMTP_HOST,
          rejectUnauthorized: false,
        },
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 8000,
      } as Parameters<typeof nodemailer.createTransport>[0]);

      await transporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
        to: toName ? `"${toName}" <${toEmail}>` : toEmail,
        replyTo: replyTo && replyTo.includes('@') ? replyTo : SMTP_FROM_EMAIL,
        subject,
        html,
      });

      return { sent: true, transport: `nodemailer:${SMTP_HOST}:${cfg.port}` };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${SMTP_HOST}:${cfg.port} => ${msg}`);
    }
  }

  return { sent: false, error: errors.join(' | ') };
}

async function relayToLivePhp(
  method: 'GET' | 'POST',
  queryOrBody: Record<string, unknown>
): Promise<Record<string, unknown> | null> {
  for (const baseUrl of PHP_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 18000);
      let res: Response;

      if (method === 'GET') {
        const qs = new URLSearchParams(
          Object.entries(queryOrBody).map(([k, v]) => [k, String(v ?? '')])
        ).toString();
        res = await fetch(`${baseUrl}?${qs}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
      } else {
        res = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ ...queryOrBody, ajax: '1' }),
          signal: controller.signal,
        });
      }

      clearTimeout(timer);
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
      }
    } catch {
      // Prova endpoint PHP successivo
    }
  }
  return null;
}

async function handleCrmGet(req: express.Request, res: express.Response) {
  const action = String(req.query.action || 'list_crm_data');
  const relayed = await relayToLivePhp('GET', { action, ajax: '1' });
  if (relayed) {
    res.json(relayed);
    return;
  }
  res.json({ success: true, bookings: [], contacts: [], consents: [] });
}

async function handleCrmPost(req: express.Request, res: express.Response) {
  const body = (req.body || {}) as Record<string, unknown>;
  const action = String(body.action || 'booking');

  // 1. Inoltra sempre al backend PHP di produzione (salva su MySQL + invia con PHPMailer SMTP vHosting)
  const phpResult = await relayToLivePhp('POST', body);
  if (phpResult) {
    const phpSentAny =
      Boolean(phpResult.client_mail_sent) ||
      Boolean(phpResult.admin_mail_sent) ||
      Boolean(phpResult.email_sent);

    if (phpSentAny || action === 'delete_records') {
      res.json({ ...phpResult, via: 'php_relay' });
      return;
    }
  }

  // 2. Se il relay PHP non ha ancora completato l'invio SMTP (o non è raggiungibile), tenta invio diretto via Nodemailer SMTP
  if (action === 'booking') {
    const name = String(body.name || 'Cliente').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const date = String(body.booking_date || body.date || '');
    const timeSlot = String(body.time_slot || '20:30');
    const guests = Number(body.guests || 2);
    const notes = String(body.notes || '');
    const bookingCode = String(body.booking_code || `DK71-${Math.floor(1000 + Math.random() * 9000)}`);

    const clientRes = email
      ? await sendDirectNodemailer(
          email,
          name,
          `Dock 71 Cantù - Riepilogo Richiesta Prenotazione #${bookingCode}`,
          buildDock71EmailHtml(
            'RICHIESTA PRENOTAZIONE RICEVUTA',
            '#E0A93B',
            `Riepilogo Richiesta Tavolo #${bookingCode}`,
            name,
            `<p>Grazie per aver scelto <strong>Dock 71 Cantù</strong>! Abbiamo ricevuto la tua richiesta di prenotazione tavolo.</p>
             <p>La tua prenotazione è attualmente <strong>IN ATTESA DI CONFERMA</strong> da parte del nostro staff: riceverai a breve una seconda email di conferma definitiva.</p>`,
            {
              'Codice Prenotazione': `#${bookingCode}`,
              'Data e Orario': `${date} • Ore ${timeSlot}`,
              'Numero Ospiti': `${guests} ${guests === 1 ? 'Persona' : 'Persone'}`,
              'Recapito Telefonico': phone,
              'Note / Richieste': notes || 'Nessuna nota particolare',
            }
          )
        )
      : { sent: false, error: 'Email cliente non inserita' };

    const adminRes = await sendDirectNodemailer(
      COMPANY_NOTIFICATION_EMAIL,
      'Dock 71 Prenotazioni',
      `Nuova Prenotazione [#${bookingCode}] - ${name} (${guests} pax - ${date} ${timeSlot})`,
      buildDock71EmailHtml(
        'NUOVA PRENOTAZIONE TAVOLO',
        '#7B2039',
        `Nuova Richiesta Tavolo #${bookingCode} (${guests} pax)`,
        'Staff Dock 71',
        `<p>È arrivata una nuova richiesta di prenotazione tavolo dal sito web. Accedi al Gestionale CRM per <strong>Confermare</strong> o <strong>Rifiutare</strong> la richiesta con un clic.</p>`,
        {
          'Codice Prenotazione': `#${bookingCode}`,
          Cliente: name,
          'Telefono / WhatsApp': phone,
          'Email Cliente': email || 'Non indicata',
          'Data e Orario': `${date} • Ore ${timeSlot}`,
          Coperti: `${guests} pax`,
          'Note Cliente': notes || '-',
        }
      ),
      email || COMPANY_NOTIFICATION_EMAIL
    );

    const combinedErr = [
      phpResult?.smtp_error ? `PHP: ${String(phpResult.smtp_error)}` : '',
      !clientRes.sent && clientRes.error ? `Node Client: ${clientRes.error}` : '',
      !adminRes.sent && adminRes.error ? `Node Admin: ${adminRes.error}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    res.json({
      success: Boolean(phpResult?.success ?? true),
      booking_code: bookingCode,
      client_mail_sent: Boolean(phpResult?.client_mail_sent) || clientRes.sent,
      admin_mail_sent: Boolean(phpResult?.admin_mail_sent) || adminRes.sent,
      transport: clientRes.transport || adminRes.transport || phpResult?.transport || null,
      smtp_error: combinedErr || null,
    });
    return;
  }

  if (action === 'contact') {
    const name = String(body.name || 'Cliente').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const subject = String(body.subject || 'Richiesta Contatto Dock 71').trim();
    const message = String(body.message || '').trim();

    const clientRes = email
      ? await sendDirectNodemailer(
          email,
          name,
          'Dock 71 Cantù - Riepilogo del tuo messaggio',
          buildDock71EmailHtml(
            'MESSAGGIO RICEVUTO',
            '#336859',
            'Abbiamo ricevuto la tua richiesta!',
            name,
            `<p>Grazie per aver contattato <strong>Dock 71 Cantù</strong>. Il nostro staff ha preso in carico il tuo messaggio e ti risponderà al più presto.</p>
             <div style="padding:14px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:8px;margin-top:12px;font-style:italic;">"${escapeHtml(message).replace(/\n/g, '<br>')}"</div>`,
            {
              Oggetto: subject,
              Telefono: phone || '-',
              Email: email,
            }
          )
        )
      : { sent: false, error: 'Email cliente non inserita' };

    const adminRes = await sendDirectNodemailer(
      COMPANY_NOTIFICATION_EMAIL,
      'Dock 71 Admin',
      `Nuovo Messaggio da ${name} - Dock 71 Cantù`,
      buildDock71EmailHtml(
        'NUOVO MESSAGGIO DAL SITO',
        '#7B2039',
        `Nuova richiesta contatto da ${name}`,
        'Staff Dock 71',
        `<p>È stato appena inviato un nuovo messaggio dal modulo contatti del sito web:</p>
         <div style="padding:14px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:8px;margin-top:12px;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>`,
        {
          'Nome Cliente': name,
          Email: email || '-',
          Telefono: phone || '-',
          Oggetto: subject,
        }
      ),
      email || COMPANY_NOTIFICATION_EMAIL
    );

    const combinedErr = [
      phpResult?.smtp_error ? `PHP: ${String(phpResult.smtp_error)}` : '',
      !clientRes.sent && clientRes.error ? `Node Client: ${clientRes.error}` : '',
      !adminRes.sent && adminRes.error ? `Node Admin: ${adminRes.error}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    res.json({
      success: Boolean(phpResult?.success ?? true),
      client_mail_sent: Boolean(phpResult?.client_mail_sent) || clientRes.sent,
      admin_mail_sent: Boolean(phpResult?.admin_mail_sent) || adminRes.sent,
      transport: clientRes.transport || adminRes.transport || phpResult?.transport || null,
      smtp_error: combinedErr || null,
    });
    return;
  }

  if (action === 'update_booking_status') {
    const newStatus = String(body.new_status || 'Confermato');
    const bookingCode = String(body.booking_code || '');
    const customerName = String(body.name || 'Cliente');
    const customerEmail = String(body.email || '').trim();
    const bookingDate = String(body.date || body.booking_date || '');
    const timeSlot = String(body.time_slot || '');
    const guests = Number(body.guests || 2);
    const rejectionReason = String(body.rejection_reason || '');

    let sendRes: { sent: boolean; error?: string; transport?: string } = { sent: false };
    if (customerEmail) {
      if (newStatus === 'Confermato' || newStatus === 'confirmed') {
        sendRes = await sendDirectNodemailer(
          customerEmail,
          customerName,
          `Prenotazione Confermata #${bookingCode} - Dock 71 Cantù`,
          buildDock71EmailHtml(
            'PRENOTAZIONE CONFERMATA ✓',
            '#336859',
            'Il tuo tavolo al Dock 71 è confermato!',
            customerName,
            `<p>Siamo felici di comunicarti che la tua richiesta di prenotazione tavolo presso <strong>Dock 71 Cantù</strong> è stata <strong>ACCETTATA E CONFERMATA</strong>!</p>
             <p>Il tuo tavolo ti aspetta in <strong>Via Milano 71 a Cantù</strong>. Ti chiediamo cortesemente di avvisarci in caso di ritardo superiore ai 15 minuti.</p>`,
            {
              'Stato Prenotazione': 'CONFERMATA',
              'Codice Prenotazione': `#${bookingCode}`,
              'Data e Orario': `${bookingDate} • Ore ${timeSlot}`,
              'Numero Ospiti': `${guests} ${guests === 1 ? 'Persona' : 'Persone'}`,
              Indirizzo: 'Via Milano 71, 22063 Cantù (CO)',
            }
          )
        );
      } else if (newStatus === 'Rifiutato' || newStatus === 'cancelled') {
        const safeReason = escapeHtml(
          rejectionReason || 'Disponibilità tavoli esaurita per la fascia oraria richiesta.'
        );
        sendRes = await sendDirectNodemailer(
          customerEmail,
          customerName,
          `Aggiornamento Richiesta Prenotazione #${bookingCode} - Dock 71 Cantù`,
          buildDock71EmailHtml(
            'PRENOTAZIONE NON DISPONIBILE',
            '#7B2039',
            'Comunicazione sulla tua richiesta di prenotazione',
            customerName,
            `<p>Ti ringraziamo per aver scelto <strong>Dock 71 Cantù</strong>. Purtroppo non ci è possibile confermare la tua richiesta di prenotazione per il seguente motivo:</p>
             <div style="padding:14px 16px;background:#FEE2E2;border-left:4px solid #7B2039;border-radius:8px;margin:14px 0;color:#7B2039;font-weight:bold;">${safeReason}</div>
             <p>Saremo felici di accoglierti in un'altra fascia oraria o in un'altra serata: puoi contattarci direttamente al <strong>+39 031 712063</strong>.</p>`,
            {
              'Codice Richiesta': `#${bookingCode}`,
              'Data Richiesta': `${bookingDate} • Ore ${timeSlot}`,
              Coperti: `${guests} ${guests === 1 ? 'Persona' : 'Persone'}`,
            }
          )
        );
      }
    }

    res.json({
      success: Boolean(phpResult?.success ?? true),
      status: newStatus,
      booking_code: bookingCode,
      email_sent: Boolean(phpResult?.email_sent) || sendRes.sent,
      smtp_error:
        [phpResult?.smtp_error ? String(phpResult.smtp_error) : '', sendRes.error || '']
          .filter(Boolean)
          .join(' | ') || null,
    });
    return;
  }

  if (action === 'reply_contact') {
    const customerName = String(body.name || 'Cliente');
    const customerEmail = String(body.email || '').trim();
    const replyMessage = String(body.reply_message || '').trim();
    const origMessage = String(body.original_message || '').trim();

    const sendRes =
      customerEmail && replyMessage
        ? await sendDirectNodemailer(
            customerEmail,
            customerName,
            'Risposta da Dock 71 Cantù',
            buildDock71EmailHtml(
              'RISPOSTA UFFICIALE DOCK 71',
              '#336859',
              'Risposta alla tua richiesta di informazioni',
              customerName,
              `<div style="padding:16px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:10px;">${escapeHtml(replyMessage).replace(/\n/g, '<br>')}</div>`,
              origMessage ? { 'Il tuo messaggio originale': origMessage.slice(0, 140) } : {}
            )
          )
        : { sent: false, error: 'Email o messaggio di risposta mancante' };

    res.json({
      success: Boolean(phpResult?.success ?? true),
      status: 'Risposto',
      email_sent: Boolean(phpResult?.email_sent) || sendRes.sent,
      smtp_error:
        [phpResult?.smtp_error ? String(phpResult.smtp_error) : '', sendRes.error || '']
          .filter(Boolean)
          .join(' | ') || null,
    });
    return;
  }

  if (action === 'test_smtp') {
    const directRes = await sendDirectNodemailer(
      COMPANY_NOTIFICATION_EMAIL,
      'Dock 71 Test SMTP',
      'Test Connessione SMTP - Dock 71 Cantù',
      buildDock71EmailHtml(
        'TEST SMTP DIAGNOSTICO',
        '#336859',
        'Verifica invio email SMTP',
        'Staff Dock 71',
        '<p>Questa è un\'email automatica di verifica inviata per confermare che l\'invio SMTP è operativo.</p>',
        {
          'Data/Ora Test': new Date().toLocaleString('it-IT'),
          Origine: phpResult?.email_sent ? 'PHP vHosting Relay' : 'Nodemailer Direct SMTP',
        }
      )
    );

    const anySent = Boolean(phpResult?.email_sent) || directRes.sent;
    res.json({
      success: anySent,
      email_sent: anySent,
      transport: phpResult?.transport || directRes.transport || null,
      smtp_error:
        [phpResult?.smtp_error ? String(phpResult.smtp_error) : '', directRes.error || '']
          .filter(Boolean)
          .join(' | ') || null,
    });
    return;
  }

  res.json(phpResult || { success: true });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Endpoint unificato per AI Studio & Fallback
  app.get('/api/crm', handleCrmGet);
  app.post('/api/crm', handleCrmPost);

  // Intercetta anche le chiamate dirette ai percorsi .php durante l'esecuzione Node / AI Studio
  app.get('/backend/process-form.php', handleCrmGet);
  app.post('/backend/process-form.php', handleCrmPost);
  app.get('/produzione_cpanel/backend/process-form.php', handleCrmGet);
  app.post('/produzione_cpanel/backend/process-form.php', handleCrmPost);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dock 71 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
