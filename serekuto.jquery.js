;(function ( $, window, document, undefined ) {

		var pluginName = "serekuto",
		defaults = {
				containerName: "serekutoResults",
				calculatePosition: function(){ return this.calculatePosition(); },
				placeholderText: ""
		};

		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {
				init: function () {
		            this.container = $('#'+this.settings.containerName);

		            if(this.container.length == 0){
		                this.container = $('<div>', { id: this.settings.containerName });
		                $('body').append(this.container);
		                this.container = $('#'+this.settings.containerName);
		                this.container.hide();
		            }
		            this.container.bind("mouseenter", function(){ $(this).addClass("hover"); });
		            this.container.bind("mouseleave", function(){ $(this).removeClass("hover"); });
		            this.container.bind("mouseup", $.proxy(function() { this.searchBox.focus(); },this) );
					var el = $(this.element);
					el.hide();
					this.searchBox = $('<input>', { "class": "serekuto", "id": el.attr('id') + "_serekuto", "placeholder": this.settings.placeholderText });
					this.searchBox.bind("propertychange",$.proxy(this.search,this));
					this.searchBox.bind("input",$.proxy(this.search,this));
					this.searchBox.bind("keydown",$.proxy(this.keyDown,this));
					this.searchBox.bind('focusout',$.proxy(this.focusOut, this));
					el.after(this.searchBox);
				},
				_pregQuote: function( str ) {
				    return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
				},
				_compareItem: function(item, term) {
					var pregQuote = this._pregQuote;
					var text = $(item).text();
					var tags = $(item).attr("data-tags")? $(item).attr("data-tags") : "";
                    var parentText = $(item).parent('optgroup').attr('label');
                    var parentTags = $(item).parent('optgroup').attr("data-tags")? $(item).parent('optgroup').attr("data-tags") : "";
					if( (
                        text.toLowerCase().indexOf(term.toLowerCase()) != -1
                        || parentText.toLowerCase().indexOf(term.toLowerCase()) != -1
                        || tags.toLowerCase().indexOf(term.toLowerCase()) != -1
                        || parentTags.toLowerCase().indexOf(term.toLowerCase()) != -1
                        ) && term != ""){
						var result = $('<div>', {"class":"resultItem", "data-value": $(item).val(), "data-text": text });
						result.html(text.replace(new RegExp( "(" + pregQuote( term ) + ")" , 'gi' ),"<strong>$1</strong>"));
						var _self = this;
						result.bind("click", function(){ _self.searchBox.val($(this).text()); _self.validate(); });
						return result;
					}else{
						return -1;
					}
				},
				search: function (event) {
					var _self = this;
					var term = this.searchBox.val();
					var container = this.container.html("");
					var compareItem = this._compareItem;
					var optgroups = $(this.element).find("optgroup");

					if(optgroups.length > 0 ){
						optgroups.each( function(){
							var options = new Array();
							$(this).find("option").each( function(){
									var result = $.proxy(compareItem, _self, this, term );
									if(result() != -1){
										options.push(result);
									}
							});
							if(options.length > 0){
								var title = $('<div>', {"class":"groupTitle"}).html($(this).attr("label"));
								container.append(title);
								for(var i = 0; i < options.length; i++){
									container.append(options[i]);
								}
							}
						});
					}else{
						$(this.element).find("option").each( function(){
								var result = $.proxy(compareItem, _self, this, term );
								if(result() != -1){
									container.append(result);
								}
						});
					}
					if(container.html() == ""){
						container.hide();
					}else{
						container.show();
						container.offset($.proxy(this.settings.calculatePosition,this));
					}

				},
				calculatePosition: function(){
					return { top: this.searchBox.offset().top + this.searchBox.outerHeight(), left: this.searchBox.offset().left};
				},
				keyDown: function(event){
					if(event.keyCode == 40 || event.keyCode == 38){ //up,down
						var activeItem = $('#'+this.settings.containerName+ " .resultItem.active");
						if(activeItem.length == 0){
							activeItem = $('#'+this.settings.containerName+ " .resultItem").first();
							activeItem.addClass('active');
						}else{
							activeItem.removeClass("active");
							if(event.keyCode == 40)
								activeItem = activeItem.nextAll('.resultItem').first().addClass('active');
							if(event.keyCode == 38)
								activeItem = activeItem.prevAll('.resultItem').first().addClass('active');
						}
						if(activeItem.length == 0){
							activeItem = $('#'+this.settings.containerName+ " .resultItem").first();
							activeItem.addClass('active');
						}
						var scrollTop = parseInt(this.container.scrollTop());
						var scrollTopHeight = parseInt(scrollTop + this.container.height());
						var activeItemTop = parseInt(scrollTop + activeItem.position().top);
						if( !(activeItemTop >= scrollTop && activeItemTop <= scrollTopHeight) )
							this.container.scrollTop(activeItemTop)
						event.preventDefault();
					}
					if(event.keyCode == 13){ //enter
						var activeItem = $('#' + this.settings.containerName + " .resultItem.active");
						if(activeItem.length > 0){
							this.searchBox.val(activeItem.text());
							this.validate();
						}
						this.container.html("");
						event.preventDefault();
					}
				},
				validate: function(){
					var term = this.searchBox.val();
					var container = this.container.html("");
					var preg_quote = this._preg_quote;
					var match = false;
					$(this.element).find("option").each( function(){
						var text = $(this).text();
						if(text.toLowerCase() == term.toLowerCase() && term != ""){
							match = true;
							$(this).attr("selected",true);
						}else{
							$(this).attr("selected",false);
						}
					});
					if(!match){
						this.searchBox.val("");
						$(this.element).find("option").attr("selected",false);
					}
					container.removeClass("hover");
					container.hide();
				},
				focusOut: function(){
					if(!this.container.hasClass("hover")){
						$.proxy(this.validate,this)();
					}
				}
		};

		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
				return this;
		};

})( jQuery, window, document );
