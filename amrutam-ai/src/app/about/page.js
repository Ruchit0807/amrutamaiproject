export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center space-y-8">
        <h1 className="font-serif text-4xl text-gray-100">About This Project</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-2xl text-gray-200 mb-4">Meet the Creator</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            AMRUTAM AI is created by <span className="font-semibold text-gray-100">Ruchit Sonawane</span>, 
            a Chemical Engineering student from VNIT Nagpur.
          </p>
          
          <h2 className="font-serif text-2xl text-gray-200 mb-4 mt-8">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            This project combines ancient Ayurvedic wisdom with modern AI technology to provide 
            personalized wellness solutions and skin health predictions, making traditional 
            healing knowledge accessible to everyone.
          </p>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-lg mt-8">
            <h3 className="font-serif text-xl text-amber-800 mb-3">Support Future Development</h3>
            <p className="text-amber-700 text-sm mb-4">
              Your support helps create more innovative projects that benefit people worldwide. 
              Every contribution enables us to develop better AI models and expand our wellness platform.
            </p>
            <a
              href="https://buymeacoffee.com/ruchit0807"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 text-white px-6 py-2 hover:bg-amber-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <span>☕</span>
              Support the Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
