import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class ImageCrop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			crop: {
				aspect: 1 / 1
			},
			croppedImageUrl: ''
		};
		this.onImageLoaded = this.onImageLoaded.bind(this);
		this.onCropComplete = this.onCropComplete.bind(this);
		this.onCropChange = this.onCropChange.bind(this);
		this.handleCrop = this.handleCrop.bind(this);
		this.makeClientCrop = this.makeClientCrop.bind(this);
		this.getCroppedImg = this.getCroppedImg.bind(this);
	}

	onImageLoaded(image) {
		this.imageRef = image;
	}
	onCropComplete(crop) {
		this.makeClientCrop(crop);
	}
	onCropChange(crop, percentCrop) {
		this.setState({ crop });
	}
	handleCrop() {
		this.props.handleCrop(this.state.croppedImageUrl);
	}

	async makeClientCrop(crop) {
		if (this.imageRef && crop.width && crop.height) {
			const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, this.props.name);
			this.setState({ croppedImageUrl });
		}
	}

	getCroppedImg(image, crop, fileName) {
		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext('2d');

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);
		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				blob.name = fileName;
				resolve(blob);
			}, 'image/jpeg');
		});
	}

	render() {
		const { crop, croppedImageUrl } = this.state;
		return (
			<Grid container spacing={24}>
				<Grid item xs={6} sm={6}>
					<ReactCrop
						src={this.props.src}
						crop={crop}
						onImageLoaded={this.onImageLoaded}
						onComplete={this.onCropComplete}
						onChange={this.onCropChange}
					/>
					{croppedImageUrl && (
						<Button onClick={this.handleCrop} size="small" color="primary" style={{ marginTop: 0 }}>
							Crop
						</Button>
					)}
				</Grid>
				<Grid item xs={6} sm={6}>
					{croppedImageUrl && (
						<img
							alt="Crop"
							style={{ width: '100%' }}
							src={croppedImageUrl ? URL.createObjectURL(croppedImageUrl) : ''}
						/>
					)}
				</Grid>
			</Grid>
		);
	}
}

export default ImageCrop;
