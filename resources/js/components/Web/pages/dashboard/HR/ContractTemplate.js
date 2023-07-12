import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import WysiwygField from '../../../common/formFields/WysiwygField';
import isEmpty from '../../../validations/common/isEmpty';

const ContractTemplate = ({ data, onChange }) => {
	const { isEdit, errors, isValid, title, position, name_of_ceo, position_of_ceo, template, signature } = data;
	return (
		<Grid container spacing={16}>
			<Grid item xs={6}>
				<TextField
					id="position"
					label="Position"
					autoComplete="position"
					autoFocus
					margin="dense"
					required
					fullWidth
					name="position"
					value={position}
					onChange={onChange}
					error={!isEmpty(errors.position)}
					helperText={errors.position}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					id="title"
					label="Title"
					autoComplete="title"
					autoFocus
					margin="dense"
					required
					fullWidth
					name="title"
					value={title}
					onChange={onChange}
					error={!isEmpty(errors.title)}
					helperText={errors.title}
				/>
			</Grid>

			<Grid item xs={12}>
				<WysiwygField
					label="Contracts"
					margin="dense"
					name="template"
					value={template}
					onChange={onChange}
					error={errors.template}
				/>
			</Grid>
			{/* <Grid item xs={12}>
							<DropzoneFileField
								label="Signature"
								margin="dense"
								name="signature"
								onUpload={this.onUpload}
								collectionName="signature"
								apiURL={'/api/hr-contract-templates/upload-logo'}
								filesLimit={6}
								acceptedFiles={[ 'image/jpg', 'image/png', 'image/jpeg', 'application/pdf' ]}
							/>
						</Grid>
						*/}
			<Grid item xs={12}>
				<TextField
					id="name_of_signature"
					label="Name Of Signature"
					autoComplete="name_of_signature"
					autoFocus
					margin="dense"
					required
					fullWidth
					name="name_of_ceo"
					value={name_of_ceo}
					onChange={onChange}
					error={!isEmpty(errors.name_of_ceo)}
					helperText={errors.name_of_ceo}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					id="position_of_signature"
					label="Position Of Signature"
					autoComplete="position_of_signature"
					autoFocus
					margin="dense"
					required
					fullWidth
					name="position_of_ceo"
					value={position_of_ceo}
					onChange={onChange}
					error={!isEmpty(errors.position_of_ceo)}
					helperText={errors.position_of_ceo}
				/>
			</Grid>
		</Grid>
	);
};

export default ContractTemplate;
