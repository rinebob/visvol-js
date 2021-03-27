// import {alphaVantage_api_key} from 'secret.json';

document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('tickerForm')
        .addEventListener('submit', handleForm);
    
});

function handleForm(event) {
    event.preventDefault();
    let tickerForm = event.target;
    let formData = new FormData(tickerForm);
    // formData.append('api_key', alphaVantage_api_key);

    console.log('========================');
    console.log('FORM DATA:');
    for (let key of formData.keys()) {
        console.log(key,': ', formData.get(key));
    }
    console.log('----------------');


    let intervalType = formData.get('chartTime').endsWith('min') ? 'INTRADAY' : formData.get('chartTime');

    let alphaVantageUrl = 'https://www.alphavantage.co';
    let fn = intervalType;                          // INTRADAY | DAILY | WEEKLY | MONTHLY
    let symbol = formData.get('symbol');

    // 1min | 5min | 10min | 15min | 30min | 60min 
    
    let intradayInterval = (formData.get('chartTime')).endsWith('min') ? formData.get('chartTime') : '';        
    let adjusted = '_ADJUSTED';
    let extended = formData.get('dataAmount') === 'full' ? '_EXTENDED' : '';
    let outputSize = formData.get('dataAmount');                            // full | compact
    let dataType = 'json';                              // json | csv
    let apikey = 'RDO30LT4K7UY88FL';

    console.log('OUTPUT DATA:');
    console.log('intervalType: ', intervalType);
    console.log('symbol: ', symbol);
    console.log('interval: ', intradayInterval);
    console.log('outputSize: ', outputSize);
    console.log('dataType: ', dataType);

    console.log('----------------');
    console.log('URLs');
    

    let intradayUrl = `${alphaVantageUrl}/query?function=TIME_SERIES_${fn}${extended}&symbol=${symbol}&interval=${intradayInterval}&outputsize=${outputSize}&datatype=${dataType}&apikey=${apikey}`;

    let dayUrl = `${alphaVantageUrl}/query?
        function=TIME_SERIES_${fn}${adjusted}
        &symbol=${symbol}
        &outputsize=${outputSize}
        &datatype=${dataType}
        &apikey=${apikey}`;

    let urlToSend = intervalType === 'INTRADAY' ? intradayUrl : dayUrl;

    
    console.log('intradayUrl: ', intradayUrl);
    console.log('dayUrl: ', dayUrl);
    console.log('urlToSend: ', urlToSend);

    console.log('----------------');
    console.log('REQUEST:');

    let req = new Request(urlToSend);

    let h = new Headers();
    h.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    
    fetch(req, {
        headers: h,
    })
        .then((res) => { 
            const reader = res.body.getReader();
            console.log('raw response: ', res);
            console.log('response.body: ', res.body);
            console.log('reader: ', reader);
            
        })
        .then(reader => { 
            const data = reader.read();
            
        })
        .then(
            (data) => {
                console.log('data received:');
                console.log(data);
            }
        ).catch('error: ', console.warn);

    console.log('url sent: ', urlToSend)
    console.log('reqest sent: ', req)

    



}

// TIME_SERIES_INTRADAY
// &function=TIME_SERIES_INTRADAY
// &symbol=TSLA
// &interval=1min
// &adjusted=true
// &outputsize=full
// &datatype=csv
// &apikey=<>

// TIME_SERIES_INTRADAY_EXTENDED
// TIME_SERIES_DAILY
// TIME_SERIES_DAILY_ADJUSTED
// TIME_SERIES_WEEKLY
// TIME_SERIES_WEEKLY_ADJUSTED
// TIME_SERIES_MONTHLY
// TIME_SERIES_MONTHLY_ADJUSTED
// GLOBAL_QUOTE
// SYMBOL_SEARCH

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo