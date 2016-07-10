// Authorization Functions and Helpers

export const authorized = {
  student: function(userId) {
    var user = _getUser(userId);
    return !!(user);
  },

  ta: function(userId, course) {
    // Always pass userId, won't work otherwise
    if(authorized.admin(userId) ||
      authorized.hta(userId, course)) {
      return true;
    }

    var user = _getUser(userId);
    if(!user) return false;
    if(!user.taCourses) return false;

    if(!course) {
      // TODO: This breaks lots of UIs if user is
      // TA for an inactive course.
      return user.taCourses.length > 0;
    } else {
      return user.taCourses.indexOf(course) != -1;
    }
  },

  hta: function(userId, course) {
    // Always pass userId, won't work otherwise
    if(authorized.admin(userId)) return true;

    var user = _getUser(userId);
    if(!user) return false;
    if(!user.htaCourses) return false;

    if(!course) {
      // TODO: This breaks lots of UIs if user is
      // TA for an inactive course.
      return user.htaCourses.length > 0;
    } else {
      return user.htaCourses.indexOf(course) != -1;
    }
  },

  admin: function(userId){
    var user = _getUser(userId);
    if(!user) return false;

    return user.admin;
  }
};

if(Meteor.isClient) {
  UI.registerHelper("userIs", function(role, course) {
    if (!(typeof course === "string")) course = null;
    return authorized[role](Meteor.userId(), course);
  });
}