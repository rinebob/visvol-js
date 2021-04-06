
const dataSet = [];

function setEnv() {
    document.addEventListener('DOMContentLoaded', () => {
        document
            .getElementById('tickerForm')
            .addEventListener('submit', handleForm);
    });
}



function handleForm(event) {
    event.preventDefault();

    let apikey = 'RDO30LT4K7UY88FL';
    let adjusted = '_ADJUSTED';
    let alphaVantageUrl = 'https://www.alphavantage.co';
    
    let tickerForm = event.target;
    let formData = new FormData(tickerForm);
   
    // console.log('========================');
    // console.log('FORM DATA:');
    // for (let key of formData.keys()) { console.log(key,': ', formData.get(key));}
    // console.log('----------------');


    let intervalType = formData.get('chartTime').endsWith('min') ? 'INTRADAY' : formData.get('chartTime');
    let symbol = formData.get('symbol');
    let intradayInterval = (formData.get('chartTime')).endsWith('min') ? formData.get('chartTime') : '';        
    let extended = formData.get('dataAmount') === 'full' ? '_EXTENDED' : '';
    let outputSize = formData.get('dataAmount');                            // full | compact
    let dataType = formData.get('dataType');  
    
    
    // console.log('OUTPUT DATA:');
    // console.log('intervalType: ', intervalType);
    // console.log('symbol: ', symbol);
    // console.log('interval: ', intradayInterval);
    // console.log('outputSize: ', outputSize);
    // console.log('dataType: ', dataType);
    // console.log('----------------');
    // console.log('URLs');
    

    let intradayUrl = `${alphaVantageUrl}/query?function=TIME_SERIES_${intervalType}${extended}&symbol=${symbol}&interval=${intradayInterval}&outputsize=${outputSize}&datatype=${dataType}&apikey=${apikey}`;
    let dayUrl = `${alphaVantageUrl}/query?function=TIME_SERIES_${intervalType}${adjusted}&symbol=${symbol}&outputsize=${outputSize}&datatype=${dataType}&apikey=${apikey}`;
    let urlToSend = intervalType === 'INTRADAY' ? intradayUrl : dayUrl;

    
    // console.log('intradayUrl: ', intradayUrl);
    // console.log('dayUrl: ', dayUrl);
    // console.log('urlToSend: ', urlToSend);


    sendRequest(urlToSend);
    


}

async function sendRequest(urlToSend) {
    // let data;
    let req = new Request(urlToSend);
    let h = new Headers();
    h.append('Access-Control-Allow-Origin', '*');
    
    const response = fetch(req, {
        headers: h,
    })

    // response.then(res => data = res.json())
    response.then(res => res.json())
    .then(series => {
        prepareJsonForRendering(series['Time Series (Daily)'])
    }); 
}



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
        // console.log('date: ', item[0]);
        // console.log('values: ', item[1]);
        // console.log('open: ', item[1]["1. open"] );
        dataPoint.date = item[0];
        dataPoint.open = item[1]["1. open"];
        dataPoint.high = item[1]["2. high"];
        dataPoint.low = item[1]["3. low"];
        dataPoint.close = item[1]["5. adjusted close"];
        dataPoint.volume = item[1]["6. volume"];

        allData.push({...dataPoint})
        
    }
    
    console.log('all data:');
    console.table(allData);

    return allData;
}

setEnv();

// const request = handleForm();
// const data = sendRequest(request);
// dataSet = prepareJsonForRendering(data);
// console.log('final data set: ', dataSet);

