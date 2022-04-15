/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */
import axios from "axios";

const api = "https://blue-bottle-api-test.herokuapp.com/v1"
const apiHeaders = {'Accept': 'application/json'}

export async function getNearestShops(position) {
    try {
        const token = await getTokens()
        const coffeeShops = await getCoffeeShops(token)
        const nearShops = await getNearbyShops(position, coffeeShops, 3)
        console.log('NearbyShops: ', nearShops) // I left this for viewing purposes
        return nearShops

    } catch (error) {
        console.log(`ERROR ${error.type}: ${error.data}`)
    }
}

function getTokens() {
    return new Promise((resolve, reject) => {
        axios.post(`${api}/tokens`, {headers: apiHeaders})
            .then(response => {
                resolve(response.data.token)
            })
            .catch(error => {
                reject({type: 'TOKEN CREATE', data: error})
            })
    })
}

function getCoffeeShops(token) {
    return new Promise((resolve, reject) => {
        axios.get(`${api}/coffee_shops?token=${token}`, {headers: apiHeaders})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject({type: 'COFFEESHOP FETCH', data: error})
            })
    })
}

function getNearbyShops(userPosition, shops, limit) {
    return new Promise((resolve, reject) => {
        let shopsWithUserDistance = []
        for (let i = 0; i < shops.length; i++) {
            shops[i]['distance'] = calculateDistance(shops[i]['x'], shops[i]['y'], userPosition['lat'], userPosition['lng']).toFixed(4)
            shopsWithUserDistance.push(shops[i])
        }

        const closestShops = shopsWithUserDistance.sort((a, b) => a.distance - b.distance)

        resolve(limit ? closestShops.slice(0, limit) : closestShops)
    })
}

// SOURCE: https://geodatasource.com/developers/javascript
function calculateDistance(lat1, lon1, lat2, lon2, unit = 'K') {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}