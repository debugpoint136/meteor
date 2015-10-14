PlayersList = new Meteor.Collection('players');

if (Meteor.isClient){

  /* set up subscribe */
  Meteor.subscribe('thePlayers');

  /* helper functions */
  Template.leaderboard.helpers({
    player: function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({ createdBy: currentUserId }, {sort: {score: -1, name: 1}});
    },
    selectedClass: function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      
      if (selectedPlayer === playerId) {
        return 'selected';
      }
    },

    showSelectedPlayer: function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne({_id: selectedPlayer});
    }
  });

  Template.leaderboard.events({
    'click li.player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
    },
    'click #increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, 5);
    },
    'click #decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, -5);
    },
    'click #remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    }
  });

Template.addPlayerForm.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var playerNameVar = template.find('#playerName').value;
    Meteor.call('insertPlayerData', playerNameVar);
  }
});

}

/*######################SERVER##############################*/

if (Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  })

  Meteor.methods({
    'insertPlayerData': function(playerNameVar){
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      })
    },

    'removePlayer': function(selectedPlayer){
      PlayersList.remove(selectedPlayer);
    }, /* end removePlayer */

    'modifyPlayerScore': function(selectedPlayer, scoreValue) {
      PlayersList.update({_id: selectedPlayer}, {$inc: {score: scoreValue}});
    } //** modifyPlayerScore


  }) /* methods */
} /* isServer*/
