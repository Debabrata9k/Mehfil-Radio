import React from "react";
import { useParams } from "react-router";
import gsap from "gsap";
function play() {
  const { id } = useParams();
  gsap.to("title",{
    translateX:200,

  })
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-zinc-800 w-72  rounded-2xl flex flex-col p-7 overflow-hidden">
        <div className="h-40 w-auto bg-zinc-400 rounded-2xl mb-7 overflow-hidden">
          <img
            src="https://picsum.photos/seed/picsum/200/300"
            alt=""
            className="w-full h-full"
          />
        </div>
        <p className="text-white font-bold text-[20px] w-full h-40 text-nowrap  title">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi veniam
          eligendi voluptatibus minima sequi? Cupiditate nemo laborum eum
          placeat aspernatur?
        </p>
        <div className=" h-2 w-full bg-zinc-500 rounded-2xl"></div>
      </div>
    </div>
  );
}

export default play;
