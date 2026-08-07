import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "I didn't have the time to go through another stressful prop firm challenge. This service took over and delivered as promised. My account was passed in under a month, and I'm now trading live with confidence.",
        author: "David Adelaide",
        location: "UK",
    },
    {
        quote: "Unfortunately, my account didn't pass the first time, but I was blown away by how quickly they refunded my full service fee, gave me an extra $100, and even refunded my prop firm purchase. That kind of integrity is rare.",
        author: "Maria Glory",
        location: "USA",
    },
    {
        quote: "The expert team guided me through the whole process. I got updates, answered questions, and saw my account progress in real time. I felt supported every step of the way.",
        author: "Samuel Tony",
        location: "Nigeria",
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/3">
                        <Quote className="w-24 h-24 text-primary/20 mb-6" />
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                            Real Stories from Real Traders
                        </h2>
                        <p className="text-lg text-slate-600">
                            Get inspired by these stories.
                        </p>
                    </div>

                    <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
                        {/* Masonry-like layout or just grid */}
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className={`bg-white p-8 rounded-2xl shadow-sm border border-slate-100 ${index === 1 ? 'md:translate-y-12' : ''}`}>
                                <Quote className="w-8 h-8 text-accent mb-4" />
                                <p className="text-slate-700 mb-6 leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <h4 className="font-bold text-slate-900">{testimonial.author}</h4>
                                    <p className="text-sm text-slate-500">{testimonial.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;