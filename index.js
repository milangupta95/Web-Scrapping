const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

let data;

axios.get("https://www.github.com/topics").
then(function(res) {
    data = res.data;
    const dom = new JSDOM(data);
    const topics = dom.window.document.querySelectorAll(".topic-box");
    for(let i = 0;i < topics.length;i++) {
        let topic = topics[i];
        let title = topic.querySelector("p").textContent;
        title = title.trim();
        fs.mkdir(title,function(){
            console.log("Folder Created SuccessFully");
        });
        let link = topic.querySelector("a").getAttribute("href");
        link = "http://www.github.com" + link;
        axios.get(link).then(function(res) {
            let dataFromTopic = res.data;
            let topicKadom = new JSDOM(dataFromTopic);
            let articles = topicKadom.window.document.querySelectorAll("article");
            console.log(title);
            for(let i=0;i<8;i++) {
                let article = articles[i];
                let articleKaTopic = article.querySelector("h3").textContent;
                let articleKaTopicKaArray = articleKaTopic.split("/");
                let issuesKaLink = "http://www.github.com/" + articleKaTopicKaArray[0].trim() + "/" + articleKaTopicKaArray[1].trim() + "/issues";
                let issueDataKaArray = [];
                axios.get(issuesKaLink).then(function(res){
                    let issuseKaHTML = res.data;
                    let isusesKaDom = new JSDOM(issuseKaHTML);
                    let issueKaData = isusesKaDom.window.document.querySelectorAll(".js-issue-row");
                    for(let i = 0;i < issueKaData.length;i++) {
                        let issueData = issueKaData[i].querySelector("a").textContent;
                        issueDataKaArray.push(issueData);
                    }
                    issuesKaJSON = {
                        data: issueDataKaArray
                    }
                    let articleKaTopic = articleKaTopicKaArray[0].trim();
                    let path = title + "/" + articleKaTopic + ".json";
                    fs.writeFileSync(path,JSON.stringify(issuesKaJSON),function() {
                        console.log(articleKaTopic + " Created SuccessFully");
                    });
                }).catch(function(err){
                    console.log("Error:",err.message);
                })
                console.log(issuesKaLink);
            }
        }).catch(function(err){
            console.log(err.message);
        })
        // console.log(title + link);
    }
    console.log(topics.length);
}).catch(function(err) {
    console.log(err.message);
})
