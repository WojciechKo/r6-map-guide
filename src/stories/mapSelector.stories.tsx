import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MapSelector from '../components/AppBar/MapSelector';
import { MapsContext, SelectedMapContext } from "../../../contexts/MapsContext";

export default {
  title: 'Components/MapSelector',
  component: MapSelector,
} as ComponentMeta<typeof MapSelector>;

const Template: ComponentStory<typeof MapSelector> = (args) => <MapSelector {...args} />;

export const DefaultMapSelctor = Template.bind({});
DefaultMapSelctor.args = {};