Polymer({
	"is":"jet-plugin",
	"properties":{
		/**
			 * `src` URI for the plugin file
			 *
			 * @property src
			 * @type string
			 */
		src:{type:String,
			observer:"loadPlugin"},

		/**
			 * `name` Name of the plugin
			 *
			 * @property name
			 * @type string
			 */
		name:{type:String},
		/**
			 * `defer` Flag to mark the plugin can be loaded anytime.
			 *
			 * @property defer
			 * @type boolean
			 * @default false
			 */
		defer:{type:Boolean}
	},
	"ready":function(){
		if (this.src){
			this.loadPlugin();
		}
	},
	"loadPlugin":function(){
		var self = this;
		hasJET(function () {
			JET.Plugins.require(self.name, self.src, self.defer);
		});
	}
});