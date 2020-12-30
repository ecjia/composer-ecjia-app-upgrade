// JavaScript Document
;
(function(app, $) {
	app.upgrade = {
		// init: function() {
		// 	//版本文件变动
		// 	$('.old_version_item').click(function() {
		// 		//展开
		// 		var $this = $(this);
		// 		if ($this.attr('class') == 'fontello-icon-angle-double-down') {
		// 			$this.attr('class','fontello-icon-angle-double-up')
		// 			if (typeof($this.parent().next('ul').html()) == 'undefined') {
		// 				var params = "v=" + $this.attr('data-ver');
		// 				var url = $(".old_version").attr('data-url');
		// 				$.ajax({
		// 					type: 'post',
		// 					url: url,
		// 					data: params,
		// 					async: false,
		// 					success: function(result) {
		// 						if (result.state == 'error') {
		// 							smoke.alert(result.message, {ok: js_lang.ok,});
		// 						} else if (result.state == 'success') {
		// 							var files='<ul class=""><li>'+ js_lang.update_content +'</li><li><pre>'+ result.readme +'</pre></li></ul>';
		// 							$this.parent().css({'margin-bottom': 0, 'border-radius': '4px 4px 0 0'}).after(files);
		// 						}
		// 					},
		// 					error:function(rs) {
		// 						console.log(rs.responseText);
		// 					}
		// 				});
		// 			} else {
		// 				$this.parent().css({'margin-bottom': 0, 'border-radius': '4px 4px 0 0'}).next().show();
		// 			}
		// 		} else {
		// 			//关闭
		// 			$this.attr('class','fontello-icon-angle-double-down');
		// 			$this.parent().css({'margin-bottom': '10px', 'border-radius': '4px'}).next('ul').hide();
		// 		}
		// 	});
		// },

		// //初始化配置必填项验证
		// start: function() {
		// 	var version_current = $('input[name="version_current"]').val();
		// 	var version_last = $('input[name="version_last"]').val();
		// 	//验证是否确认覆盖数据库
		// 	if (version_current == version_last) {
		// 		smoke.alert(js_lang.latest_version, {ok: js_lang.ok,});
		// 		return false;
		// 	}
		// 	start_upgrade();
		// },

	};

	// var lf = "<br />";
	// var notice = null;
	// var notice_html = '';
	// var correct_img = $('input[name="correct_img"]').val();
	// var error_img = $('input[name="error_img"]').val();
	
	var count = ver_list.length;

	function progress(val) {
		var html;
		if (val == 100) {
			html = js_lang.installation_complete
		} else {
			html = val + '%';
		}
		$('.progress-bar').css('width', val + '%');
		$('.progress-bar').html(html);
	}
	
	function start_upgrade() {
		$('body').scrollTop(0).css('height', '100%');
		$('#js_ecjia_intro').css('display', 'none');
		$('.path').children('li').removeClass('current').eq(1).addClass('current');

		progress(10);
		upgrade();
		return false;
	}

	//安装程序
	function upgrade() {
		$("#js-monitor").css('display', 'block');
		$('#js-monitor-notice').css('display', 'block');

		each_upgrade(ver_list, upgrade_post);
	}
	
	function each_upgrade(list, callback) {
		if (ver_list.length > 0) {
			$ver = list[0];
			callback($ver);
		}
		if (list.length == 0) {
			var url = $('input[name="done"]').val();
			window.setTimeout(function() {
				location.href = url;
			}, 1500);
		}
	}
	
	function upgrade_post(version) {
		var params = "v=" + version;
		var url = $(".ajax_upgrade_url").val();
		
		$.post(url, params, function(result) {
			if (result.state == 'error') {
				var msg = js_lang.upgrading + version;
				ErrorMsg(msg, result.message);
				return false;
			} 
			if (result.state == 'success') {
				var msg = '<div class="install_notice">'+ js_lang.upgrading + version + '</div>';
				SuccessMsg(msg);
				ver_list.shift();
				progress_step = parseInt((count - ver_list.length) / count * 100);
				progress(progress_step);
				each_upgrade(ver_list, upgrade_post);
			}
			if (typeof(result.state) == 'undefined') {
				var msg = js_lang.upgrading + version;
				ErrorMsg(msg, 0);
			}
		});
	}

	//提示程序安装终止信息
	function stopNotice() {
		$("#js-monitor-wait-please").html(js_lang.installation_aborted);
	}

	//显示完成（成功）信息
	function SuccessMsg($msg) {
		$msg += "<span class='install_correct'><img src=" + correct_img + ">"+ js_lang.success +"</span>" + lf;
		$('#js-notice').append($msg);
	}

	//显示错误信息
	function ErrorMsg(result, tip) {
		stopNotice();
		notice_html += '<div class="install_notice">' + result + '</div>';
		notice_html += "<span class='install_error'><img src=" + error_img + ">"+ js_lang.fail +"</span></strong>" + lf;
		$("#js-monitor-notice").css('display', "block");
		if (tip) {
			notice_html += "<span class='m_l30' style='color:red'"+ js_lang.prompt + tip + "</span>" + lf;
		}
		$('#js-notice').append(notice_html);
		$('#js-install-return-once').css('display', 'block');
		return false;
	}

    //消息提示
    app.notice = {
        notice_html: '',

        success_notice_template: function (status) {
            let correct_img = $('input[name="correct_img"]').val();
            return "<span class='install_correct'><img alt='' src='" + correct_img + "' />"+ status + "</span><br/>";
        },

        error_notice_template: function (status, msg) {
            let error_img = $('input[name="error_img"]').val();
            return "<span class='install_error'><img alt='' src='" + error_img + "' />" + status + "</span><br/>" +
                "<strong class='m_l30 ecjia-color-red'>"+ msg + "</strong>";
        },

        install_notice_template: function (msg) {
            return '<div class="install_notice">'+ msg + '</div>';
        },

        open: function () {
            $("#js-monitor").css('display', 'block');
            $('#js-monitor-notice').css('display', 'block');
            //清除之前的缓存数据
            app.notice.clear();
        },

        clear: function () {
            app.notice.notice_html = '';
            $('#js-notice').html(app.notice.notice_html);
        },

        show: function (html) {
            app.notice.notice_html += html;
            $('#js-notice').html(app.notice.notice_html);
        },

        stop: function () {

        },

        success: function (html) {
            app.notice.notice_html += html;
            $('#js-notice').html(app.notice.notice_html);
        },

        error: function (html) {
            app.notice.notice_html += html;
            $("#js-monitor-notice").css('display', "block");
            $('#js-notice').html(app.notice.notice_html);
            $('#js-install-return-once').css('display', 'block');
        },

        addSubject: function (text) {
            app.notice.show(app.notice.install_notice_template(text));
        },

        addErrorMessage: function (msg) {
            app.notice.error(app.notice.error_notice_template(js_lang.fail, msg));
        },

        addSuccessMessage: function () {
            app.notice.success(app.notice.success_notice_template(js_lang.success));
        },

        addNumTips: function (num) {
            let text = sprintf(js_lang.remainder, num);
            let html = "<span class='install_correct' id='numtips'>"+ text + "</span>";
            $('#js-notice').append(html);
        },

        updateNumTips: function (num) {
            let text = sprintf(js_lang.remainder, num);
            $('#numtips').html(text);
        },

        removeNumTips: function () {
            $('#numtips').remove();
        }

    }

    //安装进度条
    app.progress_bar = {
        //开启
        reset: function () {
            let val = 0;
            let html = val + '%';
            let progress_bar_el = $('.progress-bar');
            progress_bar_el.css('width', val + '%');
            progress_bar_el.html(html);
        },

        complete: function () {
            let val = 100;
            let html = val + '%';
            let progress_bar_el = $('.progress-bar');
            progress_bar_el.css('width', val + '%');
            progress_bar_el.html(html);
        },

        update: function (val) {
            let html = val + '%';
            let progress_bar_el = $('.progress-bar');
            progress_bar_el.css('width', val + '%');
            progress_bar_el.html(html);
        }
    }

    //更新预览
    app.readme_view = {
	    //打开折叠
        isOpen: function (element) {
            return element.hasClass('fontello-icon-angle-double-up');
        },
	    open: function (element) {
            element.removeClass('fontello-icon-angle-double-down');
            element.addClass('fontello-icon-angle-double-up');
        },

        //关闭折叠
        isClose: function (element) {
            return element.hasClass('fontello-icon-angle-double-down');
        },
        close: function (element) {
            element.removeClass('fontello-icon-angle-double-up');
            element.addClass('fontello-icon-angle-double-down');
        },

        //添加内容
        addReadmeContent: function (element, readme) {
            let files='<ul>' +
                '<li>'+ js_lang.update_content +'</li>' +
                '<li><pre>'+ readme +'</pre></li>' +
                '</ul>';
            element.parent().css({'margin-bottom': 0, 'border-radius': '4px 4px 0 0'});
            element.parent().after(files);
        },

        //获取内容
        getReadmeContent: function (element) {
            return element.parent().next('ul').html();
        }
    }

    //升级任务
    app.task = {
	    //启动
        starting: function() {
            $('body').scrollTop(0).css('height', '100%');
            $('#js_ecjia_intro').css('display', 'none');
            $('.path').children('li').removeClass('current').eq(1).addClass('current');

            progress(10);
            upgrade();
            return false;
        }
    }

})(ecjia.front, jQuery);

//end