import React from 'react';

import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		marginBottom: 5
	},
	bulletPoint: {
		width: 10,
		fontSize: 10
	},
	itemContent: {
		flex: 1,
		fontSize: 10
	},
	paragraph: {
		textAlign: 'justify',
		fontSize: 11,
		textIndent: 20
	},
	header3: {
		fontWeight: 'bold',
		fontSize: 14,
		color: '#af1d2d',
		marginBottom: 10,
		marginTop: 10
	},
	bold: {
		fontFamily: 'Helvetica-Bold'
	}
});

export const List = ({ children }) => children;

export const Item = ({ children }) => (
	<View style={styles.item}>
		<Text style={styles.bulletPoint}>•</Text>
		<Text style={styles.itemContent}>{children}</Text>
	</View>
);

export const P = ({ children }) => (
	<View>
		<Text style={styles.paragraph}>{children}</Text>
	</View>
);

export const H3 = ({ children }) => (
	<View>
		<Text style={styles.header3}>{children}</Text>
	</View>
);

export const B = ({ children }) => <Text style={styles.bold}>{children}</Text>;

export const BR = ({ children }) => (
	<Text>
		{children}
		{'\n\n'}
	</Text>
);
