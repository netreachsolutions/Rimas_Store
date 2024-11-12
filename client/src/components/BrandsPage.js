import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import NavBar from "./NavBar";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const Brands = () => {
  const [products, setProducts] = useState([
    {
      category_ID: 1,
      category_name: "Rabbit",
      items: [
        {
          product_id: 1,
          product_name: "Rabbit Kamel",
          image_Url: "/images/italian.jpg",
        },
        {
          product_id: 2,
          product_name: "Rabbit Kamel",
          image_Url: "/images/italian.jpg",
        },
        {
          product_id: 3,
          product_name: "Rabbit Kamel",
          image_Url: "/images/italian.jpg",
        },
        {
          product_id: 4,
          product_name: "Rabbit Kamel",
          image_Url: "/images/italian.jpg",
        },
      ],
    },
  ]);

  useEffect(() => {
    setProducts([
      {
        category_ID: 1,
        category_name: "Lame",
        items: [
          {
            product_id: 1,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 2,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 3,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 4,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 5,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 1,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 2,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 3,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 4,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
          {
            product_id: 5,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian_lame.jpg",
          },
        ],
      },
      {
        category_ID: 2,
        category_name: "Normal",
        items: [
          {
            product_id: 1,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 2,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 3,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 4,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 5,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 1,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 2,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 3,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 4,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
          {
            product_id: 5,
            product_name: "Rabbit Kamel",
            image_Url: "/images/italian.jpg",
          },
        ],
      }
      
    ]);
  }, []);

  return (
    <>
      {/* <NavBar />
      <main className="flex flex-col gap-10 mb-20"> */}
        {products.map((category, index) => (
                    <section className="w-[80%] m-auto">
                    <div className="category_title text-left">
                      <h1 className="text-[30px]">{category.category_name}</h1>
                      <div className="w-full h-[1px] bg-gray-400 mb-2" />
                      <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={20}
                        slidesPerView={4.4}
                        navigation
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        loop={true}
                        breakpoints={{
                          // For small screens, show 1-2 slides
                          320: {
                            slidesPerView: 1.6,
                          },
                          480: {
                            slidesPerView: 2.4,
                          },
                          // For tablet screens, show 2-3 slides
                          768: {
                            slidesPerView: 3,
                          },
                          // For desktops, show 4 slides
                          1024: {
                            slidesPerView: 4.4,
                          },
                        }}
                        className="mySwiper"
                      >
                {category.items.map((product, index) => (
                    <SwiperSlide key={index}>
                    <div className="cursor-pointer flex-shrink-0">
                        <div className="group relative overflow-hidden flex items-center justify-center p-0 rounded-t-[20px] bg-[#F6F5F8] z-10">
                        <div className="animation bg-red absolute top-[-3rem] left-[50%] skew-x-[-15deg] translate-x-[-50%] z-[-1] opacity-0 transition duration-300 group-hover:opacity-100"></div>
                        <img
                            src={product.image_Url}
                            className="md:h-[230px] h-[150px]"
                            alt=""
                        />
                        </div>
                        <div className="price-section mt-4">
                        <h4 className="lg:text-[20px] text-[18px] font-primary uppercase font-bold text-black">
                            {product.product_name}
                        </h4>
                        <p className="font-primary font-medium text-red">£12.99</p>
                        <a href={""} target="_blank" rel="noopener noreferrer">
                            <button className="uppercase font-primary w-full block py-2 font-medium mt-3 text-white bg-black transition duration-300 hover:bg-red hover:scale-105">
                            <span className="flex items-center justify-center">
                                buy now{" "}
                                <MdOutlineKeyboardDoubleArrowRight className="inline text-[20px] -translate-y-[1px]" />
                            </span>
                            </button>
                        </a>
                        </div>
                    </div>
                    </SwiperSlide>
                ))}
                {/* <SwiperSlide>
                    <div className="relative flex-shrink-0 w-full h-full top-0 right-0 flex items-center justify-center rounded-[20px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray to-black opacity-100"></div>
                    <div className="absolute flex items-center justify-center w-full h-full text-center">
                        <div className="flex text-white text-[24px] items-center h-[50px] hover:cursor-pointer">
                        <h4 className="font-bold">See All</h4>
                        <MdOutlineKeyboardDoubleArrowRight className="text-[30px] translate-y-1" />
                        </div>
                    </div>
                    </div>
                </SwiperSlide> */}
                </Swiper>
            </div>
            </section>
        ))}
      {/* </main> */}
    </>
  );
};

export default Brands;