import { SECURITY_ON_CHANGE, TRAVEL_APPROVAL_REQUESTS } from '../../types/security-module/securityTypes'
import axios from 'axios'
import { addFlashMessage } from '../webActions';
import { onChange as filterOnChange } from './securityFilterActions';
import { defaultApprovedTravel } from '../../../config/general';
import moment from 'moment';
import FileDownload from 'js-file-download';
import isEmpty from '../../../validations/common/isEmpty';

// Update specific security page data on reducer
export const onChange = (name, value) => {
  return {
    type: SECURITY_ON_CHANGE,
    name,
    value
  }
}

// Get Travel Request data
export const getTravelRequests = () => (dispatch, getState) => {
  let { queryParams, firstTime } = getState().security
  const { current_page } = getState().securityFilter;
  
  if (firstTime) {
    dispatch(onChange('firstTime', false));
  }
  dispatch(onChange('isLoading', true));
  return axios.get('/api/security-module/travel-requests' + queryParams + "&page=" + current_page)
    .then(res => {
      dispatch(filterOnChange('current_page', res.data.data.current_page));
      dispatch(filterOnChange('last_page', res.data.data.last_page));
      dispatch(filterOnChange('totalCount', res.data.data.total));
      dispatch(onChange('travel_requests', res.data.data.data));
      return dispatch(onChange('isLoading', false));
    })
    .catch(err => {
      dispatch(onChange('isLoading', false));
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while retrieving travel requests data'
      }))
    })
}

// Delete Travel Request
export const deleteTravelRequests = (id, request_type) => (dispatch) => {
  return axios.delete('/api/security-module/' + request_type + '/' + id)
    .then((res) => {
      dispatch(addFlashMessage({
        type: 'success',
        text: res.data.message
      }))
      return dispatch(getTravelRequests())
    })
    .catch((err) => {
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while deleting the travel request'
      }))
    })
}


// Travel Dashboard - Get Approval Travel Request data
export const getApprovalTravelRequests = () => (dispatch,getState) => {
  let { queryParamsApprovedTravel } = getState().security;

  dispatch(onChange('isLoading', true));
  return axios.get('/api/security-module/approval-travel-requests' + queryParamsApprovedTravel)
    .then(res => {
      if(queryParamsApprovedTravel === defaultApprovedTravel){
        getTravelFromCitiesToday(res.data.data, dispatch);
        getTravelToCitiesToday(res.data.data, dispatch);
        getCurrentlyCitiesOutbound(res.data.data, dispatch);
      }
      dispatch(onChange('isLoading', false));
      return dispatch({ type: TRAVEL_APPROVAL_REQUESTS , name: 'travel_approval_requests', value: formatingTravelDate(res.data.data)})
    })
    .catch(err => {
      dispatch(onChange('isLoading', false));
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while retrieving travel requests data'
      }))
    })
}

// Travel Dashboard - Update trip view status
export const updateTripViewStatus = (id,type,status) => (dispatch) => {
  dispatch(onChange('isLoading', true));
  
  let data = { _method : 'PUT', type: type, status: status};

  return axios.post('/api/security-module/update-trip-view-status/'+ id, data)
    .then(res => {
      dispatch(onChange('isLoading', false));
      dispatch(onChange('loadData', true));

    })
    .catch(err => {
      dispatch(onChange('isLoading', false));
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while retrieving travel requests data'
      }))
    })
}

// Travel Dashboard - Formatting travel date for calendar
const formatingTravelDate = (data) => {
    return data.map((travel)=>{
      return {...travel, start : new Date(travel.date_travel), end : new Date(travel.end_date_travel)};
    });
}

// Travel Dashboard - Formatting data for select field 
const formatingSelectFieldData = (data) => {
  return data.map((city)=>{
    return { label : city, value : city};
  });
}

// Travel Dashboard - Get Today traveling cities(From)
const getTravelFromCitiesToday = (data, dispatch) =>{
  let cities = [];
   data.map(travel =>{
    let today = moment(travel.today_date).format('YYYY-MM-DD');
    let travel_date = moment(travel.date_travel).format('YYYY-MM-DD');

     travel.itineraries.map(itinerary=>{
        if(travel.transportation_type === 'INT'){
          travel_date = moment(itinerary.date_travel).format('YYYY-MM-DD');
        }else{
          travel_date = moment(itinerary.date_time).format('YYYY-MM-DD');
        }

        if((!cities.some(x => x.toLowerCase() === itinerary.from_city.toLowerCase())) &&  (today === travel_date)) {
          cities.push(itinerary.from_city);
        } 
      });
  });
  return dispatch(filterOnChange('allFromCities',formatingSelectFieldData(cities)));
}

// Travel Dashboard - Today traveling cities(To)
const getTravelToCitiesToday = (data,dispatch) =>{
  let cities = [];
   data.map(travel =>{
     
    let today = moment(travel.today_date).format('YYYY-MM-DD');
    let travel_date = moment(travel.date_travel).format('YYYY-MM-DD');

      travel.itineraries.map(itinerary=>{
        if(travel.transportation_type === 'INT'){
          travel_date = moment(itinerary.date_travel).format('YYYY-MM-DD');
        }else{
          travel_date = moment(itinerary.date_time).format('YYYY-MM-DD');
        }

        if((!cities.some(x => x.toLowerCase() === itinerary.to_city.toLowerCase())) &&  (today === travel_date)) {
          cities.push(itinerary.to_city);
        } 
      });

  });
  return dispatch(filterOnChange('allToCities',formatingSelectFieldData(cities)));
}

// Travel Dashboard - Get currently Outbound cities
const getCurrentlyCitiesOutbound = (data,dispatch) =>{
  let cities = [];
   data.map(travel =>{
    let today = moment(travel.today_date).format('YYYY-MM-DD');
    let travel_date = moment(travel.date_travel).format('YYYY-MM-DD');
    let return_travel_date = moment(travel.return_date_travel).format('YYYY-MM-DD');

    if(travel.return_date_travel){
      if(travel.travel_type === 'round-trip'){
        if((!cities.some(x => x.toLowerCase() === travel.to_city.toLowerCase())) &&  (today > travel_date) && (today < return_travel_date)) {
          cities.push(travel.to_city);
        }
      }
    }

    if(travel.travel_type === 'multi-location'){
      let checkRoundTrip = 0;
      let return_travel_date_multi;
      let final_outbound_id;
      travel.itineraries.map((itinerary, index, array)=>{
        if(itinerary.outbound_trip_final_destination == 1){
          checkRoundTrip++;
          if(travel.transportation_type === 'INT'){
            if (!isEmpty(array[index+1])) {
              return_travel_date_multi = moment(array[index+1]['date_travel']).format('YYYY-MM-DD');
              final_outbound_id = itinerary.id;
            }
          }else{
            if (!isEmpty(array[index+1])) {
              return_travel_date_multi = moment(array[index+1]['date_time']).format('YYYY-MM-DD');
              final_outbound_id = itinerary.id;
            }
          }
        }
      });
      if(checkRoundTrip == 1){
        let citiesMulti = [];
        travel.itineraries.map(itinerary=>{
           let travel_date_multi;
            if(travel.transportation_type === 'INT'){
              travel_date_multi = moment(itinerary.date_travel).format('YYYY-MM-DD');
            }else{
              travel_date_multi = moment(itinerary.date_time).format('YYYY-MM-DD');
            }
            if(final_outbound_id >= itinerary.id){
              if((!cities.some(x => x.toLowerCase() === itinerary.to_city.toLowerCase())) &&  (today > travel_date_multi) && (today < return_travel_date_multi) && (itinerary.check_in == 1)) {
                citiesMulti.push(itinerary.to_city);
              }
            }  
        });
        if(citiesMulti.length > 0){
          cities.push(citiesMulti[citiesMulti.length - 1]);
        }
      }
   }
  });
  return dispatch(filterOnChange('allInCities',formatingSelectFieldData(cities)));
}

/**
 * getTravelRequestsForExport is an action to get all travel request data of the current filter.
 * @returns {Promise|File}
 */
 export const getTravelRequestsForExport = () => (dispatch, getState) => {
    let { queryParams } = getState().security

    dispatch(onChange('isLoadingTravelRequestExport', true));

	  return axios.get('/api/security-module/download-travel-requests/' + queryParams, { responseType: 'blob'})
      .then((res) => {
          dispatch(onChange('isLoadingTravelRequestExport', false));
            return FileDownload(
              res.data,
              'Travel-requests-data.xlsx'
            );
      }).catch((err) => {
        return dispatch(
          addFlashMessage({
            type: 'error',
            text: textSelector('error', 'downloadError')
          })
        );
	  });
  }
