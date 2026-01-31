import { Link } from "react-router-dom";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/accessories" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" 
                alt="Phone accessories" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Accessories
            </h3>
            <p className="text-sm font-light text-foreground">
              Essential accessories to enhance your mobile experience
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link to="/category/chargers" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80" 
                alt="Wireless chargers and power banks" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Power Solutions
            </h3>
            <p className="text-sm font-light text-foreground">
              Fast chargers and power banks for on-the-go charging
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneThirdTwoThirdsSection;
