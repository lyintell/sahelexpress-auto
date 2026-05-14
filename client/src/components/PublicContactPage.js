import ContactForm from "./ContactForm";

function IconBase({ children }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      {children}
    </svg>
  );
}

function PhoneIcon() {
  return (
    <IconBase>
      <path d="M6.8 4.5h2.1l1.2 3.3-1.5 1.5a14.8 14.8 0 0 0 6.1 6.1l1.5-1.5 3.3 1.2v2.1c0 1.1-.9 2-2 2A14.5 14.5 0 0 1 4.8 6.5c0-1.1.9-2 2-2Z" />
    </IconBase>
  );
}

function MailIcon() {
  return (
    <IconBase>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M5 7l7 5 7-5" />
    </IconBase>
  );
}

function MapPinIcon() {
  return (
    <IconBase>
      <path d="M12 20c3.5-4.2 5.2-7.2 5.2-10A5.2 5.2 0 1 0 6.8 10c0 2.8 1.7 5.8 5.2 10Z" />
      <circle cx="12" cy="10" r="1.8" />
    </IconBase>
  );
}

export default function PublicContactPage({ contactDetails }) {
  const contactItems = [
    { value: contactDetails.phone, icon: PhoneIcon, accent: "#0d9503" },
    { value: contactDetails.email, icon: MailIcon, accent: "#c8ac09" },
    { value: contactDetails.location, icon: MapPinIcon, accent: "#d62828" },
  ].filter((item) => item.value);

  return (
    <div className="pb-20 pt-6 sm:pt-10">
      <section className="section-shell">
        <div className="space-y-6">
          <ContactForm />

          {contactItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {contactItems.map((item) => (
                <div
                  key={item.value}
                  className="panel rounded-[1.75rem] border border-[rgba(115,115,115,0.14)] p-5"
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: item.accent }}
                  >
                    <item.icon />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel rounded-[1.75rem] border border-[rgba(115,115,115,0.14)] p-5 text-slate-600">
              Les coordonnées de contact ne sont pas encore disponibles.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}