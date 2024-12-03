import { useEffect, useState } from "react";

const Testimonial = () => {
  const [testimonies, setTestimonies] = useState([]);

  useEffect(() => {
    fetch("/assets/testimonials.json")
      .then((res) => res.json())
      .then((json) => setTestimonies(json.testimonials))
      .catch((error) => {
        console.log("Error fetching testimonials", error);
      });
  }, []);

  return (
    <>
      <h1
        className="text-x font-bold mx-[20%] px-5 py-5 mb-10 text-center bg-stone-100 rounded-2xl md:rounded-full 
    "
      >
        Thank you for choosing our website for your apparel needs. We are
        honored to serve you and look forward to continuing to provide an
        incredible e-commerce service that not only meets but surpasses your
        expectations. Here are some Testimonials...
      </h1>
      <div className="flex flex-col px-10 md:-mx-3 sm:px-28 md:px-10 space-y-6 md:flex-row md:space-x-4 md:space-y-0">
        {testimonies.map((testimony) => (
          <div
            key={testimony.id}
            className="bg-black text-white p-5 rounded-2xl relative"
          >
            <img
              src={`/assets/images/${testimony.name}.jpeg`}
              alt={`${testimony.name}`}
              className="w-14 h-14 rounded-full absolute -left-3 -top-3 text-blue-500"
            />
            <div
              className={`absolute inset-0 bg-[url('/assets/images/${testimony.name}.jpeg')] bg-center bg-no-repeat filter blur-sm brightness-50 overflow-hidden`}
            ></div>
            <h2 className="indent-6 relative">{testimony.testimony}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default Testimonial;
