import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_DOMAIN,
  CONTACT_EMAIL_LOCAL_PART,
} from '@/lib/utils';

export default function EmailLink() {
  return (
    <div className="contact-email-container">
      <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email-link">
        <span className="contact-email-prefix">{CONTACT_EMAIL_LOCAL_PART}</span>
        <span className="contact-email-domain">{CONTACT_EMAIL_DOMAIN}</span>
      </a>
    </div>
  );
}
