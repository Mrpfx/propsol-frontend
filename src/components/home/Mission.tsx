const Mission = () => {
    return (
        <section className="hidden md:flex flex-col lg:flex-row">
            <div className="lg:w-1/3 bg-primary p-12 lg:p-20 flex items-center justify-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    OUR<br />MISSION
                </h2>
            </div>
            <div className="lg:w-2/3 bg-white p-12 lg:p-20 flex items-center">
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                    Help as many traders as possible to get fully funded with zero risk involved.
                    You don't have to keep buying and losing your accounts when you can buy just once,
                    get it passed through us and start earning with our prop firm solution system.
                </p>
            </div>
        </section>
    );
};

export default Mission;