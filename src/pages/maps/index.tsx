import React, { useEffect } from "react";
import { navigate } from "gatsby";

const MapsPage = () => {
  useEffect(() => navigate(`/maps/bank`), [])
  return <div />
};

export default MapsPage;
