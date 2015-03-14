Template.home.onCreated(function () {
  this.subscribe("people")
  //this.subscribe("peopleShared")
  this.subscribe("peopleByFirstLetter")
  People.find().observe({
    added: function (doc) {
      console.log("Added:")
      console.log(doc)
    },
    removed: function (doc) {
      console.log("Removed:")
      console.log(doc)
    },
    changed: function(newDoc, oldDoc)
    {
      console.log("Changed From:")
      console.log(oldDoc)
      console.log("Changed To:")
      console.log(newDoc)
    }

  })
})

Template.home.helpers({
  people: function () {
    console.log("In Helper")
    return People.find()
  },
  peopleByFirstLetter: function () {
    return PeopleByFirstLetter.find()
  }
})