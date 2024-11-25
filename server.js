const express = require('express');
const path = require('path');
const app = express();
const ejs = require('ejs'); 

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var data;

function fetchDataJSON(){
    const data = require('./data.json');
    return data;
}


/*
Main page GET function - renders index.ejs
*/
app.get('/',(req, res) => {
    data = fetchDataJSON();
    //log(data);
    const query = '';
    return res.render('index', {data: data, query: query});
});

/*
Main page /search function, the search uses ajax and does not re-render the page
*/
app.get('/search', async (req, res) => {
  const query = req.query.query.toLowerCase();
  if(data.length==0){
    data = fetchDataJSON();
  }
  const sortedData = data.filter(item => {
    const positionMatch = item.position.toLowerCase().includes(query);
    const companyMatch = item.company.toLowerCase().includes(query);
    const languagesMatch = item.languages.some(language => language.toLowerCase().includes(query));
    const toolsMatch = item.tools.some(tool => tool.toLowerCase().includes(query));
    const levelMatch = item.level.toLowerCase().includes(query);

    return positionMatch || companyMatch || languagesMatch || toolsMatch || levelMatch;
  });

  const jobHTMLPromises = sortedData.map(elt => {
    return ejs.renderFile(path.join(__dirname, 'views/partials/jobListing.ejs'), { elt });
});

const html = await Promise.all(jobHTMLPromises);

res.send(html.join(''));
  });


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });