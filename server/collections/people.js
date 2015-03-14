People.allow({
  insert: function () { return true; },
  remove: function () { return true; },
  update: function () { return true; }
})

Meteor.publish("people", function () {
  console.log("Publishing")
  return People.find()
})

Meteor.publish("peopleShared", function () {
  this.added("peopleShared", "1", { name: "Alan" })
  this.added("peopleShared", "2", { name: "Cory" })
  var self = this;
  var id = Meteor.setInterval(function () {
    self.changed("peopleShared", "2", { name: "Cory - " + new Date() })
  }, 1000)
  this.ready()

  this.onStop(function () {
    Meteor.clearInterval(id)
  })
})

Meteor.publish("peopleByFirstLetter", function () {
  var self = this;
  var countByLetter = {};
  var initializing = true;
  var updateCount = function (letter, amount) {
    if (!countByLetter[letter]) {
      countByLetter[letter] = 1;
      if (!initializing) {
        self.added("peopleByFirstLetter", letter, {
          letter: letter,
          count: countByLetter[letter]
        })
      }
    } else {
      countByLetter[letter] += amount;
      if (!initializing) {
        self.changed("peopleByFirstLetter", letter, {
          letter: letter,
          count: countByLetter[letter]
        })
      }
    }
  }
  var handle = People.find().observe({
    added: function (doc) {
      var letter = doc.name[0]
      updateCount(letter, 1)
    },
    removed: function (doc) {
      var letter = doc.name[0]
      updateCount(letter, -1)
    },
    changed: function (newDoc, oldDoc) {
      var newLetter = newDoc.name[0]
      var oldLetter = oldDoc.name[0]
      if (newLetter !== oldLetter) {
        updateCount(newLetter, 1)
        updateCount(oldLetter, -1)
      }
    }
  })
  for (var letter in countByLetter) {
    self.added("peopleByFirstLetter", letter, {
      letter: letter,
      count: countByLetter[letter]
    })
  }
  self.ready()
  initializing = false;
  self.onStop(function () {
    handle.stop()
  })

})