define(["require","exports"],function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){this.$el=e,this.initDelUser()}return e.prototype.initDelUser=function(){this.$el.find(".deleteUser").on("click",function(e){e.preventDefault();var n=$(e.currentTarget),r=$(e.currentTarget).parents("form").first(),t=__t("admin","deleteUserConfirm").replace(/%NAME%/,n.data("name"));bootbox.confirm(t,function(e){if(e){var t=n.data("id");r.append('<input type="hidden" name="deleteUser" value="'+t+'">'),r.submit()}})})},e}();t.UserList=n});
//# sourceMappingURL=UserList.js.map