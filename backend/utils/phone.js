function normalizePhone(phone) {
  if (typeof phone !== 'string') return null;

  const cleaned = phone.replace(/[\s()-]/g, '');
  const digits = cleaned.replace(/\D/g, '');

  if (!digits) return null;

  if (digits.length === 10) return `+91${digits}`;
  if (/^91\d{10}$/.test(digits)) return `+${digits}`;
  if (/^\+\d{10,15}$/.test(cleaned)) return cleaned;
  if (/^\d{11,16}$/.test(digits)) return `+${digits}`;

  return null;
}

module.exports = { normalizePhone };
