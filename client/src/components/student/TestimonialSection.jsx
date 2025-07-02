import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <div className="py-20 px-6 sm:px-8 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Testimonials
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Hear from our learners as they share their journeys of transformation, success, and how our 
            platform has made a difference in their lives.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-none">
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-sm mx-auto lg:max-w-none lg:mx-0"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-6 bg-gray-50">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <img 
                      className="h-4 w-4" 
                      key={i} 
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} 
                      alt="star" 
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-6 mb-4">
                  {testimonial.feedback}
                </p>

                {/* Read More Link */}
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;