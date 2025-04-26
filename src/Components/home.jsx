import React from 'react';
import Comments from './comments.jsx';
import Navigation from './Navigation.jsx';


function Home() {
    const suggestedItems = Array(7).fill({
        title: "Keto Salad",
        image: "/assets/salad.png",
        description: "Beans & fruits",
        rating: 4.9,
        star: "/assets/Star Filled.png",
      })
      const benefitsOfItems = Array(7).fill({
        title: "Keto Salad",
        image: "/assets/salad.png",
        benefit: "Beans & fruits",
        rating: 4.9,
        star: "/assets/Star Filled.png",
      })
    
    return (
        <div className="flex flex-col gap-20 p-4 mx-auto px-4 md:px-20 ">

        <div className="suggestionSection flex flex-col">
          <div className="flex justify-between">
            <div className="suggestionTitle">
              <h2>Healthy Recipes</h2>
              <h3 className="text-mainTheme">with features</h3>
            </div>
            <h4 className="text-gray-500 text-sm">See all</h4>
          </div>

          {/* Cards */}
          <div
            className="
            suggestionItems 
            flex flex-wrap gap-4 
            justify-between
            md:justify-center
          "
          >
            {suggestedItems.slice(0, 8).map((item, index) => (
              <div
                key={index}
                className={`
                  suggestionCard relative w-[47%] h-[250px] pt-[80px]
                  sm:w-[30%]
                  md:w-[190px]
                  ${index >= 2 ? "max-[450px]:hidden" : ""}
                  ${index >= 3 ? "max-[1600px]:hidden" : ""}
                `}
              >
                <div className="absolute top-[-30px] left-1/2 transform w-[270px] h-[250px] -translate-x-1/2 z-10">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="object-cover" />
                </div>

                <div className="bg-white rounded-t-[50px] rounded-b-[30px] h-full shadow-lg flex flex-col p-4 pt-23">
                  <h3 className="font-medium text-lg text-center">{item.title}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-gray-500 text-[13px]">{item.description}</p>
                    <div className="rating bg-mainTheme flex items-center px-2 py-0.5 rounded-full text-xs">
                      <img src={item.star || "/placeholder.svg"} alt="Star" className="w-3 h-3 mr-1" />
                      <span className="font-semibold">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
        
        <div className="benefitsSection px-4 md:px-10 py-10">
        {/* Header */}
        <div className="benefitsTitle mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-mainTheme text-xl font-semibold">with benefits</h3>
            <h4 className="text-gray-500 text-sm cursor-pointer">See all</h4>
          </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <img src="/assets/learn how to become a master chef.png" alt="" 
          className="sm:hidden"
          />
            {/* Left Column - Benefit Cards */}
            <div className="flex flex-col gap-10">
              {[
                {
                  title: "Mung bean Salad",
                  desc: "Reduce Chronic Disease Risk",
                  img: "/assets/mung bean salad.png",
                  rating: "4.3"
                },
                {
                  title: "Pasta Salad",
                  desc: "Protects against cancer",
                  img: "/assets/pasta salad.png",
                  rating: "4.1"
                },
                {
                  title: "Tuna Salad",
                  desc: "Helps with Blood Pressure",
                  img: "/assets/tuna salad.png",
                  rating: "4.8"
                },
                {
                  title: "Caesar Salad",
                  desc: "Boosts Immunity System",
                  img: "/assets/caesar salad.png",
                  rating: "3.4"
                },
                {
                  title: "Caesar Salad",
                  desc: "Boosts Immunity System",
                  img: "/assets/caesar salad.png",
                  rating: "3.4"
                }
              ].map((item, index) => (
                <div key={index} className="benefitCard flex items-center gap-3 p-3 bg-white rounded-xl shadow-md w-full">
                  <img src={item.img} alt={item.title} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{item.title}</h3>
                    <h4 className="text-sm text-gray-500">{item.desc}</h4>
                  </div>
                  <div className="rating bg-mainTheme flex items-center px-2 py-1 rounded-full text-xs text-white">
                    <img src="/assets/Star Filled.png" alt="Star" className="w-3 h-3 mr-1" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/*  Learn Card and Weekly Pick */}
            <div className="flex flex-col gap-6 col-span-1 md:col-span-1 w-full">
              {/* Learn to be a chef */}
            <img src="/assets/learn how to become a master chef.png" alt=""
            className="hidden sm:block "
            />

              {/* Weekly Pick */}
              <div
              className="weeklyPick relative text-white flex flex-col w-full h-[300px] px-4 py-10 sm:p-10 justify-between bg-cover bg- bg-center bg-no-repeat rounded-xl "
              style={{
                backgroundImage: "url('/assets/WeeklyPicImage.png')", // Ensure this path works with your bundler
              }}
            >
              <div className="flex justify-between w-full">
                <img src="/assets/like.svg" alt="" 
                className="w-[50px] h-auto cursor-pointer"
                />
                <button className="px-4 py-1 h-[40px] bg-mainTheme rounded-xl text-white font-bold text-sm cursor-pointer">Start cook</button>
              </div>

              <div className="mt-auto ">
                <h3 className="text-2xl font-bold text-white py-4">Weekly pick</h3>
                <p className="text-m">This pumpkin cream soup will warm up the feintest of hearts.</p>
              </div>
            </div>

            </div>
          </div>
        </div>

        <Comments />
      </div>
    )
}

export default Home;