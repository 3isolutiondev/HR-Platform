import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import PropTypes from 'prop-types';
import RosterStepSortableItem from './RosterStepSortableItem';
import List from '@material-ui/core/List';

const RosterStepSortableLists = ({ items, onDelete }) => {
	return (
		<List>
			{Array.isArray(items) &&
				items.map((item, index) => (
					<RosterStepSortableItem
						key={'item-' + index}
						stepIndex={index}
						index={index}
						value={item}
						onDelete={onDelete}
					/>
				))}
		</List>
	);
};

RosterStepSortableLists.propTypes = {
	items: PropTypes.array.isRequired,
	onDelete: PropTypes.func.isRequired
};

export default SortableContainer(RosterStepSortableLists);
