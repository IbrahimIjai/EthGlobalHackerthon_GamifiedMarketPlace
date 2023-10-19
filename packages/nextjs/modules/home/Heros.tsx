import React from "react";
import CollectionBill from "./CollectionBill";
import { A11y, Autoplay, Pagination } from "swiper";
import "swiper/css/a11y";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.css";
import { collections } from "~~/utils/collections";

export default function Heros() {
  return (
    <Swiper
      modules={[A11y, Autoplay, Pagination]}
      pagination={{
        clickable: true,
      }}
      loop
      slidesPerView={1}
      autoplay={{
        delay: 6000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      }}
    >
      {collections.map((collection, i) => {
        return (
          <SwiperSlide key={i}>
            <CollectionBill
              image={collection.bannerImage}
              collectionName={collection.name}
              contractAddress={collection.contract}
              description={collection.description}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
