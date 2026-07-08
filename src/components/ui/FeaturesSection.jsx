import { Truck, ShieldCheck, Award, Headset } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your order quickly"
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "100% secure checkout"
    },
    {
      icon: Award,
      title: "Best Quality",
      description: "Premium products"
    },
    {
      icon: Headset,
      title: "24/7 Support",
      description: "We are here to help"
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#111111] py-8 border-y border-gray-100 dark:border-white/5 shadow-sm mt-4 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className={`flex items-center space-x-4 ${idx > 0 ? 'pt-6 md:pt-0 md:pl-6' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] md:text-[14px] text-black dark:text-white uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] md:text-[12px] text-gray-500 font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
