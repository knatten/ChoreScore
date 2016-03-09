var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");
var personsFile = "persons.json";


var Save = function()
{
    console.log("Saving data to " + personsFile);
    //debug();
    var serialized = [];
    persons.forEach(function(p){serialized.push({'name':p.name, 'score':p.score.value})});
    var result = Storage.writeSync(personsFile, JSON.stringify(serialized));
    console.log("Result of saving file: " + result);
}

var Load = function()
{
    console.log("Loading data from " + personsFile);
    Storage.read(personsFile).then(function(content){
        console.log("Loaded data from file:");
        console.log(content);
        console.log("Populating model");
        var deserialized = JSON.parse(content);
        persons.clear();
        deserialized.forEach(
            function(p)
            {
                console.log("Adding from deserialized: " + p.name);
                persons.add(new Person(p.name, p.score));
            });
        console.log("Done populating model");
        //debug();
    }, function(error){
        console.log("Failed to load data from " + personsFile)
        console.log(error);
    }).catch(function(error){
        console.log("CAUGHT!");
        console.log(error);
    });
}

function Person(name, score)
{
    this.name = name;
    this.score = Observable(score);
}

function addPerson(sender)
{
    var found = false;
    persons.forEach(function(p){
        if (p.name == newPerson.value)
        {
            found = true;
        }
    });
    if (found || newPerson.value.length == 0)
        return;

    console.log("Adding person " + newPerson.value);
    persons.add(new Person(newPerson.value, 0));
    newPerson.value="";
    Save();
}

function bumpScore(sender)
{
    console.log("Scored " + sender.data.name);
    sender.data.score.value = sender.data.score.value + 1;
    Save();
    sortPersons();
}

function resetScores()
{
    console.log("Resetting scores");
    persons.forEach(function(p)
        {
            p.score.value = 0;
        });
    Save();
}

function debug()
{
    console.log("Persons is now " + persons.length + " long");
    persons.forEach(function(p){
        console.log("  " + p.name + p.score);
    });
    console.log("sortedByScore is now " + sortedByScore.length + " long");
    sortedByScore.forEach(function(p){
        console.log("  " + p.name + p.score);
    });
}

var persons = Observable();
var sortedByScore = Observable();
var sortedByName = Observable();

function sortPersons()
{
    console.log("## Sorting persons")
    var tmp = [];
    persons.forEach(function(p){
        tmp.push(p);
    });
    tmp.sort(function(a,b)
    {
        return a.score.value < b.score.value;
    });
    sortedByScore.clear();
    for (var i=0; i< tmp.length; i++)
    {
        sortedByScore.add(tmp[i]);
    }
    tmp.sort(function(a,b)
    {
        return a.name > b.name;
    });
    sortedByName.clear();
    for (var i=0; i< tmp.length; i++)
    {
        sortedByName.add(tmp[i]);
    }
}

persons.addSubscriber(sortPersons);

var newPerson = Observable("");

module.exports = {
    sortedByScore:sortedByScore,
    sortedByName:sortedByName,
    bumpScore:bumpScore,
    addPerson:addPerson,
    newPerson:newPerson,
    resetScores:resetScores
}

console.log(" ");
Load();
