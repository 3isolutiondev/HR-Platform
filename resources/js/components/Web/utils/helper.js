// import _ from 'lodash';
// import { setFlagsFromString } from 'v8';
import isEmpty from '../validations/common/isEmpty'

export function ucfirst(string) {
	if (isNaN(string)) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	return string;
}

export function isImage(uri) {
	//make sure we remove any nasty GET params
	uri = uri.split('?')[0];
	//moving on now
	var parts = uri.split('.');
	var extension = parts[parts.length - 1];
	var imageTypes = [ 'jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp', 'webp' ];
	if (imageTypes.indexOf(extension.toLowerCase()) !== -1) {
		return true;
	}
	return false;
}

export function isPdf(uri) {
	//make sure we remove any nasty GET params
	uri = uri.split('?')[0];
	//moving on now
	var parts = uri.split('.');

	var extension = parts[parts.length - 1];
	var imageTypes = [ 'pdf' ];
	if (imageTypes.indexOf(extension.toLowerCase()) !== -1) {
		return true;
	}

	return false;
}

export function pluck(array, key) {
	return array.map((ob) => ob[key]);
}

export function printIfExist(fn, defaultVal) {
	try {
		return fn();
	} catch (e) {
		return defaultVal;
	}
}

export function isJSON(item) {
	item = typeof item !== 'string' ? JSON.stringify(item) : item;

	try {
		item = JSON.parse(item);
	} catch (e) {
		return false;
	}

	if (typeof item === 'object' && item !== null) {
		return true;
	}

	return false;
}

export function searchStringOfArray(array_of_strings, keyword) {
	for (var i = 0; i < array_of_strings.length; i++) {
		let stringElement = array_of_strings[i].toLowerCase();

		if (stringElement.indexOf(keyword) === 0) return i;
	}
	return -1;
}

// export const trans = (key, data) => {
// 	const splitKey = key.split('.');
// 	import('../lang/en/' + splitKey[0]).then((langFile) => {
// 		const message = Object.keys(data).forEach((str_replace_index) => {
// 			let msg = _.get(langFile, splitKey.slice(1).join());
// 			return msg.replace(':' + str_replace_index, data[str_replace_index]);
// 		});
// 		return message;
// 	});
// 	// langFile.then(() => {
// 	// });
// 	// let returnedText = langFile[splitKey[1]].replace()
// };

// checkUserIsHiringManager, need loggedInUser data and job data
export const checkUserIsHiringManager = (currentUser, job) => {
  let isAssign = false;

  if (currentUser.isIMMAPER) {
    if (!isEmpty(currentUser)) {
      if (!isEmpty(currentUser.data)) {
        if (!isEmpty(currentUser.data.immap_email)) {
          if (job['job_manager'].length > 0) {
            const email_in_charge = pluck(job['job_manager'], 'email');
            isAssign = email_in_charge.includes(currentUser.data.immap_email) ? true : false;
          }
        }
      }
    }
  }

  return isAssign;
}

export function arrowGenerator(color) {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${color} transparent`,
      },
    },
    '&[x-placement*="bottom-start"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      marginRight: '0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${color} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${color} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${color} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${color}`,
      },
    },
  };
}

//function to check if the itinerary has at least one vehicle as transportation type
export const checkTransportationByVehicle = (itineraries) => {
  let check = itineraries.filter(itinerary => {
       return itinerary.travelling_by === 'Vehicle';
  }).length > 0;
   
  return check;
}
