import React from "react";
import Carousel from "@/Components/home/Carousel";
import About from "@/Components/home/About";
import Gallery from "@/Components/home/Gallery";
import Schedule from "@/Components/home/Schedule";

const HomePage = () => {
    return (
        <div className="">
            <section id="home">
                <Carousel />
            </section>

            <section id="about">
                <About />
            </section>

            <section id="gallery">
                <Gallery />
            </section>

            <section id="schedule">
                <Schedule />
            </section>
        </div>
    );
};

export default HomePage;
