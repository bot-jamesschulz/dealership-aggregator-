const fs = require('fs');
const makes = require('./bikeData/makesRegexes.json');
const findModel = require('./findModel');
const listingResults = require('./listings/listingResults1-27_15-42-35.json');
const testListingResults = require('./listingsTest.json');
const excludedWords = JSON.parse(fs.readFileSync('./sanitizationTesting/excludedWords.json', 'utf-8'));
const regexToMake = JSON.parse(fs.readFileSync('./bikeData/regexToMake.json', 'utf-8'));
const bikeData = JSON.parse(fs.readFileSync('./bikeData/bikeData.json', 'utf-8'));

// Unique listing urls with appended makes to listings
const uniqueListingUrls = new Set();
const results = [];
const extractedData = [];
const rejectedListings = [];
const validYearPattern = /(?:(?<=^)|(?<=\s))((19|20)([0-9][0-9]))(?=\s|$)/g;
let loopCount = 0;

for (const siteObject of listingResults) {
    
    const dealershipHostName = siteObject?.dealershipUrl ? new URL(siteObject.dealershipUrl)?.hostname.replace(/^www\./, '').replace(/\.[^.]+$/, '') : null;

    const listingtypes = Object.keys(siteObject).slice(1);
    for (const listingtype of listingtypes) {
        if (Array.isArray(siteObject[listingtype])) {
            const listings = siteObject[listingtype];
            for (const listingData of listings) {
                loopCount++;
                console.log('LOOP COUNT: ', loopCount);
                const url = listingData?.url ? new URL(listingData.url) : null;
                const listingHostName = url?.hostname.replace(/^www\./, '').replace(/\.[^.]+$/, '');
                         
                if (!url || uniqueListingUrls.has(url.href) || listingHostName !== dealershipHostName)  continue;        
                
                uniqueListingUrls.add(url);
                
                let listing = listingData?.listing 

                let cleanedListing = listing
                    .replace(/[^\w\.\/\s\u2013\u2014\u2212-]/g, '') // Remove any abnormal characters
                    .replace(/\s+/g, ' ')                           // Replace consecutive spaces with a single space
                    .trim();                                        // Trim leading and trailing spaces
                
                const validYears = cleanedListing.match(validYearPattern);
                const noLetters = !cleanedListing.match(/[a-zA-Z]/);
                
                if (!validYears || noLetters) continue;

                const validYear = validYears[0];
                const yearStartIndex = cleanedListing.indexOf(validYear);
                let yearEndIndex = yearStartIndex + validYear.length - 1;
                
                // Add a space after the year if it doesn't already have one
                if (cleanedListing[yearEndIndex + 1] && cleanedListing[yearEndIndex + 1] !== ' ') {
                    cleanedListing = cleanedListing.slice(0, yearEndIndex + 1) + ' ' + cleanedListing.slice(yearEndIndex);
                }

                // remove all characters besides letters and numbers
                const alphaNumListing = cleanedListing
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]/g, '');

                const hasExcludedWords = excludedWords.some(word => alphaNumListing.includes(word));

                if (hasExcludedWords) continue;

                let listingMake = null;
                let makeKey = null;
                const listingHasMake = makes.some(make => {
                    const makeRegex = new RegExp(`\\b(${make})\\b`, 'i');
                    const match = cleanedListing.match(makeRegex);
                    
                    if (match) {
                        makeKey = regexToMake[make];
                        listingMake = match[0];
                        return true
                    }
                     return false;
                });
                   
                // If there is no make in the listing try to find one in the href
                if (!listingHasMake) {                     
                    const hostNameHasMake = makes.some(make => {
                        const makeRegex = new RegExp(`(${make})`, 'i');
                        const match = listingHostName.match(makeRegex);
                        if (match) {
                            makeKey = regexToMake[make];
                            listingMake = match[0];
                            return true
                        }
                        return false;
                    });         
                    
                    if (hostNameHasMake && listingMake) {
                        
                        cleanedListing = `${listingMake.charAt(0).toUpperCase() + listingMake.slice(1)} ${cleanedListing}`;
                        yearEndIndex += listingMake.length -1;
                        // Special case for harley websistes
                    } else if (listingHostName.startsWith('hd') || listingHostName.endsWith('hd')){
                        makeKey = 'harley-davidson';
                        listingMake = 'Harley-Davidson';
                        cleanedListing = `Harley-Davidson ${cleanedListing}`;
                        yearEndIndex += listingMake.length -1;
                    } else {
                        rejectedListings.push(cleanedListing);
                        continue;
                    }
                }



                if (!makeKey) {
                    console.log(`No make key for ${listingMake}: ${cleanedListing}`);
                    
                }

                const makeKeyStartIndex = cleanedListing.indexOf(listingMake);
                const makeKeyEndIndex = makeKeyStartIndex + listingMake.length - 1;

                const modelData = bikeData[makeKey];
                const models = modelData.map(model => model.model);
                const listingModel = findModel(cleanedListing.toLowerCase(), models, [makeKeyEndIndex, yearEndIndex]);
                // if (true) {
                //     console.log('MODEL: -> ', listingModel);
                //     console.log('LISTING: -> ', cleanedListing);
                //     console.log('\n');           
                // }    
                
                if (listingModel) { 
                    results.push(cleanedListing);
                    extractedData.push({
                        make: makeKey,
                        listingMake: listingMake,
                        model: listingModel,
                        year: validYear,
                        listing: cleanedListing,
                        url: url.href
                    })
                } else {
                    rejectedListings.push(cleanedListing);
                }
            }
        }
    }
}

fs.writeFile('./sanitizationTesting/listingsCleanTest1-27_15-42-35.json', JSON.stringify(results) , 'utf-8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
fs.writeFile('./sanitizationTesting/extractedData.json', JSON.stringify(extractedData) , 'utf-8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
fs.writeFile('./sanitizationTesting/rejectedListings.json', JSON.stringify(rejectedListings) , 'utf-8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});