import { useState, useEffect } from "react";
import "./Hero.css"

/* =========================================
HERO SLIDER COMPONENT
========================================= */

function Hero(){

  /* -----------------------------------------
  STATE: track current slide index
  ----------------------------------------- */
  const [currentIndex, setCurrentIndex] = useState(0);

  /* -----------------------------------------
  SLIDES DATA (instead of HTML hardcoding)
  ----------------------------------------- */
  const slides = [
    {
      bg: "images/products/slider-bg-01.webp",
      img: "images/products/slider-image-01.webp",
      title: "URBAN BACKPACK",
      subtitle: "AMAZING PRODUCT!",
      desc: "Premium quality backpack designed for travel and everyday use.",
      btn: "Shop Now"
    },
    {
      bg: "images/products/slider-bg-02.webp",
      img: "images/products/slider-image-02.webp",
      title: "TRAVEL SERIES",
      subtitle: "NEW COLLECTION",
      desc: "Lightweight, durable and stylish backpacks for explorers.",
      btn: "Explore"
    }
  ];

  /* -----------------------------------------
  NEXT SLIDE FUNCTION
  ----------------------------------------- */
  function nextSlide(){
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }

  /* -----------------------------------------
  GO TO SPECIFIC SLIDE
  ----------------------------------------- */
  function goToSlide(index){
    setCurrentIndex(index);
  }

  /* -----------------------------------------
  AUTO PLAY (REPLACES setInterval logic)
  ----------------------------------------- */
  useEffect(() => {

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    /* cleanup (important in React) */
    return () => clearInterval(interval);

  }, []);

  return(

    <section className="hero">

      <div
        className="slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >

        {/* -----------------------------------------
        MAP SLIDES (React replaces loop)
        ----------------------------------------- */}
        {slides.map((slide, index) => (

          <div
            key={index}
            className="slide"
            style={{ backgroundImage: `url(${slide.bg})` }}
          >

            <div className="slide-content">

              <h4>{slide.subtitle}</h4>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>

              <button className="btn">
                {slide.btn}
              </button>

            </div>

            <img src={slide.img} alt="product" />

          </div>

        ))}

      </div>


      {/* -----------------------------------------
      DOTS (React version of dynamic dots)
      ----------------------------------------- */}
      <div className="dots">

        {slides.map((_, index) => (

          <span
            key={index}
            className={currentIndex === index ? "active-dot" : ""}
            onClick={() => goToSlide(index)}
          ></span>

        ))}

      </div>

    </section>
  );
}

export default Hero;