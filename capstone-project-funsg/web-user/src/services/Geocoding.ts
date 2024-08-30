import axios from 'axios';

export const getLatLngFromAddress = async (address:string) => {
    const apiKey = "AIzaSyAtgfov5-GzFBD0Qsim70NOWMbTpMT0RzU";
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const { results } = response.data;
        if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            return { lat, lng };
        } else {
            throw new Error('地址未找到');
        }
    } catch (error) {
        console.error('获取经纬度失败:', error);
        return null;
    }
};


