import { Link } from "react-router-dom";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link to="/category/phones" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" 
                alt="Smartphones collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Flagship Phones
            </h3>
            <p className="text-sm font-light text-foreground">
              The latest flagship devices with powerful performance
            </p>
          </div>
        </div>

        <div>
          <Link to="/category/cases" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80" 
                alt="Phone cases collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Premium Cases
            </h3>
            <p className="text-sm font-light text-foreground">
              Protective cases with sleek, modern designs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;
