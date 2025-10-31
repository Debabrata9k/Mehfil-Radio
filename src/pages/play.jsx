import React from "react";
import { useParams } from "react-router";
function play() {
  const { id } = useParams();
  return <div className="w-full h-full">{id}</div>;
}

export default play;
