'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const services = [
  {
    id: 1,
    title: "Team of Experts",
    description: "A collective of visionaries and builders dedicated to bringing complex ideas to life with seamless execution.",
    // REPLACE THIS SRC WITH YOUR IMAGE
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
  },
  {
    id: 2,
    title: "Precision Driven",
    description: "Zero tolerance for error. We measure twice, cut once, and review everything to ensure absolute perfection.",
    // REPLACE THIS SRC WITH YOUR IMAGE
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Built with Care",
    description: "Craftsmanship isn't just a skill, it's an attitude. We build every corner as if it were our own home.",
    // REPLACE THIS SRC WITH YOUR IMAGE
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const ArchesSection = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
            Designed to Bloom
          </h2>
          <p className="text-gray-500 text-lg">
            Excellence is not just our goal, it is the fabric of our process.
          </p>
        </motion.div>

        {/* Arches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }} // Staggered delay
              className={`group text-center ${index === 1 ? 'md:-mt-16' : ''}`} // Lifts the middle card
            >
              {/* Image Container with Arch Mask */}
              <div className="relative overflow-hidden h-[450px] w-full mb-8 shadow-xl transition-all duration-500 rounded-t-[10rem]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Text Content */}
              <div className="px-4">
                <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ArchesSection;
