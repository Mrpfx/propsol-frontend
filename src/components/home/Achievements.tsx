import Image from "next/image";

const Achievements = () => {
    const stats = [
        {
            iconPath: "/assets/achievement_final_1.png",
            value: "200+",
            label: "Prop firm account passed",
        },
        {
            iconPath: "/assets/achievement_final_2.png",
            value: "120k +",
            label: "Users",
        },
        {
            iconPath: "/assets/achievement_final_3.png",
            value: "2100+",
            label: "Clients",
        },
        {
            iconPath: "/assets/achievement_icon_4.png",
            value: "50 +",
            label: "Trained Trading Experts",
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Our 2 years of<br />achievements
                    </h2>
                    <p className="text-base text-slate-600">
                        With our super powers we have reached this
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 flex justify-center">
                                <Image
                                    src={stat.iconPath}
                                    alt={stat.label}
                                    width={index === 3 ? 40 : 24}
                                    height={index === 3 ? 40 : 24}
                                    className={`${index === 3 ? 'w-10 h-10' : 'w-6 h-6'} object-contain`}
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 leading-none mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm text-slate-600 font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;