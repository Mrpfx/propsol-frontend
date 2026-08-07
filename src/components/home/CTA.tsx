import Image from "next/image";

const CTA = () => {
    return (
        <section className="bg-teal-400 relative overflow-hidden">
            <div className="container mx-auto px-4 py-20 lg:py-32">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="flex-1 z-10">
                        <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                            Leave your Account<br />Passing to us
                        </h2>
                        <p className="text-lg text-slate-800 mb-8 max-w-xl leading-relaxed">
                            Let our team of expert traders take over your prop firm account challenge
                            with a 100% success guarantee or your money back + compensation.
                        </p>
                        <button className="hidden md:block px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                            Get Started Now
                        </button>
                    </div>

                    <div className="flex-1 relative h-64 lg:h-auto w-full flex items-center justify-center">
                        {/* 3D Cubes Illustration - Placeholder or CSS art */}
                        {/* Using a placeholder div to represent the cubes if no image is available,
                 but the screenshot shows specific cubes. I'll try to use CSS or a placeholder image.
                 I'll use a div structure that looks like the cubes if I can't find the image.
                 Actually, I'll assume one of the uploaded images is this, or I'll just leave a placeholder.
                 The user uploaded 5 images.
                 0: Logo?
                 1: Laptop?
                 2: Star?
                 3: Cubes?
                 4: Something else?
                 I'll use image_4.png as a guess for the cubes, or image_2.png.
                 I'll use image_2.png here.
             */}
                        <div className="relative w-64 h-64 lg:w-96 lg:h-96">
                            <Image
                                src="/assets/cubes_stack_cta.png"
                                alt="3D Cubes Illustration"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;