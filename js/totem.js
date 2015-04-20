window.fullpage = window.fullpage || {
	init : function(options){
		var defaults = {
			direction : 'vertical',
			wrapper : $('.wrapper'),
			cls_pageList : '.pageList',
			cls_pageElem : '.pageElem',
			cls_pageLoading : '',
			cls_handle : '',
			cls_buttonList : '',
			cls_buttonElem : '',
			cls_pre_active : 'page',
			init_page : 0,
			callback : $.noop
		},
		opts = $.extend({},defaults,options);
		opts.wrapper.each(function(){
			var self = $(this),
				pageList = self.find(opts.cls_pageList),
				pageElem = opts.cls_pageLoading ? self.find(opts.cls_pageElem).not(opts.cls_pageLoading) : self.find(opts.cls_pageElem),
				handle = opts.cls_handle ? self.find(opts.cls_handle) : null,
				buttonList = opts.cls_buttonList ? self.find(opts.cls_buttonList) : null,
				buttonElem = buttonList ? buttonList.find(opts.cls_buttonElem) : null,
				height_pageElem,
				height_pageList;
			pageList.append(pageElem.first().clone());
			pageElem = opts.cls_pageLoading ? self.find(opts.cls_pageElem).not(opts.cls_pageLoading) : self.find(opts.cls_pageElem);
			if(opts.direction == 'vertical'){
				height_pageElem = $(window).height();
				height_pageList = height_pageElem * pageElem.length;
				pageElem.css('height',height_pageElem);
			}else if(opts.direction == 'horizontal'){
				height_pageElem = Math.min($(window).width(),640);
				height_pageList = height_pageElem * pageElem.length;
				pageElem.css('width',height_pageElem);
			}
			function loadComplete(){
				if(opts.direction == 'vertical'){
					pageList.css('height',height_pageList);
					pageList.css('top',-opts.init_page * height_pageElem);
				}else if(opts.direction == 'horizontal'){
					pageList.css('width',height_pageList);
					pageList.css('left',-opts.init_page * height_pageElem);
				}
				pageElem.eq(opts.init_page).addClass(opts.cls_pre_active + (opts.init_page + 1) + '_active');
				if(buttonElem){
					buttonElem.removeClass('active').eq(opts.init_page).addClass('active');
				}
				if(opts.callback && $.isFunction(opts.callback)){
					opts.callback({
						init_page : opts.init_page,
						pageList : pageList,
						pageElem : pageElem,
						handle : handle,
						buttonList : buttonList,
						buttonElem : buttonElem,
						height_pageElem : height_pageElem,
						trigger : self
					});
				}
			}
			if(opts.cls_pageLoading){
				self.find(opts.cls_pageLoading).fadeOut('400',function(){
					$(this).remove();
					loadComplete();
				});
			}else{
				loadComplete();
			}
		});
	},
	switch_click : function(options){
		var defaults = {
			trigger : null,
			direction : 'vertical',
			anitimer : 500,
			bindtimer : 2000,
			cls_pre_active : 'page',
			callback : $.noop
		},
		opts = $.extend({},defaults,options);
		opts.trigger.each(function(){
			var self = $(this),
				former_page,current_page,
				pageList = opts.pageList,
				pageElem = opts.pageElem,
				handle = opts.handle,
				buttonList = opts.buttonList,
				buttonElem = opts.buttonElem,
				height_pageElem = opts.height_pageElem,
				length_pageElem = pageElem.length;
			function switch_index(index,page_prev){
				self.data('curpage',index);
				buttonElem && buttonElem.removeClass('active').eq(index).addClass('active');
				if(opts.callback && $.isFunction(opts.callback)){
					opts.callback({
						page_prev : page_prev
					});
				}
			}
			function slide(direction,index){
				former_page = self.data('curpage');
				current_page = index;
				var page_active = pageElem.eq(index),
					page_prev = pageElem.eq(former_page);
				if(current_page == length_pageElem - 2){
					handle && handle.hide();
				}else if(handle && (current_page < length_pageElem - 2) && handle.is(':hidden')){
					handle.show();
				}
				switch(direction){
					case 'vertical' :
						pageList.stop(true,false).animate({top : -current_page * height_pageElem},opts.anitimer,function(){
							if(former_page != current_page){
								page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
								page_prev.removeClass(opts.cls_pre_active + (former_page + 1) + '_active');
								switch_index(current_page,page_prev);
							}
						});
						break;
					case 'horizontal' :
						pageList.stop(true,false).animate({left : -current_page * height_pageElem},opts.anitimer,function(){
							if(former_page != current_page){
								page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
								page_prev.removeClass(opts.cls_pre_active + (former_page + 1) + '_active');
								switch_index(current_page,page_prev);
							}
						});
						break;
					default :
						return false;
				}
			}
			buttonElem.unbind('click').bind('click',function(){
				slide(opts.direction,$(this).index());
			});
		});
	},
	switch_swipe : function(options){
		var defaults = {
			trigger : null,
			direction : 'vertical',
			anitimer : 500,
			bindtimer : 2000,
			cls_pre_active : 'page',
			callback : $.noop
		},
		opts = $.extend({},defaults,options);
		opts.trigger.each(function(){
			var self = $(this),
				startX,startY,endX,endY,changeX,changeY,
				current_page,
				pageList = opts.pageList,
				pageElem = opts.pageElem,
				handle = opts.handle,
				buttonList = opts.buttonList,
				buttonElem = opts.buttonElem,
				height_pageElem = opts.height_pageElem,
				length_pageElem = pageElem.length;
			function switch_index(index,page_prev){
				self.data('curpage',index);
				buttonElem && buttonElem.removeClass('active').eq(index).addClass('active');
				if(opts.callback && $.isFunction(opts.callback)){
					opts.callback({
						page_prev : page_prev
					});
				}
			}
			function slide(direction){
				current_page = self.data('curpage');
				var page_active,page_prev;
				switch(direction){
					case 'up' :
						if(current_page < length_pageElem - 1){
							current_page++;
							if(current_page == length_pageElem - 1){
								pageList.stop(true,false).animate({top : -current_page * height_pageElem},opts.anitimer,function(){
									pageList.css({top : 0});
									current_page = 0;
									page_active = pageElem.eq(current_page);
									page_prev = pageElem.eq(length_pageElem - 2);
									page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
									page_prev.removeClass(opts.cls_pre_active + (length_pageElem - 1) + '_active');
									handle && handle.show();
									switch_index(current_page,page_prev);

								});
							}else{
								if(current_page == length_pageElem - 2){
									handle && handle.hide();
								}
								pageList.stop(true,false).animate({top : -current_page * height_pageElem},opts.anitimer,function(){
									page_active = pageElem.eq(current_page);
									page_prev = page_active.prev();
									page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
									page_prev.removeClass(opts.cls_pre_active + (current_page) + '_active');
									switch_index(current_page,page_prev);
								});
							}
						}
						setTimeout(function(){
							fullpage.switch_swipe(opts);
						},opts.bindtimer);
						break;
					case 'down' :
						if(current_page > 0){
							current_page--;
							if(handle && (current_page < length_pageElem - 2) && handle.is(':hidden')){
								handle.show();
							}
							pageList.stop(true,false).animate({top : -current_page * height_pageElem},opts.anitimer,function(){
								page_active = pageElem.eq(current_page);
								page_prev = page_active.next();
								page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
								page_prev.removeClass(opts.cls_pre_active + (current_page + 2) + '_active');
								switch_index(current_page,page_prev);
							});
						}
						setTimeout(function(){
							fullpage.switch_swipe(opts);
						},opts.bindtimer);
						break;
					case 'right' :
						if(current_page < length_pageElem - 1){
							current_page++;
							if(current_page == length_pageElem - 1){
								pageList.stop(true,false).animate({left : -current_page * height_pageElem},opts.anitimer,function(){
									pageList.css({left : 0});
									current_page = 0;
									page_active = pageElem.eq(current_page);
									page_prev = pageElem.eq(length_pageElem - 2);
									page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
									page_prev.removeClass(opts.cls_pre_active + (length_pageElem - 1) + '_active');
									handle && handle.show();
									switch_index(current_page,page_prev);
								});
							}else{
								if(current_page == length_pageElem - 2){
									handle && handle.hide();
								}
								pageList.stop(true,false).animate({left : -current_page * height_pageElem},opts.anitimer,function(){
									page_active = pageElem.eq(current_page);
									page_prev = page_active.prev();
									page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
									page_prev.removeClass(opts.cls_pre_active + (current_page) + '_active');
									switch_index(current_page,page_prev);
								});
							}
						}
						setTimeout(function(){
							fullpage.switch_swipe(opts);
						},opts.bindtimer);
						break;
					case 'left' :
						if(current_page > 0){
							current_page--;
							if(handle && (current_page < length_pageElem - 2) && handle.is(':hidden')){
								handle.show();
							}
							pageList.stop(true,false).animate({left : -current_page * height_pageElem},opts.anitimer,function(){
								page_active = pageElem.eq(current_page);
								page_prev = page_active.next();
								page_active.addClass(opts.cls_pre_active + (current_page + 1) + '_active');
								page_prev.removeClass(opts.cls_pre_active + (current_page + 2) + '_active');
								switch_index(current_page,page_prev);
							});
						}
						setTimeout(function(){
							fullpage.switch_swipe(opts);
						},opts.bindtimer);
						break;
					default :
						return false;
				}
			}
			$(this).unbind('touchstart').bind('touchstart',function(){
				startX = event.targetTouches[0].pageX;
				startY = event.targetTouches[0].pageY;
				$(this).unbind('touchmove').bind('touchmove',function(){
					event.preventDefault();
				});
				$(this).unbind('touchend').bind('touchend',function(){
					endX = event.changedTouches[0].pageX;
					endY = event.changedTouches[0].pageY;
					changeX = endX - startX;
					changeY = endY - startY;
					if(Math.abs(changeY) >= 50 && Math.abs(changeY) > Math.abs(changeX) && opts.direction == 'vertical'){
						$(this).unbind('touchstart touchend');
						if(changeY > 0){
							slide('down');
						}else{
							slide('up');
						}
					}else if(Math.abs(changeX) >= 50 && Math.abs(changeX) > Math.abs(changeY) && opts.direction == 'horizontal'){
						$(this).unbind('touchstart touchend');
						if(changeX > 0){
							slide('left');
						}else{
							slide('right');
						}
					}
				});
			});
			$(this).one('mousewheel',function(){
				if(opts.direction == 'vertical'){
					if(event.wheelDelta > 0){
						slide('down');
					}else{
						slide('up');
					}
				}
			});
			$(this).one('DOMMouseScroll',function(e){
				if(opts.direction == 'vertical'){
					if(e.originalEvent.detail < 0){
						slide('down');
					}else{
						slide('up');
					}
				}
			});
		});
	},
	share : function(options){
		var defaults = {
			cls_btn : '.btn_share',
			cls_con : '.con_share'
		},
		opts = $.extend({},defaults,options),
		btn = $(opts.cls_btn),
		con = $(opts.cls_con);
		function show_share(event){
			con.fadeIn();
		}
		function hide_share(){
			con.fadeOut();
		}
		btn.bind('click',show_share);
		con.bind('click',hide_share);
	}
};
window.wolf_totem = window.wolf_totem || {
	showMore : function(options){
		var defaults = {
			cls_wrapper : '.box_info',
			cls_btn_info_show : '.btn_info_show',
			cls_btn_info_close : '.btn_info_close',
			cls_con_info : '.con_info'
		},
		opts = $.extend({},defaults,options);
		$(opts.cls_wrapper).each(function(){
			var btn_info_show = $(this).find(opts.cls_btn_info_show),
				btn_info_close = $(this).find(opts.cls_btn_info_close),
				con_info = $(this).find(opts.cls_con_info),
				hide_ifshow = $(this).find('.hide_ifshow');
			btn_info_show.bind('click',function(){
				$(this).hide();
				hide_ifshow.hide();
				con_info.show().stop(true,false).animate({opacity : 1},500);
			});
			btn_info_close.bind('click',function(){
				con_info.stop(true,false).animate({opacity : 0},500,function(){
					con_info.hide();
					btn_info_show.show();
					hide_ifshow.show();
				});
			});
		});
	},
	hideMore : function(options){
		var defaults = {
			cls_wrapper : '.box_info',
			cls_btn_info_show : '.btn_info_show',
			cls_con_info : '.con_info'
		},
		opts = $.extend({},defaults,options),
		con_info,
		btn_info_show,
		hide_ifshow;
		if(opts.page_prev.hasClass(opts.cls_wrapper.substring(1)) || opts.page_prev.find(opts.cls_wrapper).length > 0){
			con_info = opts.page_prev.find(opts.cls_con_info);
			con_info.each(function(){
				var self = $(this);
				btn_info_show = self.siblings(opts.cls_btn_info_show);
				hide_ifshow = self.siblings('.hide_ifshow');
				if(self.is(':visible')){
					btn_info_show.show();
					hide_ifshow.show();
					self.css('opacity',0).hide();
				}
			});
		}
	},
	init : function(){
		fullpage.init({
			cls_pageLoading : '.page_loading',
			cls_handle : '.handle',
			callback : function(options){
				fullpage.switch_swipe($.extend({},{
					callback : function(options){
						wolf_totem.hideMore(options);
					}
				},options));
				fullpage.init({
					direction : 'horizontal',
					wrapper : $('.role'),
					cls_pageList : '.roleList',
					cls_pageElem : '.roleElem',
					cls_buttonList : '.buttonList',
					cls_buttonElem : '.buttonElem',
					init_page : 2,
					cls_pre_active : 'role',
					callback : function(options){
						fullpage.switch_swipe($.extend({},{
							direction : 'horizontal',
							cls_pre_active : 'role',
							callback : function(options){
								wolf_totem.hideMore(options);
							}
						},options));
						fullpage.switch_click($.extend({},{
							direction : 'horizontal',
							cls_pre_active : 'role',
							callback : function(options){
								wolf_totem.hideMore(options);
							}
						},options));
					}
				});
				fullpage.init({
					direction : 'horizontal',
					wrapper : $('.comment'),
					cls_pageList : '.commentList',
					cls_pageElem : '.commentElem',
					cls_buttonList : '.buttonList',
					cls_buttonElem : '.buttonElem',
					init_page : 0,
					cls_pre_active : 'comment',
					callback : function(options){
						fullpage.switch_swipe($.extend({},{
							direction : 'horizontal',
							cls_pre_active : 'comment',
							callback : function(options){
								wolf_totem.hideMore(options);
							}
						},options));
					}
				});
				wolf_totem.showMore();
				fullpage.share();
			}
		});
	}
};
window.onload = function(){
	wolf_totem.init();
}