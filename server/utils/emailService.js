import nodemailer from "nodemailer";

const ADMIN_EMAIL = "hussainasghar017@gmail.com";

export const sendOwnerAccessRequestEmail = async ({ name, email, phone, city, fleetSize, message }) => {
    try {
        // Create transporter using environment config or fallback
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = Number(process.env.SMTP_PORT) || 587;
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

        const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
                    .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                    .header { background-color: #2563eb; color: #ffffff; padding: 28px 24px; text-align: center; }
                    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
                    .content { padding: 28px 24px; }
                    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                    .info-label { color: #64748b; font-weight: 600; }
                    .info-val { color: #0f172a; font-weight: 700; text-align: right; }
                    .reason-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 18px; font-size: 14px; color: #334155; line-height: 1.6; }
                    .footer { padding: 18px 24px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <h1>GoRido • New Owner Access Request</h1>
                    </div>
                    <div class="content">
                        <p style="font-size: 15px; margin-top: 0; color: #334155;">
                            Hello Hussain, a user has requested partner/owner access to the GoRido Admin Panel.
                        </p>
                        
                        <div class="info-row">
                            <span class="info-label">Requester Name:</span>
                            <span class="info-val">${name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email Address:</span>
                            <span class="info-val">${email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone Number:</span>
                            <span class="info-val">${phone || 'Not provided'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Location / City:</span>
                            <span class="info-val">${city || 'Not provided'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Fleet Size:</span>
                            <span class="info-val">${fleetSize || '1-5 Vehicles'}</span>
                        </div>

                        ${message ? `
                        <div style="margin-top: 16px;">
                            <strong style="font-size: 13px; color: #475569; text-transform: uppercase;">Message / Reason:</strong>
                            <div class="reason-box">${message}</div>
                        </div>
                        ` : ''}

                        <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
                            You can review and manage this request directly from your GoRido Admin Dashboard under <strong>Manage Customers / Access Requests</strong>.
                        </p>
                    </div>
                    <div class="footer">
                        Sent securely from GoRido Mobility Platform • Notification for ${ADMIN_EMAIL}
                    </div>
                </div>
            </body>
            </html>
        `;

        if (smtpUser && smtpPass) {
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });

            const info = await transporter.sendMail({
                from: `"GoRido Platform" <${smtpUser}>`,
                to: ADMIN_EMAIL,
                subject: `[GoRido] New Owner Access Request from ${name} (${email})`,
                html: emailContent
            });

            console.log(`Email dispatched to ${ADMIN_EMAIL}. Message ID: ${info.messageId}`);
            return { sent: true, messageId: info.messageId };
        } else {
            console.log(`\n======================================================`);
            console.log(`[EMAIL NOTIFICATION TO: ${ADMIN_EMAIL}]`);
            console.log(`Subject: [GoRido] New Owner Access Request from ${name} (${email})`);
            console.log(`Requester: ${name} | Phone: ${phone} | Fleet Size: ${fleetSize} | City: ${city}`);
            console.log(`Reason: ${message || 'No additional note'}`);
            console.log(`(Configure SMTP_USER and SMTP_PASS in server/.env for automated SMTP delivery)`);
            console.log(`======================================================\n`);
            return { sent: true, simulated: true };
        }
    } catch (error) {
        console.error("Error sending owner access request email:", error.message);
        return { sent: false, error: error.message };
    }
};
