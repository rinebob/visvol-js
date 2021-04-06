


// create event listener for form submit action
function setEnv() {
    document.addEventListener('DOMContentLoaded', () => {
        document
            .getElementById('tickerForm')
            // .addEventListener('submit', handleForm);
            .addEventListener('submit', handleForm);
    });
}


// generate request URL from form data
// function handleForm(event) {
function generateUrl(event) {
    console.log('event: ', event);
    event.preventDefault();  

    let apikey = 'RDO30LT4K7UY88FL';
    let adjusted = '_ADJUSTED';
    let alphaVantageUrl = 'https://www.alphavantage.co';
    
    let tickerForm = event.target;
    let formData = new FormData(tickerForm);
   
    let intervalType = formData.get('chartTime').endsWith('min') ? 'INTRADAY' : formData.get('chartTime');
    let symbol = formData.get('symbol');
    let intradayInterval = (formData.get('chartTime')).endsWith('min') ? formData.get('chartTime') : '';        
    let extended = formData.get('dataAmount') === 'full' ? '_EXTENDED' : '';
    let outputSize = formData.get('dataAmount');                            // full | compact
    let dataType = formData.get('dataType');  
    
    let intradayUrl = `${alphaVantageUrl}/query?function=TIME_SERIES_${intervalType}${extended}&symbol=${symbol}&interval=${intradayInterval}&outputsize=${outputSize}&datatype=${dataType}&apikey=${apikey}`;
    let dayUrl = `${alphaVantageUrl}/query?function=TIME_SERIES_${intervalType}${adjusted}&symbol=${symbol}&outputsize=${outputSize}&datatype=${dataType}&apikey=${apikey}`;
    let urlToSend = intervalType === 'INTRADAY' ? intradayUrl : dayUrl;

    // console.log('urlToSend: ', urlToSend);
    return urlToSend;
}

// create and send data request; store json response data in global var
async function getData(urlToSend) {
    let data;
    let req = new Request(urlToSend);
    let h = new Headers();
    h.append('Access-Control-Allow-Origin', '*');
    
    const response = fetch(req, {
        headers: h,
    })

    // response.then(res => data = res.json())
    response
        .then(res => res.json())
        .then(series => {
            data = prepareJsonForRendering(series['Time Series (Daily)']);
            console.log('data:');
            console.log(data);

            finalData = data;

        })
        .catch(error => console.log('fetch error: ', error)); 
}


// helper function to generate data in desired format
function prepareJsonForRendering(data) {
    let dataPoint = {
        date: '',
        open: '',
        high: '',
        low: '',
        close: '',
        volume: ''
    };

    let allData = [];

    for (const item of Object.entries(data)) {
        dataPoint.date = item[0];
        dataPoint.open = item[1]["1. open"];
        dataPoint.high = item[1]["2. high"];
        dataPoint.low = item[1]["3. low"];
        dataPoint.close = item[1]["5. adjusted close"];
        dataPoint.volume = item[1]["6. volume"];

        allData.push({...dataPoint})
        
    }
    
    return allData;
}

function handleForm(event) {
    const url = generateUrl(event);
    console.log('url: ', url);

    // const dataSet = getData(url);
    getData(url);
}

let finalData = [];
setEnv();

