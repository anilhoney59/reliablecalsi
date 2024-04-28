import React from "react";
import ServiceCard from "./ui-components/service-card";
import { servicesItem } from "../utils/content";

type Props = {};

export default function ServicesSection({}: Props) {
  return (
    <>
      <div className="layout-container mt-20" id="#services">
        <h2 className="text-3xl font-semibold text-primary-orange md:mb-10 md:text-5xl">
          We provide <br /> range of services
        </h2>

        <div className="my-10 grid grid-cols-1 justify-between gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {servicesItem.map((item, index) => {
            return (
              <ServiceCard
                width={item.width}
                height={item.height}
                key={index}
                title={item.title}
                description={item.description}
                imgSrc={item.imgSrc}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
