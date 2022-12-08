import { navigate } from "gatsby";
import React, { useEffect } from "react";

const MapsPage = (): JSX.Element => {
  useEffect(() => {
    navigate(`/maps/bank`);
  }, []);
  return <div />;
};

export default MapsPage;
