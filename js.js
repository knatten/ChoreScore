var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");
var personsFile = "persons.json";


var Save = function()
{
    console.log("Saving data to " + personsFile);
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
    }, function(error){
        console.log("Failed to load data from " + personsFile)
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
    if (newPerson.value.length == 0)
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

var persons = Observable();

var newPerson = Observable("");

module.exports = {
    persons:persons,
    bumpScore:bumpScore,
    addPerson:addPerson,
    newPerson:newPerson,
    resetScores:resetScores
}

Load();