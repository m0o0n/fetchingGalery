import axios from "axios";
const pixabayApi = axios.create({
    baseURL: 'https://pixabay.com/api/?key=38661528-d945b4671dc1d38083bff1d33&per_page=40',
})

async function fetchImages(page, q){
    const {data: {hits}} = await pixabayApi.get('', {
        params: {
            page,
            q
        }
    })
    return hits
}

export {pixabayApi, fetchImages}