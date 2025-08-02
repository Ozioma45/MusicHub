import { steps } from "../../lib/data";

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">How MusiConnect Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 ">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-sm mx-auto border p-3"
            >
              {step.icon}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
