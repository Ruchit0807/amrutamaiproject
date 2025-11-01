export const metadata = { title: "Choose Your Path to Wellness" };

import Link from "next/link";
import { FaLeaf } from "react-icons/fa6";
import { LuImage } from "react-icons/lu";

export default function JourneyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-white">Choose Your Path to Wellness</h1>
      <p className="text-white mt-2">Select how you wish to begin your journey with AMRUTAM AI.</p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <Link href="/remedy" className="group rounded-3xl bg-secondary border border-accent/10 p-8 hover:border-accent/30 transition-all">
          <div className="text-accent text-3xl"><FaLeaf /></div>
          <h2 className="font-serif text-2xl text-accent mt-3">Ayurvedic Remedy Recommender</h2>
          <p className="text-neutral/80 mt-1">Get Ayurvedic solutions based on your symptoms.</p>
          <div className="mt-4 inline-block rounded-full bg-accent text-secondary px-4 py-2 group-hover:bg-accent/90">Start</div>
        </Link>

        <Link href="/skin" className="group rounded-3xl bg-secondary border border-accent/10 p-8 hover:border-accent/30 transition-all">
          <div className="text-accent text-3xl"><LuImage /></div>
          <h2 className="font-serif text-2xl text-accent mt-3">Skin Disease Predictor</h2>
          <p className="text-neutral/80 mt-1">Upload an image and let AI analyze your skin health.</p>
          <div className="mt-4 inline-block rounded-full bg-accent text-secondary px-4 py-2 group-hover:bg-accent/90">Start</div>
        </Link>
      </div>

      <p className="text-white mt-8">More powerful features are coming soon to elevate your wellness journey.</p>
    </div>
  );
}
