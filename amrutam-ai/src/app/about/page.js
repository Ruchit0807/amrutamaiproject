export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-white">About AMRUTAM AI</h1>
      <p className="text-white mt-3">
        AMRUTAM AI is created by <span className="font-semibold text-accent">Ruchit Sonawane</span>,
        Student of National Institute Of Technology Nagpur (VNIT Nagpur). This project blends
        classical Ayurvedic wisdom with modern machine learning to offer accessible, responsible
        wellness guidance.
      </p>

      <h2 className="font-serif text-2xl text-white mt-8">Why this matters</h2>
      <p className="text-white mt-2">
        Many people lack timely access to holistic health insights. AMRUTAM AI helps users
        describe symptoms in plain language and receive structured Ayurvedic guidance, along with
        AI-assisted skin health screening. This can support:
      </p>
      <ul className="list-disc pl-6 text-white mt-2 space-y-1">
        <li>Early awareness and triage before visiting a professional</li>
        <li>Personalized preventive care and lifestyle improvements</li>
        <li>Bridging traditional knowledge with modern technology</li>
      </ul>

      <h2 className="font-serif text-2xl text-white mt-8">Benefits of Ayurveda</h2>
      <p className="text-white mt-2">
        Ayurveda emphasizes root-cause understanding and sustainable routines. It promotes
        balance across body and mind through diet, daily rhythms, herbal support, and breathwork.
        Key benefits include:
      </p>
      <ul className="list-disc pl-6 text-white mt-2 space-y-1">
        <li>Focus on prevention and long-term wellness</li>
        <li>Natural, time-tested remedies and lifestyle practices</li>
        <li>Personalized guidance aligned with individual constitutions</li>
      </ul>

      <div className="mt-10 rounded-2xl bg-secondary p-6 border border-accent/10">
        <h3 className="font-serif text-xl text-amber-900">Support the Project</h3>
        <p className="text-amber-900 mt-2">
          If AMRUTAM AI is helpful, please consider supporting its development. Your contribution
          helps fund Ayurvedic research, AI model improvements, and hosting.
        </p>
        <a
          href="https://buymeacoffee.com/ruchit0807"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 rounded-full bg-accent text-secondary px-6 py-3 hover:bg-accent/90 transition-colors"
        >
          Buy me a coffee
        </a>
      </div>
    </div>
  );
}
