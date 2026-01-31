const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&q=80" 
          alt="Latest smartphone technology" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="">
        <h2 className="text-sm font-normal text-foreground mb-1">
          Next Generation
        </h2>
        <p className="text-sm font-light text-foreground">
          Premium smartphones with cutting-edge technology
        </p>
      </div>
    </section>
  );
};

export default LargeHero;
