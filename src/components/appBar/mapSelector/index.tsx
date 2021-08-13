import { navigate } from "gatsby";
import React, { useContext, useState } from "react";
import { MapsContext, SelectedMapContext } from "../../contexts/mapsContext";
import MapSelectorButton from "./mapSelectorButton";
import MapSelectorMenu from "./mapSelectorMenu";

const MapSelector = () => {
  const maps = useContext(MapsContext);
  const selectedMapId = useContext(SelectedMapContext);
  const selectedMap = maps.find((map) => map.id === selectedMapId);

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

  const onClickAway = (event: React.MouseEvent<EventTarget>) => {
    if (
      !isMenuOpen ||
      anchorRef.current?.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setMenuOpen(false);
  };

  const onMapSelected = (mapId) => {
    setMenuOpen(false);
    navigate(`/maps/${mapId}`);
  };

  return (
    <div>
      <MapSelectorButton
        ref={anchorRef}
        text={selectedMap?.name}
        isMenuOpen={isMenuOpen}
        onClick={handleButtonClick}
      />

      <MapSelectorMenu
        anchorEl={anchorRef.current}
        isMenuOpen={isMenuOpen}
        maps={maps}
        selectedMapId={selectedMapId}
        onClickAway={onClickAway}
        onMapSelected={onMapSelected}
      />
    </div>
  );
};

export default MapSelector;
