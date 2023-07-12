import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import PropTypes from 'prop-types';
import SortableItem from './SortableItem';
import List from '@material-ui/core/List';

const SortableLists = ({ items, baseLink, onDelete }) => {
	return (
		<List>
			{Array.isArray(items) &&
				items.map((item, index) => (
					<SortableItem
						key={'item-' + index}
						index={index}
						value={item}
						baseLink={baseLink}
						onDelete={onDelete}
					/>
				))}
		</List>
	);
};

SortableLists.propTypes = {
	items: PropTypes.array.isRequired,
	onDelete: PropTypes.func.isRequired,
	baseLink: PropTypes.string.isRequired
};

export default SortableContainer(SortableLists);
