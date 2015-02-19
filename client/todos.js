// Get tasks collection from server
Tasks = new Mongo.Collection("tasks");


    // Get tasks from Mongo
	Template.body.helpers({
	  tasks: function () {
	    if (Session.get("hideCompleted")) {
	      // If hide completed is checked, filter tasks
	      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
	    } else {
	      // Otherwise, return all of the tasks
	      return Tasks.find({}, {sort: {createdAt: -1}});
	    }
	  },
		incompleteCount: function () {
		  return Tasks.find({checked: {$ne: true}}).count();
		}
	});


    // Insert Todos when .new-task form is submitted
    Template.body.events({
        "submit .new-task": function(event) {


        	console.log(Meteor.user());
        	
            var text = event.target.text.value;

            Meteor.call("addTask", text);

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        },
		"change .hide-completed input": function (event) {
		  Session.set("hideCompleted", event.target.checked);
		}
    });


	Template.task.events({
	  "click .toggle-checked": function () {
	    
	    Meteor.call("setChecked", this._id, !this.checked);

	  },
	  "click .delete": function () {

        Meteor.call("deleteTask", this._id);

      }
	});


	Accounts.ui.config({
	  passwordSignupFields: "USERNAME_ONLY"
	});

