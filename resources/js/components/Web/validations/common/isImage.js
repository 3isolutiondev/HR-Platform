export const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg';
export const imageMaxSize = 1000000; // bytes
export const imageSize = imageMaxSize / 1000000;
export const acceptedFileTypesArray = acceptedFileTypes.split(',').map((item) => {
	return item.trim();
});
export function verifyFile(files) {
	if (files && files.length > 0) {
		const currentFile = files[0];
		const currentFileType = currentFile.type;
		const currentFileSize = currentFile.size;
		if (currentFileSize > imageMaxSize) {
			return false;
		}
		if (!acceptedFileTypesArray.includes(currentFileType)) {
			return false;
		}
		return true;
	}
}
