import { useMaps } from "@/contexts/MapsContext";
import { navigate } from "gatsby";
import React, { FC, useState } from "react";

import MapSelectorButton from "./MapSelectorButton";
import MapSelectorMenu from "./MapSelectorMenu";

const MapSelector: FC = () => {
  const { selectedMap } = useMaps();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(isMenuOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && isMenuOpen === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = isMenuOpen;
  }, [isMenuOpen]);

  const handleButtonClick = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  const onClickAway = (event: MouseEvent | TouchEvent) => {
    console.log("onClickAway")
    event.preventDefault();
    return 
    if (!isMenuOpen || anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setMenuOpen(false);
  };

  const onMapSelected = (mapSlug: string) => {
    setMenuOpen(false);
    navigate(`/maps/${mapSlug}`);
  };

  return (
    <div>
      <MapSelectorButton
        ref={anchorRef}
        text={selectedMap?.name ?? ""}
        isMenuOpen={isMenuOpen}
        onClick={handleButtonClick}
      />

      <MapSelectorMenu
        anchorEl={anchorRef.current}
        isMenuOpen={isMenuOpen}
        onClickAway={onClickAway}
        onMapSelected={onMapSelected}
      />
    </div>
  );
};

export default MapSelector;
