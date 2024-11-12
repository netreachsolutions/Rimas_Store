import React, { useEffect, useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "./NavBar";
import imageConfig from '../config/imageConfig';
import Footer from "./Footer";
import { FaSearch } from "react-icons/fa";
import TypeForm from "./TypeForm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const Home = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [formVisibility, setFormVisibility] = useState(false);
  const sectionsData = useRef([]);
  const [sections, setSections] = useState([]);
  const sectionVisibility = useRef({});
  const brandsSectionRef = useRef(null); // Reference to "Our Brands" section
  const bestSellersSectionRef = useRef(null); // Reference to "Our Brands" section
  const [brandVisible, setBrandVisible] = useState([]); 
  const [isBrandsVisible, setIsBrandsVisible] = useState(false); // State to track visibility
  const [isBestVisible, setIsBestVisible] = useState(false);

  // Define the sections
  const initialSections = [
    {
      id: 1,
      englishTitle: 'Total English Rabbit',
      arabicTitle: 'توتال انجليزي ربط',
      categoryIds: [19, 23],
      products: [],
    },
    {
      id: 2,
      englishTitle: 'Total English Kamel Deluxe',
      arabicTitle: 'توتال كامل ديقتال فاخر',
      categoryIds: [29, 24],
      products: [],
    },
    // Add more sections as needed
  ];

  const brands = [
    {
      id: 18,
      english: 'Ratti',
      arabic: 'راتي',
      image_url: imageConfig.brands.ratti,
      next: 'finish'
    },
    {
      id: 19,
      english: 'English',
      arabic: 'إنجليش',
      image_url: imageConfig.brands.totalenglish,
      next: 'finish'
    },
    {
      id: 20,
      english: 'Altamode',
      arabic: 'التمودة',
      image_url: '/images/sillohette.png',
      next: 'finish'
  },
  {
    id: 27,
      english: 'Switzerland',
      arabic: 'سواسري',
      image_url: '/images/sillohette.png',
      next: 'finish'
  },
  {
      id: 26,
      english: 'Sahra',
      arabic: 'صحراء',
      image_url: '/images/sillohette.png',
      next: 'width'
  },
  {
      id: 25,
      english: 'Other',
      arabic: 'آخر',
      image_url: '/images/sillohette.png',
      next: 'width'
  }
  ];


  

  // Fetch products for each section
  useEffect(() => {
    const fetchProductsForSections = async () => {
      try {
        const updatedSections = await Promise.all(
          initialSections.map(async (section) => {
            const response = await axios.post('/api/products/filter', {
              filters: {
                categoryIds: section.categoryIds.filter(Boolean),
                minPrice: null,
                maxPrice: null,
              },
            });
            return {
              ...section,
              products: response.data,
            };
          })
        );
        setSections(updatedSections);
      } catch (error) {
        console.error('Error fetching products for sections:', error);
      }
    };
    setIsLoaded(true);
    fetchProductsForSections();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBrandsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is in view
    );

    if (brandsSectionRef.current) {
      observer.observe(brandsSectionRef.current);
    }

    return () => {
      if (brandsSectionRef.current) {
        observer.unobserve(brandsSectionRef.current);
      }
    };
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBestVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is in view
    );

    if (bestSellersSectionRef.current) {
      observer.observe(bestSellersSectionRef.current);
    }

    return () => {
      if (bestSellersSectionRef.current) {
        observer.unobserve(bestSellersSectionRef.current);
      }
    };
  }, [])

   // Observe each brand card
   useEffect(() => {
    const brandObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBrandVisible((prev) => [...prev, entry.target.dataset.index]);
            brandObserver.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.brand-card').forEach((card, index) => {
      brandObserver.observe(card);
      card.dataset.index = index; // Add index as data attribute for tracking
    });

    return () => brandObserver.disconnect();
  }, []);

  // Set up Intersection Observer for each section
  useEffect(() => {
    const observers = [];

    sectionsData.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            ref.classList.remove('opacity-0', 'translate-y-10');
            ref.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  return (
    <>
      {formVisibility && <TypeForm />}
      <NavBar className="z-50" />
      <div className="relative hero h-screen w-full flex flex-col">
        {/* Mobile View */}
        <img
          src="/images/phone_design_2.png"
          className="sm:hidden w-full h-full object-cover transform translate-x-full opacity-0 transition-all duration-700 ease-out"
          onLoad={(e) => {
            e.currentTarget.classList.remove('translate-x-full', 'opacity-0');
          }}
          alt="Phone Design"
        />
        {/* Desktop View */}
        <div className="w-full h-full hidden sm:flex">
          <img
            src="/images/model_1.png"
            className={`w-full h-full object-cover object-top transform transition-transform duration-1000 transition-opacity ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
            alt="Model 1"
          />
          <img
            src="/images/model_2.png"
            className={`w-full h-full object-cover object-top transform -scale-x-100 transition-transform duration-1000 transition-opacity ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
            alt="Model 2"
          />
        </div>
        <div className="absolute inset-0 flex flex-col gap-10 items-center justify-start sm:justify-center z-10">
          <button
            className="absolute bottom-[35vh] md:static z-10 flex gap-4 shadow-xl text-[30px] md:text-[50px] bg-white text-black items-center rounded-full px-8 py-4 transition-transform duration-500 ease-in-out hover:scale-110"
            onClick={() => setFormVisibility(true)}
            style={{
              animation: "pulseOpacity 2s ease-in-out infinite",
            }}
          >
            <FaSearch /> Find Thobe
          </button>
        </div>
      </div>

      <div
        ref={bestSellersSectionRef}
        className={`flex flex-col w-full items-center py-10 transition-opacity duration-1000 transform ${
          isBestVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-[30px]">Best Sellers</h1>
        <p className="text-lg font-light text-center md:max-w-[800px] max-w-[89%]">
          We bring you the best brands that embody quality, innovation, and style.
        </p>
      </div>

      {/* Render Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => (sectionsData.current[index] = el)}
          className="w-[90%] sm:w-[80%] m-auto opacity-0 transform translate-y-10 transition-all duration-700 ease-out"
        >
          {/* Swiper Slider */}
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={5}
            slidesPerView={4.4}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              320: {
                slidesPerView: 2.4,
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
            {section.products.map((product, idx) => (
              <SwiperSlide key={idx}>
                <div className="cursor-pointer flex-shrink-0">
                  <div className="group relative overflow-hidden flex items-center justify-center p-0 bg-white z-10">
                    <Link to={`/products/${product.product_id}`}>
                      <button className="p-2 sm:p-3 text-[15px] sm:text-[20px] bg-white font-medium text-black shadow-lg w-full shadow-inner border-t border-x">
                        £{product.price}
                      </button>
                      <img
                        src={product.image_url}
                        className="md:h-[300px] h-[250px] object-cover w-full object-top"
                        alt={product.product_name}
                      />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Link to={`/products/search?categoryIds=${section.categoryIds.join(',')}`}>
          <div className="border-x-2 flex items-center border-b-2 shadow-lg mb-10"
            >
            <div className="w-full h-[80px] sm:h-[100px] flex items-center px-3">
              <div className="w-1/2">
                <h1 className="text-[18px] sm:text-[35px] text-center font-medium uppercase">
                  {section.englishTitle.replaceAll('_', ' ')}
                </h1>
              </div>
              <div
                id="block"
                className="mx-2 h-full w-px sm:w-[4px] rounded-full bg-gray-500"
              />
              <div className="w-1/2">
                <h1 className="text-[20px] sm:text-[40px] text-center font-medium uppercase">
                  {section.arabicTitle}
                </h1>
              </div>
            </div>
          </div>
          </Link>
        </section>
      ))}

      <div
        ref={brandsSectionRef}
        className={`flex flex-col w-full items-center py-10 transition-opacity duration-1000 transform ${
          isBrandsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-[30px]">Our Brands</h1>
        <p className="text-lg font-light text-center md:max-w-[800px] max-w-[89%]">
          We bring you the best brands that embody quality, innovation, and style.
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 m-auto bg-[#F6F5F8] px-[10px] py-[30px] mb-[40px] mt-5">
        {brands.map((brand, index) => (
          <Link to={`/products/search?categoryIds=${brand.id}} key={index`}>
            <div
              className={`brand-card relative pb-[100%] flex items-center justify-center bg-gray-200 rounded-[0px] overflow-hidden hover:cursor-pointer group transition-all duration-700 ease-out transform ${
                brandVisible.includes(index.toString())
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
            >
              <img
                src={brand.image_url}
                className="absolute top-0 left-0 object-cover transition-transform duration-500 ease-in-out group-hover:scale-[120%]"
                alt={`${brand.english} | ${brand.arabic}`}
                style={{ objectPosition: "top center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-2"></div>
              <h1 className="text-white text-[35px] md:[40px] font-bold text-center absolute bottom-5 z-10">
                {brand.english} | {brand.arabic}
              </h1>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Home;
