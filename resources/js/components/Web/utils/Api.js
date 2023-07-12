import axios from 'axios';

export default axios.create({
	baseURL: 'http://127.0.0.1:8000/api/',
	timeout: 3000,
	headers: { 'X-Custom-Header': 'foobar' }
});
