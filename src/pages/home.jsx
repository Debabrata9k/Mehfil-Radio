import React from "react";
import Profile from "../../public/main.png";
function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="w-full h-full bg-blue-200">
        <h2 className="font-black-600 font-mono italic text-2xl">
          MEHFIL-RADIO
        </h2>
        <p>Music Player</p>
      </div>
      <div className="shadow-lg rounded-sm border border-grey-600">
        <div className="h-40 w-50 rounded-2xl p-5 overflow-hidden">
          <img src="https://picsum.photos/id/237/200/300" className="rounded-xl" alt="Picture"></img>
        </div>
        <h2 className="text-center">Title</h2>
        <div className="w-full flex justify-center items-center flex-col">
          <button className="w-10 bg-blue-600 rounded-lg">PLAY</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
