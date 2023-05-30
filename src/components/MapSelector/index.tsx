import { useMaps } from "@/contexts/MapsContext";
import { navigate } from "gatsby";
import React, { FC, useState } from "react";

import MapSelectorButton from "./MapSelectorButton";
import MapSelectorMenu from "./MapSelectorMenu";

const MapSelector: FC = () => {
  const { selectedMap } = useMaps();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onMapSelected = (mapSlug: string) => {
    navigate(`/maps/${mapSlug}`);
  };

  return (
    <>
      <MapSelectorButton
        text={selectedMap?.name ?? ""}
        isMenuOpen={isMenuOpen}
        onClick={onButtonClick}
      />
      <MapSelectorMenu
        anchorEl={anchorEl}
        isMenuOpen={isMenuOpen}
        onClose={onClose}
        onMapSelected={onMapSelected}
      />
    </>
  );
};

export default MapSelector;
