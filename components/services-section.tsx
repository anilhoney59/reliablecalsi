import React from "react";
import ServiceCard from "./ui-components/service-card";
import { servicesItem } from "../utils/content";

type Props = {};

export default function ServicesSection({}: Props) {
  return (
    <>
      <div className="layout-container my-20" id="#services">
        <h2 className="text-5xl font-semibold text-primary-orange">
          We provide <br /> range of services
        </h2>

        <div className="my-10 grid grid-cols-1 md:grid-cols-4 gap-5 justify-between">
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
