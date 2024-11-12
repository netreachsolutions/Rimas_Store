import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import imageConfig from "../config/imageConfig";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Brands = () => {
  const [brandVisible, setBrandVisible] = useState([]); 

  // Sample data setup (you can replace this with your actual data)
  useEffect(() => {
    // Your data fetching logic
  }, []);

  // Observe each best-selling section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBrandVisible((prev) => [...prev, entry.target.dataset.index]);
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.best-selling-section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col">
      {imageConfig.spotlight?.map((category, index) => (
        <section
          key={index}
          className={`w-[90%] sm:w-[80%] m-auto transition-all duration-700 ease-out transform ${
            brandVisible.includes(index.toString())
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
          } best-selling-section`}
          data-index={index}
        >


          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={5}
            slidesPerView={4.4}
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              320: {
                slidesPerView: 3.6,
              },
              480: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4.4,
              },
            }}
          >
                      <div className="border-x-2 flex items-center border-b-2 shadow-x-lg -translate-y-[0px] shadow-lg mb-10">
            <div className="w-full h-[80px] sm:h-[100px] flex items-center px-3">
              <div className="w-1/2">
                <h1 className="text-[18px] sm:text-[35px] text-center font-medium uppercase">
                  {category.english.replaceAll('_', ' ')}
                </h1>
              </div>
              <div id="block" className="mx-2 h-full w-[0.5px] sm:w-[4px] rounded-[50px] bg-gray-500" />
              <div className="w-1/2">
                <h1 className="text-[20px] sm:text-[40px] text-center font-medium uppercase">
                  {category.arabic.replaceAll('_', ' ')}
                </h1>
              </div>
            </div>
          </div>
            {category.image_list.map((url, idx) => (
              <SwiperSlide key={idx}>
                <div className="cursor-pointer flex-shrink-0">
                  <div className="group relative overflow-hidden flex items-center justify-center p-0 rounded-t-[0px] bg-[#F6F5F8] z-10">
                    <div className="animation bg-red absolute top-[-3rem] left-[50%] skew-x-[-15deg] translate-x-[-50%] z-[-1] opacity-0 transition duration-300 group-hover:opacity-100"></div>
                    <Link to={`/products/search?categoryIds=19%2C24`}>
                      <img
                        src={url}
                        className="md:h-[300px] h-[150px] object-cover w-full object-top"
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ))}
    </div>
  );
};

export default Brands;
