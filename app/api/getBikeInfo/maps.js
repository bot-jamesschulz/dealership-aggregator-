import axios from 'axios';

export default async function getDealerships() {

    const PLACES_KEY = process.env.MAPS_API_KEY;

    const Ids = [
        'ChIJ4_mXwtwzw4ARzPaldkRtbho',
        'ChIJmdDB_cgz3YAR51Txhfxq22g',
        'ChIJ1z5WGxi3woAR_x3jrbHrkHA',
        'ChIJL2x36aky3YARx9tB8s4zgx8',
        'ChIJ47LxDA4ow4ARi8k1zZRjgRY',
        'ChIJkROCaH_TwoARhgBA-FjxPSY',
        'ChIJe3p2bA7BwoAR_FcXxo1V2h4',
        'ChIJmR0npkC0woARd7dLh9pNX6E',
        'ChIJrY5CJPXf3IARoT-E61OyMSc',
        'ChIJyxIsvvTNwoARPNAGIhIjpmo',
        'ChIJKRXkCL4q3YAREkCS7uhhCXs',
        'ChIJvxswj922woARlHf5o4cnl1E',
        'ChIJk37Tyvc03YAR1eOa8szDLQE',
        'ChIJe25VOpzf3IARZVUwzbOwMYs',
        'ChIJNU7OlWrV3IARQsXlAdhscxw',
        'ChIJIeqZ42vX3IARB2FxsNTNQMQ',
        'ChIJnVMbbWLJ3IARof3-x-pjTqM',
        'ChIJcyxhTpXIwoARnSDVrUkJ74s',
        'ChIJMSCsK-wm3YARWvrVxuGnO7Q',
        'ChIJizuuc-fbwoARVx0JpHVA9g8'
    ];

    let websites;   

    websites = [
        'http://www.mtnride.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'https://longbeach.delamomotorsports.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'http://www.lacyclesports.com/',
        'https://www.motounitedbellflower.com/?utm_source=GMBlisting&utm_medium=organic',
        'http://www.bertsmegamall.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'https://www.motounitedwhittier.com/',
        'http://hondaofglendale.com/',
        'https://redondobeach.delamomotorsports.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'https://orangecounty.delamomotorsports.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'https://losangeles.delamomotorsports.com/',
        
        'http://www.motounitedlahabra.com/',
        'http://www.nextmotorcycle.com/',
        'http://socalhondapowersports.com/',
        'http://www.ocmotorcycle.com/',
        'http://www.socalmotorcycles.com/',
        'https://orangehonda.com/?utm_source=google&utm_medium=organic&utm_campaign=google_my_business&utm_content=website_button',
        'http://www.maalimotorsports.com/',
        'https://www.farhanenterprises.net/',
        'http://hbhonda.com/',
        'http://www.arcadiamotorcycleco.com/'
    ];

    const websites25KM = [
        //"https://www.motounitedwhittier.com/",

        "https://www.kawasaki.com/",
        "http://www.rpecycle.com/",
        "http://bertusjawacz.blogspot.com/",
        "http://www.statusmotorsports.co/",
        
        "https://jamcitycycles.com/",
        "http://www.krazykatzmoto.com/",
        "http://crashmotogear.com/",
        "http://highpointpowersports.com/",

        "http://www.miraipower.com/contact.us.asp",

        //"http://www.socalmotorcycles.com/",
        //"http://www.arcadiamotorcycleco.com/"
    ]

    const testingWebsites = [
        'http://www.mtnride.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'http://www.lacyclesports.com/',
        'https://www.motounitedbellflower.com/?utm_source=GMBlisting&utm_medium=organic',
        'http://www.bertsmegamall.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',

        'http://hondaofglendale.com/',
        'https://redondobeach.delamomotorsports.com/?utm_source=google&utm_medium=organic&utm_campaign=GMB-service',
        'http://www.nextmotorcycle.com/',
        'http://socalhondapowersports.com/',

        'http://www.ocmotorcycle.com/',
        'http://www.socalmotorcycles.com/',
        'https://orangehonda.com/?utm_source=google&utm_medium=organic&utm_campaign=google_my_business&utm_content=website_button',
        'http://www.maalimotorsports.com/',

        'https://www.farhanenterprises.net/',
        'http://hbhonda.com/',
        'http://www.arcadiamotorcycleco.com/'
    ];
    const nearbyEndpoint = 'https://places.googleapis.com/v1/places:searchText';
    const detailsEndpoint = 'https://places.googleapis.com/v1/places/';
    const nearbyQuery = 'motorcycle dealership';
    const nearbyFieldMask = 'places.id';
    const detailsFieldMask = 'displayName,websiteUri,types,formattedAddress';
    
    const nearbyConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': PLACES_KEY,
            'X-Goog-FieldMask': nearbyFieldMask,
        }
    };
    const detailsConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': PLACES_KEY,
            'X-Goog-FieldMask': detailsFieldMask,
        }
    };


    const data = {
        "textQuery": nearbyQuery,
        "locationBias": {
            "circle": {
                "center": {
                "latitude": 34,
                "longitude": -118
                },
                "radius": 20000
            }
        }
    };

    // try {
    //     // const placesNearbyRes = await axios.post(nearbyEndpoint, data, nearbyConfig);

    //     // // const placeIds = placesNearbyRes.data.places.map(place => place.id);
    //     // // console.log(`Results: ${JSON.stringify(placeIds)}`)
    //     // const placeIds = ["ChIJkROCaH_TwoARhgBA-FjxPSY","ChIJj_lcaH_TwoARuLpS3IGiHm0","ChIJFTBa4nrRwoARLSulR6U8sOM","ChIJl0L6aKTXwoARmya6ndx9S_c","ChIJ-1Gx8GzWwoARj-nGDZiE3oQ","ChIJdypODMHTwoARslMcJNDPuu4","ChIJ7Yqj1YrQwoAR7OI3ASTur0w","ChIJacx9DKLXwoARTga1YqEqOvc","ChIJ7-e_BRPXwoAR-_YtO0HE8fU","ChIJF4zSHfXWwoARVU-ox38Nc40","ChIJCeatQ0LTwoARlnkFB6DaZl0","ChIJKRXkCL4q3YAREkCS7uhhCXs","ChIJ3-nDfhDTwoARFIEOdUNhF70","ChIJP4hRUxnRwoARa2_lXerFvJg","ChIJmVo0AqbRwoARO7jQA4P-wuM","ChIJNU7OlWrV3IARQsXlAdhscxw","ChIJR6cKM-PIwoARw1x_vMUseQ8","ChIJrWrJRzHXwoARlAIvtvgVpVo","ChIJizuuc-fbwoARVx0JpHVA9g8"]

        

    //     // const placesDetails= await Promise.all(placeIds.map(async (placeId) => {
    //     //     const res = await axios.get(`${detailsEndpoint}${placeId}`, detailsConfig);
    //     //     return res.data;
    //     // }));



    //     console.log(`placesDetails${JSON.stringify(placesDetails)}`);

    //     // const placeIds = placesNearbyRes.data.results.map(r => r.place_id);
        
    //     // websites = await Promise.all(Ids.map(async (Id) => {
    //     //     let placeId = Id
    //     //     const placeDetailsConfig = {
    //     //         ...placesNearbyConfig,
    //     //         url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website&key=${mapsKey}`
    //     //     }
            
    //     //     const placeDetailsRes = await axios(placeDetailsConfig);
    //     //     const website = placeDetailsRes.data.result.website;
    //     //     return website;
    //     // }));
        
    //     //console.log(websites);
    // } catch(err) {
    //     console.error(`Error: ${err.message}`);
    //     console.error(`Response data: ${JSON.stringify(err.response?.data)}`);
    //     console.error(`Response status: ${err.response?.status}`);
    //     console.error(`Response headers: ${JSON.stringify(err.response?.headers)}`);
    // };
    //return [websites[0],websites[1],websites[3],websites[4],websites[5],websites[6],websites[7],websites[8],websites[9]];
    //return [websites[4]];
    //return websites.slice(0,20)
    return [websites25KM[7]];
};